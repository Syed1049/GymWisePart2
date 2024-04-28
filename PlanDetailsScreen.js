import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { supabase } from './supabase';

const PlanDetailsScreen = () => {
  const [planDetails, setPlanDetails] = useState(null);
  const route = useRoute();
  const { planId } = route.params;

  useEffect(() => {
    fetchPlanDetails(planId);
  }, [planId]);

  const fetchPlanDetails = async (planId) => {
    try {
      const { data, error } = await supabase
        .from('workoutplans')
        .select('plan_name')
        .eq('plan_id', planId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setPlanDetails(data);
    } catch (error) {
      console.error('Error fetching plan details:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Plan Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Plan ID:</Text>
        <Text style={styles.value}>{planId}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Plan Name:</Text>
        <Text style={styles.value}>{planDetails ? planDetails.plan_name : 'Loading...'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#CA9329',
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    color: 'white',
  },
});

export default PlanDetailsScreen;
