import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase';
import { getUserSession } from './SessionService';

const MemberSupportScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [query, setQuery] = useState('');
  const titleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegisterSupport = async () => {
    try {
      const sessionData = await getUserSession();
      if (!sessionData?.userId) {
        console.error('User not authenticated.');
        return;
      }

      const userId = sessionData.userId;
      if (userId !== null) {
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
        } else {
          console.log('Support request submitted successfully:', data[0]);
          Alert.alert('Support Request Submitted', 'Your support request has been submitted successfully.');
          navigation.goBack();
        }
      } else {
        console.error('User ID is null.');
      }
    } catch (error) {
      console.error('Error inserting support request:', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>Member Support</Animated.Text>

        <View style={styles.buttonContainer}>
          <Button title="Select Request Type" color="orange" onPress={() => setModalVisible(true)} />
        </View>
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

        <View style={styles.buttonContainer}>
          <Button title="Submit" color="orange" onPress={handleRegisterSupport} />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Button title="Query" color="orange" onPress={() => { setRequestType('Query'); setModalVisible(false); }} />
              <Button title="Complaint" color="orange" onPress={() => { setRequestType('Complaint'); setModalVisible(false); }} />
              <Button title="Suggestion" color="orange" onPress={() => { setRequestType('Suggestion'); setModalVisible(false); }} />
              <Button title="Cancel" color="orange" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  selectedRequestType: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 100,
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    padding: 8,
    backgroundColor: 'gray',
    color: 'white',
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
});

export default MemberSupportScreen;
