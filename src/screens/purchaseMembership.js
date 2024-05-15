import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from '../../supabase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PurchaseMembership = () => {
  const { confirmPayment, loading } = useStripe();
  const paymentOptionsY = useRef(new Animated.Value(1000)).current;
  const [cardDetails, setCardDetails] = useState();
  const [showPayment, setShowPayment] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (showPayment) {
      Animated.spring(paymentOptionsY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    } else {
      Animated.spring(paymentOptionsY, {
        toValue: 1000,
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    }
  }, [showPayment]);

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
    setShowPayment(!showPayment);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Animated.View style={styles.messageContainer}>
          <Ionicons name="warning-outline" size={24} color="orange" />
          <Text style={styles.messageText}>Oops! You haven't paid the membership yet.</Text>
          <Text style={styles.messageText}>To fully access the app, please pay the membership by clicking the button below.</Text>
        </Animated.View>
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
          <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <TouchableOpacity style={styles.membershipButton} onPress={togglePaymentOptions}>
        <Text style={styles.membershipButtonText}>Buy membership of $10</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  paymentOptionsContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardField: {
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
  },
  cardContainer: {
    height: 50,
    marginVertical: 20,
  },
  payButton: {
    backgroundColor: "orange",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  membershipButton: {
    backgroundColor: "orange",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20, // Added margin bottom to prevent overlapping with the keyboard
  },
  membershipButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageContainer: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  messageText: {
    color: "orange",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default PurchaseMembership;
