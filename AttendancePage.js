// AttendancePage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AttendancePage = () => {
  const attendanceData = {
    totalClasses: 20,
    attendedClasses: 15,
    attendancePercentage: ((15 / 20) * 100).toFixed(2), // Calculate attendance percentage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Attendance Page</Text>

      <Text style={styles.attendanceInfo}>
        Total Classes: {attendanceData.totalClasses}
      </Text>

      <Text style={styles.attendanceInfo}>
        Attended Classes: {attendanceData.attendedClasses}
      </Text>

      <Text style={styles.attendanceInfo}>
        Attendance Percentage: {attendanceData.attendancePercentage}%
      </Text>
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
    alignContent: 'centre',
  },
  attendanceInfo: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    alignContent:'center',
  },
});

export default AttendancePage;
