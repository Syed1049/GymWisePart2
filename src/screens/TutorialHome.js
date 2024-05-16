import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import TutorialScreen from './TutorialScreen';
import BodyPartScreen from './BodyPartScreen';
import BodyPartVideosScreen from './BodyPartVideosScreen';
const TutorialHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TUTORIAL</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TutorialScreen', { type: 'Equipment' })}
        >
          <Image source={require('../../equipment-icon.jpg')} style={styles.icon} />
          <Text style={styles.buttonText}>Equipment Tutorial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BodyPartScreen', { type: 'Exercises' })}
        >
          <Image source={require('../../exercise-icon.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Exercises Tutorial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BodyPartVideosScreen')}
        >
          <Image source={require('../../video-icon.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Third-Party Videos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});

export default TutorialHome;
