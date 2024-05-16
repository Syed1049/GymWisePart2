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
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    fetchEquipmentList();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!selectedEquipment) {
        throw new Error('Please select an equipment.');
      }
  
      const selectedEquipmentData = equipmentList.find(equipment => equipment.equipmentid === selectedEquipment);
  
      if (!selectedEquipmentData) {
        throw new Error('Invalid selected equipment.');
      }
  
      if (selectedEquipmentData.weighted_category && (!weight || !quantity)) {
        throw new Error('Please enter both weight and quantity for weighted equipment.');
      }
  
      if (!selectedEquipmentData.weighted_category && !quantity) {
        throw new Error('Please enter quantity for non-weighted equipment.');
      }
  
      const equipmentId = selectedEquipmentData.equipmentid;
      const equipmentName = selectedEquipmentData.equipmentname;
      const equipmentQuantity = quantity ? parseInt(quantity) : 1;
  
      const insertedInstances = await addEquipmentInstances(equipmentId, equipmentName, equipmentQuantity, weight);
  
      setSelectedEquipment('');
      setQuantity('');
      setWeight('');
  
      Alert.alert('Success', 'Equipment added successfully.');
      console.log('success: equipment and instances added');
    } catch (error) {
      console.error('Error adding equipment:', error.message);
      Alert.alert('Error', `Failed to add equipment. ${error.message}`);
    }
  };
  const addEquipmentInstances = async (equipmentId, equipmentName, quantity, weight = null) => {
    try {
      console.log('Equipment ID:', equipmentId);
  
      const insertedInstances = [];
  
      // Fetch existing unique identifiers for the selected equipment
      const { data: existingInstances, error: instancesError } = await supabase
        .from('equipment_instances')
        .select('unique_identifier')
        .eq('equipmentid', equipmentId);
  
      if (instancesError) {
        throw instancesError;
      }
  
      // Find the last unique identifier from the existing instances
      const lastIdentifier = existingInstances.reduce((last, instance) => {
        const numberPart = parseInt(instance.unique_identifier.slice(-3), 10);
        return Math.max(last, numberPart);
      }, 0);
  
      // Generate instances with dynamically incremented unique identifiers
      const instances = [];
  
      for (let i = lastIdentifier + 1; i <= lastIdentifier + quantity; i++) {
        const uniqueIdentifier = `${equipmentName.toLowerCase().replace(/\s+/g, '')}${('000' + i).slice(-3)}`;
  
        instances.push({
          equipmentid: equipmentId,
          unique_identifier: uniqueIdentifier,
          weight: weight ? parseFloat(weight) : null,
          availability: true,
        });
      }
  
      console.log('Adding equipment instances:', instances);
  
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredSection}>
        <Text style={styles.heading}>Add Equipment</Text>
        <View style={styles.form}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Equipment:</Text>
            <Picker
              selectedValue={selectedEquipment}
              onValueChange={(itemValue) => setSelectedEquipment(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Equipment" value="" />
              {equipmentList.map((equipment) => (
                <Picker.Item key={equipment.equipmentid} label={equipment.equipmentname} value={equipment.equipmentid} />
              ))}
            </Picker>
          </View>
          {selectedEquipment && equipmentList.find(equipment => equipment.equipmentid === selectedEquipment)?.weighted_category && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight:</Text>
              <TextInput
  style={styles.input}
  value={weight}
  onChangeText={(text) => {
    if (/^\d*$/.test(text) || text === '') {
      setWeight(text);
    } else {
      // Notify the user that only numbers are allowed
      Alert.alert('Error', 'Please enter numbers only.');
    }
  }}
  placeholder="Enter Weight"
  keyboardType="numeric"
/>

            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity:</Text>
            <TextInput
  style={styles.input}
  value={quantity}
  onChangeText={(text) => {
    if (/^\d*$/.test(text) || text === '') {
      setQuantity(text);
    } else {
      // Notify the user that only numbers are allowed
      Alert.alert('Error', 'Please enter numbers only.');
    }
  }}
  placeholder="Enter Quantity"
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
