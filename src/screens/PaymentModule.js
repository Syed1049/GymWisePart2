import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

const PaymentModule = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');

  const handleConfirm = () => {
    // Implement payment processing logic here
    console.log('Payment confirmed!');
  };

  return (
    <View style={styles.container}>
      {/* Top Heading with Back and Menu Buttons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/back-button.png')}  
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.heading}>Payment</Text>
        <TouchableOpacity onPress={() => console.log('Menu button pressed')}>
          <Image
            source={require('../../assets/dots.png')} 
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Payment Details Section Container */}
      <View style={styles.paymentContainer}>
        {/* Payment Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Payment Details</Text>

          {/* Invoice Details */}
          <Text>Invoice Details: Your invoice details go here.</Text>

          {/* Card Number Input */}
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(text)}
          />

          {/* Expiry Date Input */}
          <TextInput
            style={styles.input}
            placeholder="Expiry Date"
            keyboardType="numeric"
            value={expiryDate}
            onChangeText={(text) => setExpiryDate(text)}
          />

          {/* CVV Input */}
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            value={cvv}
            onChangeText={(text) => setCVV(text)}
          />

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 20,
    color:'#17171A',
    backgroundColor:'#010102'

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    width: 30,
    height: 30,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white',
    
    
  },
  paymentContainer: {
    backgroundColor: '#17171A',
    padding: 30,
    borderRadius: 12,
    marginBottom: 20,
    fontStyle:'normal',
    color:'white',
  },
  section: {
    marginBottom: 20,
    
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  input: {
    height: 45,
    
    borderColor: '#CB952B',
    borderRadius:10,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: 'white',
    backgroundColor:'#2D2D30',
  },
  confirmButton: {
    backgroundColor: '#2D2D30',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 20,
    borderColor: '#CB952B',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    borderColor: '#CB952B',
  },
});

export default PaymentModule;
