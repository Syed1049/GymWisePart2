import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from './supabase';

const AddEquipmentScreen = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [manualEquipmentName, setManualEquipmentName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');
  useEffect(() => {
    fetchEquipmentList();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!selectedEquipment && !manualEquipmentName) {
        throw new Error('Please select or enter an equipment name.');
      }
  
      const equipmentName = selectedEquipment ? selectedEquipment : manualEquipmentName;
      const equipmentQuantity = quantity ? parseInt(quantity) : 1; // Default to 1 if quantity is not provided
  
      const equipmentId = await addEquipment({ equipmentname: equipmentName, quantity: equipmentQuantity });
  
      if (equipmentId) {
        const insertedInstances = await addEquipmentInstances(equipmentId, equipmentName, equipmentQuantity, weight);
        console.log('Inserted instances:', insertedInstances);
      }
  
      setSelectedEquipment('');
      setManualEquipmentName('');
      setQuantity('');
      setWeight('');
  
      Alert.alert('Success', 'Equipment added successfully.');
      console.log('success: equipment and instances added');
    } catch (error) {
      console.error('Error adding equipment:', error.message);
      Alert.alert('Error', 'Failed to add equipment. Please try again.');
    }
  };
  
  
  
  const addEquipment = async (equipmentData) => {
    try {
      const { data, error } = await supabase.from('equipment').insert([equipmentData], { returning: 'minimal' });
  
      if (error) {
        throw error;
      }
  
      // Fetch the latest inserted ID
      const { data: insertedData, error: insertedError } = await supabase
        .from('equipment')
        .select('equipmentid')
        .order('equipmentid', { ascending: false })
        .limit(1);
  
      if (insertedError) {
        throw insertedError;
      }
  
      const lastInsertedId = insertedData[0].equipmentid;
      console.log(lastInsertedId);
      return lastInsertedId;
    } catch (error) {
      console.error('Error adding equipment:', error.message);
      throw error;
    }
  };
  
  

  const fetchEquipmentList = async () => {
    try {
      const { data, error } = await supabase.from('equipment').select('*');
      if (error) {
        throw error;
      }
      setEquipmentList(data);
    } catch (error) {
      console.error('Error fetching equipment list:', error.message);
    }
  };

  const addEquipmentInstances = async (equipmentId, equipmentName, quantity, weight = null) => {
    try {
      console.log('Equipment ID:', equipmentId);
  
      const insertedInstances = [];
  
      // Generate an array of equipment instances
      const instances = Array.from({ length: quantity }, (_, i) => {
        const uniqueIdentifier = `${equipmentName.toLowerCase().replace(/\s+/g, '')}${('000' + (i + 1)).slice(-3)}`;
        return {
          equipmentid: equipmentId,
          unique_identifier: uniqueIdentifier,
          weight: weight ? parseFloat(weight) : null,
          availability: true,
        };
      });
  
      console.log('Adding equipment instances:', instances);
  
      // Insert all instances in a single operation
      const { error } = await supabase.from('equipment_instances').insert(instances, { returning: 'minimal' });
  
      if (error) {
        throw error;
      }
  
      console.log('Equipment instances inserted successfully.');
  
      return insertedInstances;
    } catch (error) {
      console.error('Error adding equipment instances:', error.message);
      throw error;
    }
  };
  
  
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredSection}>
        <Text style={styles.heading}>Add Equipment</Text>
        <View style={styles.form}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Equipment:</Text>
            <Picker
              enabled={!manualEquipmentName}
              selectedValue={selectedEquipment}
              onValueChange={(itemValue) => {
                setSelectedEquipment(itemValue);
                setManualEquipmentName('');
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Equipment" value="" />
              {equipmentList.map((equipment) => (
                <Picker.Item key={equipment.equipmentid} label={equipment.equipmentname} value={equipment.equipmentid} />
              ))}
            </Picker>
          </View>
          {!selectedEquipment && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Equipment Name:</Text>
              <TextInput
                style={styles.input}
                value={manualEquipmentName}
                onChangeText={(text) => setManualEquipmentName(text)}
                placeholder="Enter Equipment Name"
              />
            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
              placeholder="Enter Quantity"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Weight (Optional):</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={(text) => setWeight(text)}
              placeholder="Enter Weight (Optional)"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Equipment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredSection: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#CA9329',
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CA9329',
    borderRadius: 30,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#CA9329',
    padding: 15,
    borderRadius: 55,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEquipmentScreen;
