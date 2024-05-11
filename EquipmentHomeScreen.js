import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo icons
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from Expo

const EquipmentHomeScreen = ({ navigation }) => {
  const [totalEquipment, setTotalEquipment] = useState(0);
  const [totalInstances, setTotalInstances] = useState(0);
  const [availableInstances, setAvailableInstances] = useState(0);
  const [unavailableInstances, setUnavailableInstances] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchEquipmentStatistics();
    fadeInHeader();
  }, []);

  const fetchEquipmentStatistics = async () => {
    try {
      const { data: equipmentData, error: equipmentError } = await supabase.from('equipment').select('equipmentid');
      if (equipmentError) {
        throw equipmentError;
      }
      const totalEquipmentCount = equipmentData.length;
  
      const { data: instancesData, error: instancesError } = await supabase.from('equipment_instances').select('instanceid');
      if (instancesError) {
        throw instancesError;
      }
      const totalInstancesCount = instancesData.length;
  
      const { data: availableInstancesData, error: availableError } = await supabase
        .from('equipment_instances')
        .select('instanceid')
        .eq('availability', true);
      if (availableError) {
        throw availableError;
      }
      const availableInstancesCount = availableInstancesData.length;
  
      const unavailableInstancesCount = totalInstancesCount - availableInstancesCount;
  
      setTotalEquipment(totalEquipmentCount);
      setTotalInstances(totalInstancesCount);
      setAvailableInstances(availableInstancesCount);
      setUnavailableInstances(unavailableInstancesCount);
    } catch (error) {
      console.error('Error fetching equipment statistics:', error.message);
    }
  };

  const fadeInHeader = () => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#000000', '#333333']} style={styles.gradientBackground}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Ionicons name="calculator" size={32} color="#CA9329" />
          <Text style={styles.headerText}>Equipment Statistics</Text>
        </Animated.View>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TotalEquipmentScreen')}
          >
            <Ionicons name="analytics-outline" size={32} color="#CA9329" />
            <Text style={styles.cardText}>Total Equipment</Text>
            <Text style={styles.cardNumber}>{totalEquipment}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TotalInstancesScreen')}
          >
            <Ionicons name="copy-outline" size={32} color="#CA9329" />
            <Text style={styles.cardText}>Total Instances</Text>
            <Text style={styles.cardNumber}>{totalInstances}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AvailableInstancesScreen')}
          >
            <Ionicons name="checkmark-done-outline" size={32} color="#CA9329" />
            <Text style={styles.cardText}>Available Instances</Text>
            <Text style={styles.cardNumber}>{availableInstances}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('UnavailableInstancesScreen')}
          >
            <Ionicons name="close-outline" size={32} color="#CA9329" />
            <Text style={styles.cardText}>Unavailable Instances</Text>
            <Text style={styles.cardNumber}>{unavailableInstances}</Text>
          </TouchableOpacity>
          {/* New Buttons */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ManageEquipmentScreen')}
          >
            <Ionicons name="settings" size={32} color="#CA9329" />
            <Text style={styles.cardText}>Manage Equipment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AddEquipmentScreen')}
          >
            <Ionicons name="add" size={32} color="#CA9329" />
            <Text style={styles.cardText}>Add Equipment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('UpdateAvailabilityScreen')}
          >
            <Ionicons name="refresh" size={32} color="#CA9329" />
            <Text style={styles.cardText}>Update Availability</Text>
          </TouchableOpacity>
          {/* End of New Buttons */}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CA9329',
    marginLeft: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 5,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#CA9329',
  },
});

export default EquipmentHomeScreen;
