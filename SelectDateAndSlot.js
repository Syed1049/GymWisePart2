
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const SelectDateAndSlot = ({ route, navigation }) => {
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const { selectedGoals } = route.params;
  const slots = ["Slot 1", "Slot 2", "Slot 3", "Slot 4"]; // Define your slots

  const onChangeDate = (event, selectedDate) => {
    setDate(selectedDate || date);
  };

  const autoSchedule = () => {
    // Simulate checking for available slots and automatically selecting one
    // In a real app, you might fetch available slots from your backend
    const availableSlots = slots.filter(slot => Math.random() > 0.5); // Randomly filter slots to simulate availability
    if (availableSlots.length > 0) {
      const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)]; // Pick a random available slot
      setSelectedSlot(randomSlot);
      alert(`Automatically selected ${randomSlot} based on availability.`);
    } else {
      alert("No slots available. Please try another date.");
    }
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      alert("Please select a slot.");
      return;
    }
    navigation.navigate('Plans', { selectedGoals, date, selectedSlot });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date and Slot</Text>
      <View style= {{paddingBottom:20}}>
      <DateTimePicker
      textColor='#CB952B'
        testID="dateTimePicker"
        value={date}
        mode="date"
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onChangeDate}
        style={styles.datePicker}
      />
      </View>
      <View style={styles.slotsContainer}>
        {/* Manual slot selection buttons */}
        {slots.map((slot, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => setSelectedSlot(slot)}>
            <Text style={styles.buttonText}>{slot}</Text>
          </TouchableOpacity>
        ))}
        {/* Auto Schedule button */}
        <TouchableOpacity style={styles.autoScheduleButton} onPress={autoSchedule}>
          <Text style={styles.buttonText}>Auto Schedule</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Previous styles remain unchanged
  autoScheduleButton: {
    backgroundColor: '#FFA500', // Orange button for auto scheduling
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    minWidth: 200,
    alignItems: 'center',
  },
   container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  pickerWrapper: {
    marginBottom: 20, // Gap between the date picker and slots
    width: '100%',
    borderRadius: 10, // Attempt to round corners
    overflow: 'hidden', // Essential for iOS to clip the picker view
    backgroundColor: '#17171A', // Dark background for the picker area
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#17171A', // This won't change the text color due to native component limitations
  },
  slotsContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
});
export default SelectDateAndSlot;
