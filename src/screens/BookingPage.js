import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput ,ScrollView} from 'react-native';
import { supabase } from '../../supabase'; 
import { getUserSession } from './SessionService';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [showWeighted, setShowWeighted] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [weights, setWeights] = useState([]);
const[originalEquipmentOptions,setOriginalEquipmentOptions]=useState([]);
const [filteredEquipmentOptions, setFilteredEquipmentOptions] = useState([]);
const [selectedEquipments, setSelectedEquipments] = useState({});

  useEffect(() => {
    fetchEquipmentOptions();
    
  }, []);

  const fetchEquipmentOptions = async () => {
    try {
      const { data: equipmentData, error: equipmentError } = await supabase.from('equipment').select('*');

      if (equipmentError) {
        throw equipmentError;
      }

      const { data: instancesData, error: instancesError } = await supabase.from('equipment_instances').select('*');

      if (instancesError) {
        throw instancesError;
      }

      const availableEquipment = equipmentData.map((equipment) => {
        const instances = instancesData.filter(instance => instance.equipmentid === equipment.equipmentid && instance.availability === 'available');
        return {
          ...equipment,
          instances
        };
      });

      setEquipmentOptions(availableEquipment);
       setOriginalEquipmentOptions(availableEquipment);
      const allWeights = instancesData.map(instance => instance.weight);
      const uniqueWeights = [...new Set(allWeights)];
      setWeights(uniqueWeights);
    } catch (error) {
      console.error('Error fetching equipment data:', error.message);
    }
  };

  const updateQuantity = (equipmentId, change) => {
    const currentQuantity = quantity[equipmentId] || 0;
    const newQuantity = Math.max(currentQuantity + change, 0);
    setQuantity(prevQuantity => ({
      ...prevQuantity,
      [equipmentId]: newQuantity,
    }));
    
    // Update selected equipment
    if (newQuantity > 0) {
      setSelectedEquipment(prevSelectedEquipment => ({
        ...prevSelectedEquipment,
        [equipmentId]: newQuantity,
      }));
    } else {
      // If quantity becomes zero, remove the equipment from selected list
      const { [equipmentId]: removed, ...rest } = selectedEquipment;
      setSelectedEquipment(rest);
    }
  
    console.log(`Equipment ID: ${equipmentId}, Quantity: ${newQuantity}`);
  };
  

  const handleBooking = async () => {
    try {
      if (!selectedDate || !selectedTimeSlot || !selectedExercise) {
        console.error('Please select all booking details');
        Alert.alert('Please select all booking details')
        return;
      }
  
      const sessionData = await getUserSession();
      if (!sessionData?.userId) {
        console.error('User not authenticated.');
        return;
      }
  
      const userId = sessionData.userId;
  
      const bookingData = [];
  
      // Iterate over each selected equipment and create a booking entry
      for (const equipmentId of Object.keys(selectedEquipment)) {
        const quantity = selectedEquipment[equipmentId];
  
        for (let i = 0; i < quantity; i++) {
          // Fetch equipment instances
          const { data: instances, error: instanceError } = await supabase
            .from('equipment_instances')
            .select('unique_identifier')
            .eq('equipmentid', equipmentId);
  
          if (instanceError) {
            console.error('Error fetching equipment instance:', instanceError.message);
            continue; // Skip to the next equipment
          }
  
          if (!instances || instances.length === 0) {
            console.error('No available equipment instance found for the selected equipment.');
            continue; // Skip to the next equipment
          }
  
          // Select a random instance (for demonstration purposes)
          const randomInstance = instances[Math.floor(Math.random() * instances.length)];
  
          const { unique_identifier } = randomInstance;
  
          const bookingEntry = {
            memberid: userId,
            equipmentid: unique_identifier, // Using unique_identifier for equipmentid
            date: selectedDate,
            timeslot: selectedTimeSlot,
            excercisename: selectedExercise,
          };
  
          bookingData.push(bookingEntry);
          console.log('Booking Entry:', bookingEntry);
        }
      }
  
      if (bookingData.length === 0) {
        console.error('No booking data found.');
        return;
      }
  
      // Insert all booking entries
      const { data: insertedBookings, error: bookingError } = await supabase.from('bookings').insert(bookingData);
  
      if (bookingError) {
        throw bookingError;
      }
  
      console.log('Bookings submitted successfully:', insertedBookings);
  
      // Clear selected booking details after successful booking
      setSelectedDate('');
      setSelectedTimeSlot('');
      setSelectedEquipment('');
      setSelectedInstance('');
      setSelectedExercise('');
    } catch (error) {
      console.error('Error submitting booking:', error.message);
    }
  };
  
  

  const handleDateSelection = async (date) => {
    const currentDate = moment();
    const selectedDay = moment(date.dateString);

    if (selectedDay.isBefore(currentDate, 'day')) {
      Alert.alert(
        'Invalid Date',
        'Please select a future date.',
        [{ text: 'OK', onPress: () => {} }]
      );
      return;
    }

    const slots = await generateTimeSlotsForDate(date.dateString);
    if (Object.values(slots).flat().length === 0) {
      Alert.alert(
        'No Available Slots',
        'There are no available time slots for the selected date.',
        [{ text: 'OK', onPress: () => {} }]
      );
      return;
    }

    setSelectedDate(date.dateString);
    setDateModalVisible(false);
    setTimeSlots(slots);
    setTimeSlotModalVisible(true);
  };

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setTimeSlotModalVisible(false);
  };

  const handleExerciseChange = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleSelectEquipment = (equipmentId) => {
    // Check if the equipment is already selected
    if (selectedEquipment[equipmentId]) {
      // If selected, increment the quantity
      setSelectedEquipment(prevSelectedEquipment => ({
        ...prevSelectedEquipment,
        [equipmentId]: prevSelectedEquipment[equipmentId] + 1,
      }));
    } else {
      // If not selected, set the quantity to 1
      setSelectedEquipment(prevSelectedEquipment => ({
        ...prevSelectedEquipment,
        [equipmentId]: 1,
      }));
    }
  
    // Close the equipment selection modal
    setModalVisible(false);
  };
  

  const handleWeightChange = async (weight) => {
    setSelectedWeight(weight); // Update selectedWeight first
    
    if (weight) {
      try {
        // Fetch instances with the selected weight
        const { data: instances, error } = await supabase
          .from('equipment_instances')
          .select('equipmentid')
          .eq('weight', weight);
  
        if (error) {
          throw error;
        }
  
        // Extract equipment ids from instances
        const equipmentIds = instances.map((instance) => instance.equipmentid);
  
        // Filter original equipment options based on extracted equipment ids
        const filteredEquipmentOptions = originalEquipmentOptions.filter((equipment) =>
          equipmentIds.includes(equipment.equipmentid)
        );
  
        // Update state with filtered equipment options
        setFilteredEquipmentOptions(filteredEquipmentOptions);
      } catch (error) {
        console.error('Error fetching instances with selected weight:', error.message);
      }
    } else {
      // If no weight is selected, reset the filtered equipment options to the original list
      setFilteredEquipmentOptions(originalEquipmentOptions);
    }
  };
  
  
  
  
  

  const generateTimeSlotsForDate = async (selectedDate) => {
    try {
      const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      const { data: allGymTimings, error } = await supabase.from('gym_timings').select('opening_time, closing_time, day');

      if (error) {
        throw error;
      }

      if (!allGymTimings || allGymTimings.length === 0) {
        console.error('No gym timings found in the database.');
        return [];
      }

      const gymTimingsForSelectedDay = allGymTimings.filter(timing => timing.day.toLowerCase() === selectedDay);

      if (gymTimingsForSelectedDay.length === 0) {
        console.error(`No gym timings found for ${selectedDay}.`);
        return [];
      }

      const timeSlots = [];

      gymTimingsForSelectedDay.forEach(({ opening_time, closing_time }) => {
        const openingMoment = moment(opening_time, 'HH:mm:ss');
        const closingMoment = moment(closing_time, 'HH:mm:ss');

        let currentTime = moment(openingMoment);

        while (currentTime < closingMoment) {
          const startTimeStr = currentTime.format('HH:mm');
          const endTimeStr = moment(currentTime).add(30, 'minutes').format('HH:mm');
          const label = `${startTimeStr} - ${endTimeStr}`;
          timeSlots.push({ label });
          currentTime.add(30, 'minutes');
        }
      });

      return timeSlots;
    } catch (error) {
      console.error('Error generating time slots:', error.message);
      return [];
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.bookingContainer}>
        <Text style={styles.title}>Booking Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Date:</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setDateModalVisible(true)}>
            <Text style={styles.dropdownText}>{selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : 'Select Date'}</Text>
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
            <Text style={styles.dropdownText}>{selectedEquipment ? equipmentOptions.find(e => e.equipmentid === selectedEquipment)?.equipmentname : 'Select Equipment'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Session Name:</Text>
          <TextInput
            style={styles.input}
            value={selectedExercise}
            onChangeText={handleExerciseChange}
          
            
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

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
              onDayPress={(day) => handleDateSelection(day)}
            />
          </View>
        </View>
      </Modal>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {/* Toggle buttons */}
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[styles.toggleButton, showWeighted ? styles.activeToggleButton : null]}
          onPress={() => setShowWeighted(true)}
        >
          <Text style={styles.toggleButtonText}>Weighted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showWeighted ? styles.activeToggleButton : null]}
          onPress={() => setShowWeighted(false)}
        >
          <Text style={styles.toggleButtonText}>Non-Weighted</Text>
        </TouchableOpacity>
      </View>

      {/* Weight selection */}
      {showWeighted && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Weight:</Text>
          <Picker
            selectedValue={selectedWeight}
            style={styles.input}
            onValueChange={(itemValue) => handleWeightChange(itemValue)}
          >
            <Picker.Item label="Select Weight" value="" />
            {weights.map((weight) => (
              <Picker.Item key={weight} label={`${weight} kgs`} value={weight} />
            ))}
          </Picker>
        </View>
      )}

      {/* Equipment list */}
      <Text style={styles.weightHeading}>
        {showWeighted ? 'Weighted Equipment' : 'Non-Weighted Equipment'}
        {showWeighted && selectedWeight ? ` - ${selectedWeight} lbs` : ''}
      </Text>
      <ScrollView>
  {filteredEquipmentOptions.map((equipment) => (
    <View key={equipment.equipmentid} style={styles.itemContainer}>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setSelectedEquipment(equipment.equipmentid);
          handleSelectEquipment(equipment.equipmentid)
          setModalVisible(false);
        }}
      >
        <Text style={styles.itemText}>{equipment.equipmentname}</Text>
      </TouchableOpacity>
      {/* Quantity selection */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => {
            if (showWeighted && !selectedWeight) {
              // Show a popup or alert to prompt the user to select a weight first
              alert('Please select a weight first.');
            } else {
              updateQuantity(equipment.equipmentid, -1);
            }
          }}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity[equipment.equipmentid] || 0}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => {
            if (showWeighted && !selectedWeight) {
              // Show a popup or alert to prompt the user to select a weight first
              alert('Please select a weight first.');
            } else {
              updateQuantity(equipment.equipmentid, 1);
            }
          }}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))}
</ScrollView>

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
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
              data={timeSlots}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleTimeSlotSelection(item.label)}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
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
    color: 'white',
    padding: 10,
  },
  button: {
    backgroundColor: '#CA9329',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  toggleButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  activeToggleButton: {
    backgroundColor: 'blue',
  },
  toggleButtonText: {
    color: 'white',
  },
  weightHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    color: 'white',
  },
  weightSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 10,
  },
  weightButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginRight: 5,
  },
  selectedWeightButton: {
    backgroundColor: 'blue',
  },
  weightButtonText: {
    color: 'white',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: 'white',
  },
  quantityText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledItemContainer: {
    opacity: 0.5, 
  },
  disabledItemText: {
    color: 'grey', 
  },
});

export default BookingPage;
