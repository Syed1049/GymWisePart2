import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from './supabase';
import { Picker } from '@react-native-picker/picker';
import { getUserSession } from './SessionService';

const Cart = ({ route, navigation }) => {
  const { cartItems } = route.params;

  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
  
    fetchUserSession();
  }, []);

  const fetchUserSession = async () => {
    try {
      const session = await getUserSession();
      if (session && session.userId) {
        setUserId(session.userId);
   
      }
    } catch (error) {
      console.error('Error fetching user session:', error.message);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.item_price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (deliveryMethod === 'delivery' && (!postalCode || !district || !address)) {
      Alert.alert('Error', 'Please fill all fields for delivery.');
      return;
    }

    // Proceed with cash payment
    await processCashPayment();
  };

  const processCashPayment = async () => {
    try {
     
      // Insert purchase history into database
      const purchaseData = cartItems.map((item) => ({
        user_id: userId,
        item_id: item.id,
        quantity: item.quantity,
        total_price: item.item_price * item.quantity,
        delivery_address: deliveryMethod === 'delivery' ? `${postalCode}, ${district}, ${address}` : '',
        pickup_location: deliveryMethod,
        payment_method: 'cash',
      }));
  
      const { data, error } = await supabase.from('purchase_history').insert(purchaseData);
  
      if (error) {
        throw error;
      }
  
      Alert.alert('Success', 'Your order has been placed successfully.');
      navigation.navigate('DashboardScreen');
    } catch (error) {
      console.error('Error during checkout:', error.message);
      Alert.alert('Error', 'Failed to place order. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Receipt</Text>
      <View style={styles.receiptContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.receiptItem}>
            <Text style={styles.itemName}>{item.item_name}</Text>
            <Text style={styles.itemDetails}>
              Quantity: {item.quantity} | Price: Pkr {(item.item_price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>Pkr {calculateTotalPrice().toFixed(2)}</Text>
        </View>
      </View>

      <Picker
        selectedValue={deliveryMethod}
        style={styles.input}
        onValueChange={(itemValue) => setDeliveryMethod(itemValue)}
      >
        <Picker.Item label="Pick up from store" value="pickup" />
        <Picker.Item label="Delivery to address" value="delivery" />
      </Picker>

      {deliveryMethod === 'delivery' && (
        <>
          <TextInput
            style={styles.input}
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Postal Code"
          />
          <TextInput
            style={styles.input}
            value={district}
            onChangeText={setDistrict}
            placeholder="District"
          />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Full Address"
          />
        </>
      )}

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  receiptContainer: {
    marginBottom: 20,
  },
  receiptItem: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  itemDetails: {
    fontSize: 14,
    color: 'white',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  totalText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CA9329',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: 'black',
  },
  checkoutButton: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Cart;
