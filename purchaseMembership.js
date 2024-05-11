import React, { useState, useRef } from "react";
import { View, StyleSheet, Button, Animated, Alert } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native'

const PurchaseMembership = () => {
  const { confirmPayment, loading } = useStripe();
  const paymentOptionsY = useRef(new Animated.Value(1000)).current; // Used for animating the payment options
  const [cardDetails, setCardDetails] = useState();
  const [showPayment, setShowPayment] = useState(false);
  const navigation = useNavigation();

  const handlePayPress = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(data);
      const billingDetails = {
        email: "123@gmail.com",
      };
      console.log(cardDetails);

      if (
        cardDetails?.expiryYear != null &&
        cardDetails?.validCVC != "Incomplete"
      ) {
        alert("Payment Success");
        setCardDetails(null);
        setShowPayment(!showPayment);
       
        const { data: updateData, error: updateError } = await supabase
        .from("User")
        .update({ membership: true })
        .eq("id", userData.id);

        if (updateError) {
          console.error("Failed to update membership status:", updateError);
        } else {
          console.log("Updated membership status successfully:", updateData);
          navigation.navigate('DashboardScreen');
        }
      } else {
        alert("Enter valid card data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const togglePaymentOptions = () => {
    if (showPayment) {
      // Hide the payment options
      Animated.spring(paymentOptionsY, {
        toValue: 1000, // Move off-screen
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    } else {
      // Show the payment options
      Animated.spring(paymentOptionsY, {
        toValue: 0, // Move into view
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    }
    setShowPayment(!showPayment); // Toggle the visibility state
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.paymentOptionsContainer,
          { transform: [{ translateY: paymentOptionsY }] },
        ]}
      >
        <CardField
          postalCodeEnabled={true}
          placeholders={{ number: "4242 4242 4242 4242" }}
          cardStyle={styles.cardField}
          style={styles.cardContainer}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
        />
        <Button onPress={handlePayPress} title="Pay" disabled={loading} />
      </Animated.View>
      <Button title="Buy membership of $10" onPress={togglePaymentOptions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  paymentOptionsContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    padding: 20,
  },
  cardField: {
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
  },
  cardContainer: {
    height: 50,
    marginVertical: 20,
  },
});

export default PurchaseMembership;
