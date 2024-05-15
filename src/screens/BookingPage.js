import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { supabase } from '../../supabase'; 
import { getUserSession } from './SessionService';
import { Calendar } from 'react-native-calendars';

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [classifiedEquipment, setClassifiedEquipment] = useState([]);
  const [userId, setuserId] = useState(null); // Add memberId state

  useEffect(() => {

    
    const fetchEquipmentOptions = async () => {
      try {
        const { data: equipmentData, error } = await supabase
          .from('gymequipments')
          .select('equipmentid, equipmentname, weightcategory, equipmenttype');
        if (error) {
          throw error;
        }
        setEquipmentOptions(equipmentData || []);
        // Classify equipment by weight and type
        const classified = classifyEquipment(equipmentData || []);
        setClassifiedEquipment(classified);
      } catch (error) {
        console.error('Error fetching equipment data:', error.message);
      }
    };

    fetchEquipmentOptions();
  
  }, []);
  const classifyEquipment = (equipmentData) => {
    const classified = {};
    equipmentData.forEach((equipment) => {
      const { weight, type } = equipment;
      if (!classified[weight]) {
        classified[weight] = {};
      }
      if (!classified[weight][type]) {
        classified[weight][type] = [];
      }
      classified[weight][type].push(equipment);
    });
    return classified;
  };
  const handleBooking = async () => {
    try {
      if (!selectedDate || !selectedTimeSlot || !selectedEquipment || !selectedExercise) {
        console.error('Please select all booking details');
        return;
      }
      
      const sessionData = await getUserSession();
      if (!sessionData?.userId) {
        console.error('User not authenticated.');
        return;
      }
  
      const userId = sessionData.userId;
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            memberid: userId,
            equipmentid: selectedEquipment,
            date: selectedDate,
            timeslot: selectedTimeSlot,
            excercisename : selectedExercise,
           
          },
        ]);

      if (error) {
        throw error;
      }

      console.log('Booking submitted successfully:', data);
      setSelectedDate('');
      setSelectedTimeSlot('');
      setSelectedEquipment('');
      setSelectedExercise('');
    } catch (error) {
      console.error('Error submitting booking:', error.message);
    }
  };

  
  

  const handleDateSelection = (date) => {
    setSelectedDate(date.dateString);
    setDateModalVisible(false);
  };
  
  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setTimeSlotModalVisible(false);
  };

  const handleExerciseChange = (exercise) => {
    setSelectedExercise(exercise);
  };
  const handleSelectEquipment = (equipmentId) => {
    setSelectedEquipment(equipmentId);
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.bookingContainer}>
        <Text style={styles.title}>Booking Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Date:</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setDateModalVisible(true)}>
            <Text style={styles.dropdownText}>{selectedDate || 'Select Date'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Time Slot:</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setTimeSlotModalVisible(true)}>
            <Text style={styles.dropdownText}>{selectedTimeSlot || 'Select Time Slot'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Equipment:</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
            <Text style={styles.dropdownText}>{selectedEquipment ? equipmentOptions.find(equipment => equipment.equipmentid === selectedEquipment)?.equipmentname : 'Select Equipment'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Exercise Name:</Text>
          <TextInput
            style={styles.input}
            value={selectedExercise}
            onChangeText={handleExerciseChange}
            placeholder="Enter Exercise Name"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={equipmentOptions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setSelectedEquipment(item.equipmentid);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.equipmentname}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.equipmentid.toString()}
              numColumns={3}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
  animationType="slide"
  transparent={true}
  visible={dateModalVisible}
  onRequestClose={() => setDateModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Calendar
        current={selectedDate}
        markedDates={markedDates}
        onDayPress={(day) => handleDateSelection(day)}
      />


    </View>
  </View>
</Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={timeSlotModalVisible}
        onRequestClose={() => setTimeSlotModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={generateTimeSlots()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    handleTimeSlotSelection(item.label);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.label}
              numColumns={3}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setTimeSlotModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const generateDateOptions = () => {
  const dateOptions = {};
  if (selectedDate) {
    dateOptions[selectedDate] = { selected: true, selectedColor: '#3498db' };
  }
  return dateOptions;
};

const generateTimeSlots = () => {
  const timeSlots = [];
  const startTime = new Date();
  startTime.setHours(6, 0, 0, 0); 
  const endTime = new Date();
  endTime.setHours(22, 0, 0, 0); 
  const slotDuration = 30 * 60 * 1000;
  let currentTime = new Date(startTime);
  while (currentTime < endTime) {
    const startTimeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeStr = new Date(currentTime.getTime() + slotDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const label = `${startTimeStr} - ${endTimeStr}`;
    timeSlots.push({ label });
    currentTime.setTime(currentTime.getTime() + slotDuration);
  }
  return timeSlots;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  bookingContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  dropdown: {
    backgroundColor: '#333',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    padding: 10,
  },
  dropdownText: {
    color: 'white',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    height: 40,
    paddingLeft: 10,
    color: 'white',
  },
  button: {
    backgroundColor: '#CA9329',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  
});

export default BookingPage;
