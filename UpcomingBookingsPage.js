import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from './supabase';
import { getUserSession } from './SessionService';

const UpcomingBookingsPage = ({ navigation }) => { // Accept navigation prop
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      try {
        const sessionData = await getUserSession();
        if (!sessionData?.userId) {
          console.error('User not authenticated.');
          setError('User not authenticated.');
          return;
        }
      
        const userId = sessionData.userId;
        const { data: upcomingBookings, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('memberid', userId); // Filter bookings by memberid of logged-in user

        if (error) {
          throw error;
        }
        setBookings(upcomingBookings || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming bookings:', error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUpcomingBookings();
  }, []);

  const handleAddButtonPress = () => {
    navigation.navigate('BookingPage'); // Navigate to BookingPage
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.blackBackground]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.blackBackground]}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.blackBackground]}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Upcoming Bookings</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
        <Text style={[styles.addButtonText, styles.whiteText, styles.bigPlus]}>+</Text>
      </TouchableOpacity>
      <View style={styles.bookingList}>
        {bookings.length === 0 ? (
          <Text style={styles.whiteText}>No upcoming bookings available.</Text>
        ) : (
          bookings.map((booking, index) => (
            <View key={index} style={styles.bookingContainer}>
              <Text style={styles.whiteText}>Date: {new Date(booking.date).toLocaleDateString()}</Text>
              <Text style={styles.whiteText}>Time Slot: {booking.timeslot}</Text>
              <Text style={styles.whiteText}>Equipment ID: {booking.equipmentid}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  blackBackground: {
    backgroundColor: 'black',
  },
  headingContainer: {
    marginTop:100, // Adjusted margin top for the heading
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#333333', // Transparent background
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  addButtonText: {
    fontSize: 50, // Increased font size for the plus sign
    fontWeight: 'bold',
  },
  bigPlus: {
    fontSize: 48, // Increased font size for the plus sign
  },
  whiteText: {
    color: 'white', // White color
  },
  bookingList: {
    marginTop: 20, // Adjusted margin top
  },
  bookingContainer: {
    backgroundColor: '#333333', // Dark grey background
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default UpcomingBookingsPage;
