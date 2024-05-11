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

const ManageEquipmentScreen = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedInstance, setSelectedInstance] = useState('');
  const [instancesList, setInstancesList] = useState([]);
  const [weight, setWeight] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');

  useEffect(() => {
    fetchEquipmentList();
  }, []);

  useEffect(() => {
    if (selectedEquipment) {
      fetchEquipmentInstances(selectedEquipment);
    }
  }, [selectedEquipment]);

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

  const fetchEquipmentInstances = async (equipmentId) => {
    try {
      const { data, error } = await supabase
        .from('equipment_instances')
        .select('*')
        .eq('equipmentid', equipmentId);
      if (error) {
        throw error;
      }
      setInstancesList(data);
    } catch (error) {
      console.error('Error fetching equipment instances:', error.message);
    }
  };

  const handleDeleteInstance = async () => {
    try {
      if (!selectedInstance) {
        throw new Error('Please select an equipment instance.');
      }

      // Delete the selected equipment instance
      const { error } = await supabase
        .from('equipment_instances')
        .delete()
        .eq('unique_identifier', selectedInstance);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Equipment instance deleted successfully.');
      console.log('Success: Equipment instance deleted');
    } catch (error) {
      console.error('Error deleting equipment instance:', error.message);
      Alert.alert('Error', 'Failed to delete equipment instance. Please try again.');
    }
  };

  const handleEditInstance = async () => {
    try {
      if (!selectedInstance) {
        throw new Error('Please select an equipment instance.');
      }

      if (!weight && !uniqueIdentifier) {
        throw new Error('Please enter weight or unique identifier.');
      }

      const updates = {};
      if (weight) {
        updates.weight = weight;
      }
      if (uniqueIdentifier) {
        updates.unique_identifier = uniqueIdentifier;
      }

      // Update the selected equipment instance
      const { error } = await supabase
        .from('equipment_instances')
        .update(updates)
        .eq('unique_identifier', selectedInstance);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Equipment instance updated successfully.');
      console.log('Success: Equipment instance updated');
    } catch (error) {
      console.error('Error updating equipment instance:', error.message);
      Alert.alert('Error', 'Failed to update equipment instance. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredSection}>
        <Text style={styles.heading}>Manage Equipment</Text>
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
          {selectedEquipment && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Select Equipment Instance:</Text>
              <Picker
                selectedValue={selectedInstance}
                onValueChange={(itemValue) => setSelectedInstance(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Instance" value="" />
                {instancesList.map((instance) => (
                  <Picker.Item key={instance.unique_identifier} label={instance.unique_identifier} value={instance.unique_identifier} />
                ))}
              </Picker>
            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Weight:</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={(text) => setWeight(text)}
              placeholder="Enter New Weight"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Unique Identifier:</Text>
            <TextInput
              style={styles.input}
              value={uniqueIdentifier}
              onChangeText={(text) => setUniqueIdentifier(text)}
              placeholder="Enter New Unique Identifier"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleEditInstance}>
            <Text style={styles.buttonText}>Edit Instance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDeleteInstance}>
            <Text style={styles.buttonText}>Delete Instance</Text>
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
    borderRadius: 80,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManageEquipmentScreen;
