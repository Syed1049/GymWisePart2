import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'user_session';
const TRAINER_SESSION_KEY = 'trainer_session';
export const saveUserSession = async (userId) => {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
  } catch (error) {
    console.error('Error saving user session:', error.message);
  }
};

export const getUserSession = async () => {
  try {
    const session = await AsyncStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error retrieving user session:', error.message);
    return null;
  }
};

export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing user session:', error.message);
  }
};

export const saveTrainerSession = async (trainerId) => {
  try {
    await AsyncStorage.setItem(TRAINER_SESSION_KEY, JSON.stringify({ trainerId }));
    console.log('Trainer session saved successfully.');
  } catch (error) {
    console.error('Error saving trainer session:', error.message);
  }
};

export const getTrainerSession = async () => {
  try {
    const session = await AsyncStorage.getItem(TRAINER_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error retrieving trainer session:', error.message);
    return null;
  }
};

export const clearTrainerSession = async () => {
  try {
    await AsyncStorage.removeItem(TRAINER_SESSION_KEY);
    console.log('Trainer session cleared successfully.');
  } catch (error) {
    console.error('Error clearing trainer session:', error.message);
  }
};