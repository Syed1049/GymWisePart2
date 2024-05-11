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

const MemberSupportScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [specificModalVisible, setSpecificModalVisible] = useState(false);
  const [gymArea, setGymArea] = useState('');
  const [specificItem, setSpecificItem] = useState('');
  const [requestType, setRequestType] = useState('');
  const [query, setQuery] = useState('');
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSpecificSelection = (item) => {
    setSpecificItem(item);
    setSpecificModalVisible(false);
  };

  const handleGymAreaSelection = (area) => {
    setGymArea(area);
    setModalVisible(false);
    if (area === 'Equipment' || area === 'Staff') {
      setSpecificModalVisible(true);
    }
  };

  const handleRegisterSupport = async () => {
    try {
      // Simulated API call to demonstrate UI flow
      Alert.alert('Support Request Submitted', 'Your support request has been submitted successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error inserting support request:', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ scale: titleScale }] }]}>
          Member Support
        </Animated.Text>

        <View style={styles.buttonContainer}>
          <Button title="Select Gym Area" color="orange" onPress={() => setModalVisible(true)} />
        </View>
        {gymArea && <Text style={styles.selectedRequestType}>Selected Gym Area: {gymArea}</Text>}
        {specificItem && <Text style={styles.selectedRequestType}>Specific: {specificItem}</Text>}

        <View style={styles.buttonContainer}>
          <Button title="Select Request Type" color="orange" onPress={() => setTypeModalVisible(true)} disabled={!gymArea} />
        </View>
        {requestType && <Text style={styles.selectedRequestType}>Selected Request Type: {requestType}</Text>}

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

        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Button title="Technical Issue" color="orange" onPress={() => handleGymAreaSelection('Technical Issue')} />
              <Button title="Staff" color="orange" onPress={() => handleGymAreaSelection('Staff')} />
              <Button title="Equipment" color="orange" onPress={() => handleGymAreaSelection('Equipment')} />
              <Button title="Cancel" color="orange" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={specificModalVisible} onRequestClose={() => setSpecificModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {gymArea === 'Equipment' ? (
                <>
                  <Button title="Dumbbells" color="orange" onPress={() => handleSpecificSelection('Dumbbells')} />
                  <Button title="Treadmills" color="orange" onPress={() => handleSpecificSelection('Treadmills')} />
                </>
              ) : (
                <>
                  <Button title="Trainer" color="orange" onPress={() => handleSpecificSelection('Trainer')} />
                  <Button title="Worker" color="orange" onPress={() => handleSpecificSelection('Worker')} />
                </>
              )}
              <Button title="Cancel" color="orange" onPress={() => setSpecificModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={typeModalVisible} onRequestClose={() => setTypeModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Button title="Query" color="orange" onPress={() => { setRequestType('Query'); setTypeModalVisible(false); }} />
              <Button title="Complaint" color="orange" onPress={() => { setRequestType('Complaint'); setTypeModalVisible(false); }} />
              <Button title="Suggestion" color="orange" onPress={() => { setRequestType('Suggestion'); setTypeModalVisible(false); }} />
              <Button title="Cancel" color="orange" onPress={() => setTypeModalVisible(false)} />
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
    fontSize: 28,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'gray',
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
