import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment'; // Import moment library for date manipulation
import { supabase } from '../../supabase';
import { getTrainerSession } from './SessionService';
const SetAvailableHoursScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [trainerId, setTrainerId] = useState(null);

  useEffect(() => {
    // Fetch trainer ID from session when component mounts
    const fetchTrainerId = async () => {
      const session = await getTrainerSession();
      if (session) {
        setTrainerId(session.trainerId);
      }
    };
    fetchTrainerId();
  }, []);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    // Check if selected date is in the past
    if (moment(date).isBefore(moment(), 'day')) {
      Alert.alert('Error', 'Please select an upcoming date');
      return;
    }

    setSelectedDate(moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleConfirmStartTime = (time) => {
    setSelectedStartTime(moment(time).format('HH:mm'));
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleConfirmEndTime = (time) => {
    setSelectedEndTime(moment(time).format('HH:mm'));
    hideEndTimePicker();
  };

  const handleSaveHours = async () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }
  
    try {
      const { data, error } = await supabase.from('traineravailability').insert([
        {
          date: selectedDate,
          start_time: selectedStartTime,
          end_time: selectedEndTime,
          trainer_id: trainerId, 
        },
      ]);
  
      if (error) {
        console.error('Error saving available hours:', error.message);
        Alert.alert('Error', 'Failed to save available hours');
        return;
      }
  
      Alert.alert('Success', 'Available hours set successfully');
    } catch (error) {
      console.error('Error saving available hours:', error.message);
      Alert.alert('Error', 'An error occurred while saving available hours');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Set Available Hours</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Text style={styles.buttonText}>Select Date: {selectedDate}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.timePickerButton} onPress={showStartTimePicker}>
        <Text style={styles.buttonText}>Select Start Time: {selectedStartTime}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.timePickerButton} onPress={showEndTimePicker}>
        <Text style={styles.buttonText}>Select End Time: {selectedEndTime}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveHours}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date()} // Set minimum date to today
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmStartTime}
        onCancel={hideStartTimePicker}
      />

      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmEndTime}
        onCancel={hideEndTimePicker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  timePickerButton: {
    backgroundColor: '#17a2b8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SetAvailableHoursScreen;
