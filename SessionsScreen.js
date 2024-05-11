import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { getTrainerSession } from './SessionService';
import { supabase } from './supabase';

const SessionsScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrainerSession();
  }, []);

  const fetchTrainerSession = async () => {
    try {
      const session = await getTrainerSession();
      if (session && session.trainerId) {
        await fetchSessions(session.trainerId);
      }
    } catch (error) {
      console.error('Error fetching trainer session:', error.message);
      setLoading(false);
    }
  };

  const fetchSessions = async (trainerId) => {
    try {
      const { data, error } = await supabase
        .from('traineravailability')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('date', { ascending: true }); // Order sessions by date ascending

      if (error) {
        throw new Error(error.message);
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveButtonPress = async (sessionId) => {
    try {
      await supabase.from('traineravailability').delete().eq('id', sessionId);
      await fetchTrainerSession();
    } catch (error) {
      console.error('Error removing session:', error.message);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchTrainerSession();
  };

  const handleAddButtonPress = () => {
    navigation.navigate('SetAvailableHoursScreen');
  };

  const getDayOfWeek = (dateString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  const isPastSession = (session) => {
    const sessionDate = new Date(session.date);
    const currentDate = new Date();
    return sessionDate < currentDate;
  };

  const renderSessionTag = (session) => {
    return isPastSession(session) ? (
      <Text style={styles.sessionTag}>Completed</Text>
    ) : (
      <Text style={styles.sessionTag}>Upcoming</Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>Sessions</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#CA9329"
          style={styles.searchInput}
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#CA9329" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#CA9329" />
      ) : (
        <ScrollView style={styles.sessionContainer}>
          {sessions.map((session, index) => (
            <View key={index} style={styles.sessionItem}>
              <View style={styles.sessionTimeDate}>
                <Text style={styles.sessionDay}>{getDayOfWeek(session.date)}</Text>
                <Text style={styles.sessionDate}>{session.date}</Text>
                <Text style={styles.sessionTime}>{session.start_time} - {session.end_time}</Text>
              </View>
              {renderSessionTag(session)}
              {!isPastSession(session) && ( // Only show remove button for upcoming sessions
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveButtonPress(session.id)}>
                  <Ionicons name="close" size={24} color="#CA9329" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    marginRight: 10,
  },
  addButton: {
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: 'white',
  },
  searchButton: {
    marginLeft: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionContainer: {
    flex: 1,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  sessionTimeDate: {
    flexDirection: 'column',
  },
  sessionTime: {
    fontSize: 16,
    color: 'white',
  },
  sessionDate: {
    fontSize: 16,
    color: 'white',
  },
  sessionDay: {
    fontSize: 16,
    color: '#CA9329',
  },
  sessionTag: {
    fontSize: 16,
    color: '#CA9329',
  },
  removeButton: {
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 5,
  },
});

export default SessionsScreen;
