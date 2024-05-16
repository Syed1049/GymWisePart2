import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../supabase';
import { getUserSession } from './SessionService';

const UpcomingBookingsPage = ({ navigation }) => {
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
          .eq('memberid', userId);

        if (error) {
          throw error;
        }

        // Sort bookings by date
        upcomingBookings.sort((a, b) => new Date(a.date) - new Date(b.date));
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
    navigation.navigate('BookingPage');
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

  // Group bookings by date
  const groupedBookings = {};
  bookings.forEach(booking => {
    const date = new Date(booking.date).toLocaleDateString();
    if (!groupedBookings[date]) {
      groupedBookings[date] = [];
    }
    groupedBookings[date].push(booking);
  });

  return (
    <ScrollView style={[styles.container, styles.blackBackground]}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Upcoming Bookings</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
        <Text style={[styles.addButtonText, styles.whiteText, styles.bigPlus]}>+</Text>
      </TouchableOpacity>
      <View style={styles.bookingList}>
        {Object.entries(groupedBookings).map(([date, bookings]) => (
          <View key={date}>
  <Text style={[styles.whiteText, styles.dateHeading]}>{date}</Text>
  {bookings.map((booking, bookingIndex) => (
    <View key={`${date}-${bookingIndex}`} style={styles.bookingContainer}>
      <Text style={styles.whiteText}>Time Slot: {booking.timeslot}</Text>
      <Text style={styles.whiteText}>Equipment ID: {booking.equipmentid}</Text>
    </View>
  ))}
</View>


        ))}
      </View>
    </ScrollView>
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
    marginTop:100,
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
    backgroundColor: '#333333',
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  addButtonText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  bigPlus: {
    fontSize: 48,
    color:'#CA9329',
  },
  whiteText: {
    color: 'white',
  },
  bookingList: {
    marginTop: 20,
  },
  dateHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#CA9329', // Yellow color for date heading
  },
  bookingContainer: {
    backgroundColor: '#333333',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default UpcomingBookingsPage;
