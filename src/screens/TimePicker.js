import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TimePicker = ({ onSelectTime }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState('');

  const timeSlots = [
    { label: '7:00 AM - 7:30 AM', value: '7:00 AM', limit: 30 },
    { label: '7:30 AM - 8:00 AM', value: '7:30 AM', limit: 30 },
    { label: '8:00 AM - 8:30 AM', value: '8:00 AM', limit: 30 },
    // Add more time slots as needed
  ];

  const handleTimeSlotSelection = (timeSlot, timeLimit) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedTimeLimit(timeLimit);
    onSelectTime(timeSlot, timeLimit);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Time Slot:</Text>
      <View style={styles.timeSlotContainer}>
        {timeSlots.map((slot, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.timeSlot,
              selectedTimeSlot === slot.value && styles.selectedTimeSlot,
            ]}
            onPress={() => handleTimeSlotSelection(slot.value, slot.limit)}
          >
            <Text style={styles.timeSlotText}>{slot.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  selectedTimeSlot: {
    backgroundColor: '#3498db',
  },
  timeSlotText: {
    color: 'white',
    fontSize: 14,
  },
});

export default TimePicker;
