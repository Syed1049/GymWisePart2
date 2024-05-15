import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { supabase } from '../../supabase'; // Make sure you have the correct path to your Supabase instance setup

const MembershipPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('User') // Make sure this matches your actual table name in Supabase
          .select('username, email, age') // Select only the required fields
          .eq('membership', true); // Filter to get only users with active memberships

        if (error) {
          console.error('Error fetching users:', error);
          throw new Error(error.message);
        }

        setUsers(data);
      } catch (error) {
        console.error('Error fetching membership data:', error);
      }
    };

    fetchUsers();
  }, []);

  const renderUser = ({ item }) => (
    <View style={styles.userRow}>
      <Text style={styles.userText}>Username: {item.username}</Text>
      <Text style={styles.userText}>Email: {item.email}</Text>
      <Text style={styles.userText}>Age: {item.age || 'Not specified'}</Text>  // Handles null age
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Membership Page</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()} // Use 'id' as the key for list items
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#010102',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  userRow: {
    paddingVertical: 10,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
});

export default MembershipPage;
