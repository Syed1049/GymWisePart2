import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from './supabase';
import { getUserSession } from './SessionService';

const TrainerDetailsScreen = () => {
  const [trainer, setTrainer] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { trainerId } = route.params;
  const [userId, setUserId] = useState(null);

  // Fetch the logged-in user ID when the component mounts
  useEffect(() => {
    fetchUserId();
    fetchTrainerDetails();
    fetchAvailableSlots();
    fetchBookedSessions();
  }, []);

  const fetchUserId = async () => {
    try {
      const session = await getUserSession();
      if (session && session.userId) {
        setUserId(session.userId); // Set the userId state variable
      } else {
        throw new Error('User session not found');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error.message);
      // Handle the error or navigate the user to the login screen
    }
  };

  const fetchTrainerDetails = async () => {
    try {
      const { data, error } = await supabase.from('trainer').select('*').eq('id', trainerId);
      if (error) {
        throw new Error(error.message);
      }
      setTrainer(data[0]);
    } catch (error) {
      console.error('Error fetching trainer details:', error.message);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const { data, error } = await supabase.from('traineravailability').select('*').eq('trainer_id', trainerId);
      if (error) {
        throw new Error(error.message);
      }
      
      // Extract available hours from trainer availability data
      const availableHours = data.map(slot => {
        const start = new Date(`${slot.date}T${slot.start_time}`);
        const end = new Date(`${slot.date}T${slot.end_time}`);
        return { start, end };
      });

      // Generate slots based on available hours
      const slots = generateSlots(availableHours);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching available slots:', error.message);
    }
  };

  const fetchBookedSessions = async () => {
    try {
      const { data, error } = await supabase.from('sessions').select('*').eq('trainer_id', trainerId);
      if (error) {
        throw new Error(error.message);
      }
      setBookedSessions(data);
    } catch (error) {
      console.error('Error fetching booked sessions:', error.message);
    }
  };

  // Function to generate slots from available hours
  const generateSlots = (availableHours) => {
    let slots = [];
    availableHours.forEach(hour => {
      let startTime = new Date(hour.start);
      while (startTime < hour.end) {
        const endTime = new Date(startTime.getTime() + (30 * 60000)); // 30 minutes later
        slots.push({ start: startTime, end: endTime });
        startTime = endTime;
      }
    });
    return slots;
  };

  const bookSlot = async (slot) => {
    try {
      // Check if the slot is available for booking
      if (!isSlotAvailable(slot)) {
        throw new Error('Slot is not available for booking');
      }
  
      // Check if the user has already booked two sessions for the selected day
      const bookedSessionsForDay = bookedSessions.filter(session => {
        const sessionDate = new Date(session.session_date);
        return (
          sessionDate.toDateString() === slot.start.toDateString() &&
          session.user_id === userId
        );
      });
  
      if (bookedSessionsForDay.length >= 2) {
        throw new Error('You can only book a maximum of two sessions with this trainer in a single day');
      }
  
      // Insert the booking into the sessions table
      const { error } = await supabase.from('sessions').insert([
        {
          user_id: userId, // Use the logged-in user ID
          trainer_id: trainerId,
          session_date: slot.start.toISOString().split('T')[0], // Extract date from start time
          start_time: slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format start time
          end_time: slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format end time
          duration: '30 minutes', // Hardcoded for now, can be calculated dynamically if needed
        }
      ]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Display a confirmation message to the user
      Alert.alert('Slot Booked', 'Your slot has been booked successfully!');
      // Refetch available slots and booked sessions after booking
      fetchAvailableSlots();
      fetchBookedSessions();
    } catch (error) {
      console.error('Error booking slot:', error.message);
      Alert.alert('Error', 'Failed to book the slot. Please try again later.');
    }
  };
  
  
  const isSlotAvailable = (slot) => {
    // Check if there is any overlapping booked session within this slot
    const isBooked = bookedSessions.some(session => (
      (slot.start >= new Date(session.session_date + 'T' + session.start_time) && slot.start < new Date(session.session_date + 'T' + session.end_time)) ||
      (slot.end > new Date(session.session_date + 'T' + session.start_time) && slot.end <= new Date(session.session_date + 'T' + session.end_time)) ||
      (slot.start <= new Date(session.session_date + 'T' + session.start_time) && slot.end >= new Date(session.session_date + 'T' + session.end_time))
    ));

    return !isBooked;
  };

  if (!trainer) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{trainer.name}'s Available Slots</Text>
      <View style={styles.trainerInfo}>
     
      </View>
      <View style={styles.availableSlots}>
        <Text style={styles.sectionHeading}>Available Slots:</Text>
        <ScrollView>
          {availableSlots.map((slot, index) => (
            <TouchableOpacity key={index} style={[styles.slotItem, !isSlotAvailable(slot) && styles.bookedSlotItem]} onPress={() => bookSlot(slot)} disabled={!isSlotAvailable(slot)}>
              <Text style={styles.slotText}>Date: {slot.start && slot.start.toDateString()}</Text>
              <Text style={styles.slotText}>Time: {slot.start && slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {slot.end && slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              <TouchableOpacity style={[styles.bookButton, !isSlotAvailable(slot) && styles.bookButtonDisabled]} onPress={() => bookSlot(slot)} disabled={!isSlotAvailable(slot)}>
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  trainerInfo: {
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  availableSlots: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  slotItem: {
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  bookedSlotItem: {
    backgroundColor: '#666', // Adjust the color for booked slots
  },
  slotText: {
    color: 'white',
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: '#CA9329',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  bookButtonDisabled: {
    backgroundColor: '#888', // Adjust the color for disabled state
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TrainerDetailsScreen;
