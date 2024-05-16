import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase';

const SetGymTimingsScreen = () => {
  const navigation = useNavigation();
  const [gymTimings, setGymTimings] = useState([]);
  const [editedTimings, setEditedTimings] = useState([]);

  // Fetch gym timings from the database
  useEffect(() => {
    fetchGymTimings();
  }, []);

  const fetchGymTimings = async () => {
    try {
      const { data, error } = await supabase.from('gym_timings').select('*');
      if (error) {
        throw new Error(error.message);
      }
      setGymTimings(data);
      setEditedTimings(data);
    } catch (error) {
      console.error('Error fetching gym timings:', error.message);
    }
  };

  // Handle input change for edited gym timings
  const handleInputChange = (index, key, value) => {
    const updatedTimings = [...editedTimings];
    updatedTimings[index][key] = value;
    setEditedTimings(updatedTimings);
  };

  // Handle toggle for closing gym
  const handleToggleCloseGym = (index) => {
    const updatedTimings = [...editedTimings];
    updatedTimings[index].closed = !updatedTimings[index].closed;
    setEditedTimings(updatedTimings);
  };

  // Handle update gym timings
  const handleUpdateGymTimings = async () => {
    try {
      // Update gym timings in the database
      const promises = editedTimings.map(async (timing) => {
        await supabase.from('gym_timings').update(timing).eq('id', timing.id);
      });
      await Promise.all(promises);
      // Refresh gym timings after update
      await fetchGymTimings();
      // Optionally, navigate to another screen after update
      // navigation.navigate('AnotherScreen');
    } catch (error) {
      console.error('Error updating gym timings:', error.message);
    }
  };

  // Render function for gym timings input fields
  const renderGymTimingsInputs = () => {
    return editedTimings.map((timing, index) => (
      <View key={index} style={styles.timingInput}>
        <Text style={styles.timingLabel}>{timing.day}</Text>
        <TextInput
          style={styles.timeInput}
          value={timing.opening_time}
          onChangeText={(value) => handleInputChange(index, 'opening_time', value)}
        />
        <TextInput
          style={styles.timeInput}
          value={timing.closing_time}
          onChangeText={(value) => handleInputChange(index, 'closing_time', value)}
        />
        <TouchableOpacity
          style={[styles.toggleSwitch, timing.closed ? styles.toggleSwitchOff : styles.toggleSwitchOn]}
          onPress={() => handleToggleCloseGym(index)}
        >
          <Text style={styles.toggleSwitchText}>{timing.closed ? 'Closed' : 'Open'}</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  // Component UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Set Gym Timings</Text>
        <ScrollView>
          {renderGymTimingsInputs()}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleUpdateGymTimings}>
          <Text style={styles.buttonText}>Update Gym Timings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010102',
    padding: 20,
  },
  content: {
    flex: 1,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timingInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timingLabel: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 8,
    color: 'black',
  },
  toggleSwitch: {
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#CA9329',
  },
  toggleSwitchText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleSwitchOn: {
    backgroundColor: '#28a745',
  },
  toggleSwitchOff: {
    backgroundColor: '#dc3545',
  },
  button: {
    backgroundColor: '#CA9329',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SetGymTimingsScreen;
