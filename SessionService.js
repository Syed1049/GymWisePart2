import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'user_session';

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
