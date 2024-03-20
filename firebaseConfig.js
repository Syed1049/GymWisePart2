// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore'; // Include other Firebase modules if used
import { getReactNativePersistence } from 'firebase/auth'; // Import the getReactNativePersistence function
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyCu8UMUAtOViAltRJtpcgGMllYJq6bckQs",
  authDomain: "gymwise-407321.firebaseapp.com",
  projectId: "gymwise-407321",
  storageBucket: "gymwise-407321.appspot.com",
  messagingSenderId: "153928720319",
  appId: "1:153928720319:web:953adaacd0b74f69238b0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  const db = getFirestore(app);

export { auth, db };