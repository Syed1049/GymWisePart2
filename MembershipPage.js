// MembershipPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MembershipPage = () => {
  const membershipData = {
    membershipType: 'Gold',
    expirationDate: '2024-12-31',
    benefits: [
      'Access to all gym facilities',
      'Personalized workout plans',
      'Discounts on fitness classes',
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Membership Page</Text>

      <Text style={styles.membershipInfo}>
        Membership Type: {membershipData.membershipType}
      </Text>

      <Text style={styles.membershipInfo}>
         Expiration Date: {membershipData.expirationDate}
      </Text>

      <Text style={styles.sectionTitle}>Membership Benefits:</Text>
      {membershipData.benefits.map((benefit, index) => (
        <Text key={index} style={styles.membershipBenefit}>
          {index + 1}. {benefit}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#010102', // Set your desired background color
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  membershipInfo: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    marginBottom: 10,
  },
  membershipBenefit: {
    fontSize: 16,
    color: 'white',
    marginLeft: 20,
    marginBottom: 5,
  },
});

export default MembershipPage;
