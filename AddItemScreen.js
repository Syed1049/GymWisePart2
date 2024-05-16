import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

import * as FileSystem from 'expo-file-system';

const AddItemScreen = () => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [imageURI, setImageURI] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      console.log('Image picker result:', result);

      if (!result.cancelled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setSelectedImage(selectedImage);
        setImageURI(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error.message);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  const uploadImageToSupabase = async () => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageURI, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const filePath = `Itemimages/${new Date().getTime()}.${selectedImage.type === 'image' ? 'png' : 'mp4'}`;
  
      console.log(filePath);
  
      const contentType = selectedImage.type === 'image' ? 'image/png' : 'video/mp4';
  
      const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  
      const { data, error } = await supabase.storage.from('GymWise').upload(filePath, arrayBuffer, { contentType });
  
      if (error) {
        throw error;
      }
  
      const imageURL =`https://rjuibysbrnwraxvzavtk.supabase.co/storage/v1/object/public/GymWise/${filePath}`;
  
      setImageURL(imageURL);
      console.log(imageURL);
    } catch (error) {
      console.error('Error uploading image:', error.message);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };
  
  const handleAddItem = async () => {
    try {
      if (!itemName || !itemPrice || !selectedImage || !imageURI || !quantity) {
        throw new Error('Please fill out all fields and select an image.');
      }
  
      await uploadImageToSupabase();
  
      const insertResponse = await supabase.from('store').insert([
        {
          image:imageURL,
          item_name:itemName,
          item_price:parseFloat(itemPrice),
          quantity:parseInt(quantity),
        }
      ], { returning: 'minimal' });
  
      if (insertResponse.error) {
        throw insertResponse.error;
      }
  
      Alert.alert('Success', 'Item added to store successfully.');
      setItemName('');
      setItemPrice('');
      setImageURI(null);
      setSelectedImage(null);
      setImageURL(null);
      setQuantity('');
    } catch (error) {
      console.error('Error adding item to store:', error.message);
      Alert.alert('Error', 'Failed to add item to store. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredSection}>
        <Text style={styles.heading}>Add Item</Text>
        <View style={styles.form}>
          <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
          {imageURL && (
            <Text style={styles.imageSelectedText}>Image Selected</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Item Name:</Text>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={(text) => setItemName(text)}
              placeholder="Enter Item Name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Item Price:</Text>
            <TextInput
              style={styles.input}
              value={itemPrice}
              onChangeText={(text) => setItemPrice(text)}
              placeholder="Enter Item Price"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
              placeholder="Enter Quantity"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAddItem}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredSection: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#CA9329',
    padding: 15,
    borderRadius: 55,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CA9329',
    borderRadius: 30,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  imageSelectedText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AddItemScreen;
