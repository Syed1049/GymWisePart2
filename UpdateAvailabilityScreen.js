import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Switch } from 'react-native-switch';
import { supabase } from './supabase';

const UpdateAvailabilityScreen = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedInstance, setSelectedInstance] = useState('');
  const [instancesList, setInstancesList] = useState([]);
  const [availability, setAvailability] = useState(true);

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

  const handleUpdateAvailability = async () => {
    try {
      if (!selectedInstance) {
        throw new Error('Please select an equipment instance.');
      }

      // Update availability of selected equipment instance
      const { error } = await supabase
        .from('equipment_instances')
        .update({ availability: availability })
        .eq('unique_identifier', selectedInstance);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Availability updated successfully.');
      console.log('Success: Availability updated');
    } catch (error) {
      console.error('Error updating availability:', error.message);
      Alert.alert('Error', 'Failed to update availability. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredSection}>
        <Text style={styles.heading}>Update Equipment Availability</Text>
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
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Availability:</Text>
            <Switch
              value={availability}
              onValueChange={(value) => setAvailability(value)}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdateAvailability}>
            <Text style={styles.buttonText}>Update Availability</Text>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#CA9329',
    padding: 15,
    borderRadius: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateAvailabilityScreen;
