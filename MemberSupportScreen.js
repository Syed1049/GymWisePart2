import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase';
import { getUserSession } from './SessionService';
const MemberSupportScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [requestType, setRequestType] = useState(''); // Use this state to store the selected option
  const [query, setQuery] = useState('');
  const handleRegisterSupport = async () => {
    try {
      // Retrieve user ID from AsyncStorage
      const sessionData = await getUserSession();
  
      // Check if the user is available
      if (!sessionData?.userId) {
        console.error('User not authenticated.');
        // Handle the case where the user is not authenticated, e.g., redirect to login
        return;
      }
  
      const userId = sessionData.userId;
  
      // Check if the userid is not null before proceeding
      if (userId !== null) {
        // Insert the support request into the 'support_requests' table
        const { data, error } = await supabase
          .from('support_requests')
          .upsert([
            {
              userid: userId,
              requesttype: requestType,
              query,
              status: 'Pending',
            },
          ]);
  
        if (error) {
          console.error('Error inserting support request:', error.message);
          // Handle error, e.g., display an error message to the user
        } else {
          console.log('Support request submitted successfully:', data[0]);
          // Display a success message
          Alert.alert('Support Request Submitted', 'Your support request has been submitted successfully.');
  
          // Navigate back to the previous screen or home screen
          navigation.goBack();
        }
      } else {
        console.error('User ID is null.');
        // Handle the case where the user ID is null
      }
    } catch (error) {
      console.error('Error inserting support request:', error.message);
      // Handle error, e.g., display an error message to the user
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member Support</Text>

      <Button title="Select Request Type" onPress={() => setModalVisible(true)} />
      {requestType ? (
        <Text style={styles.selectedRequestType}>Selected Request Type: {requestType}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Type your request here"
        multiline
        numberOfLines={4}
        value={query}
        onChangeText={setQuery}
      />

      <Button title="Submit" onPress={handleRegisterSupport} />

      {/* Modal for Request Type Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Button title="Query" onPress={() => { setRequestType('Query'); setModalVisible(false); }} />
            <Button title="Complaint" onPress={() => { setRequestType('Complaint'); setModalVisible(false); }} />
            <Button title="Suggestion" onPress={() => { setRequestType('Suggestion'); setModalVisible(false); }} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedRequestType: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 8,
  },
});

export default MemberSupportScreen;
