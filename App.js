import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import TutorialScreen from './TutorialScreen';
import BodyPartScreen from './BodyPartScreen';
import TutorialHome from './TutorialHome';
import BodyPartVideosScreen from './BodyPartVideosScreen';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import AdminLoginScreen from './AdminLoginScreen';
import MemberSupportScreen from './MemberSupportScreen';
import UserDashboard from './UserDashboard';
import Store from './Store';
import TrainerSignUpScreen from './TrainerSignUpScreen';
import TrainerSignInScreen from './TrainerSignInScreen';
import TrainerDashboardScreen from './TrainerDashboardScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import BookingPage from './BookingPage';
import UpcomingBookingsPage from './UpcomingBookingsPage';
import TimePicker from './TimePicker';
import NewHome from './newhome';
import GoalDetailsScreen from './GoalDetailsScreen';
import WorkoutPlanScreen from './WorkoutPlanScreen';
import GoalsScreen from './GoalsScreen';
import MuscleGroupsScreen from './MuscleGroupsScreen';
import DashboardScreen from './DashboardScreen';
import PlanDetailsScreen from './PlanDetailsScreen';
import AdminDashboard from './AdminDashboard';
import AddEquipmentScreen from './AddEquipmentScreen';
import UpdateAvailabilityScreen from './UpdateAvailabilityScreen';
import ManageEquipmentScreen from './ManageEquipmentScreen';
import EquipmentHomeScreen from './EquipmentHomeScreen';
import UpdatedGoalsDetailsScreen from './UpdatedGoalsDetailsScreen';
import CourseCreationScreen from './CourseCreationScreen';
import SetAvailableHoursScreen from './SetAvailbleHoursScreen';
import CoursesScreen from './CoursesScreen';
import CourseDetailsScreen from './CourseDetailsScreen';
import SessionsScreen from './SessionsScreen';
import TrainerListScreen from './TrainerListScreen';
import TrainerDetailsScreen from './TrainerDetailsScreen';
import CustomGoalScreen from './CustomGoalScreen';
import TrainerPage from './TrainerPage';
import BMI from './BMI';
import FitnessDashboard from './FitnessDashboard';
import AttendancePage from './AttendancePage';
import FitnessGoalsPage from './RecentActivityPage';
import Goals from './Goals';
import MembershipPage from './MembershipPage';
import PaymentModule from './PaymentModule';
import Plans from './Plans';
import ProfileScreen from './profileScreen';
import RecentActivityPage from './RecentActivityPage';
import SelectDateAndSlot from './SelectDateAndSlot';
import Payment from './payment';
import TrainersModule from './TrainersModule';
import MealPlanPage from './MealPlanPage';
import MembershipPayment from './membershipPayment';
const Stack = createStackNavigator();
export default function App()  {
  return (
    <PaperProvider>
    <NavigationContainer>
    <Stack.Screen
  name="Newhome"
  component={NewHome}
  options={{ headerShown: false }} // Hide the header
/>
<Stack.Screen
  name="SignUpScreen"
  component={SignUpScreen}
  options={{ headerShown: false }} // Hide the header
/>
<Stack.Screen
  name="UpcomingBookingsPage"
  component={UpcomingBookingsPage}
  options={{ headerShown: false }} // Hide the header
/>
<Stack.Screen
  name="SignInScreen"
  component={SignInScreen}
  options={{ headerShown: false }} // Hide the header
/>
<Stack.Screen
  name="BookingPage"
  component={BookingPage}
  options={{ headerShown: false }} // Hide the header
/>

<Stack.Screen name="TimePicker" component={TimePicker} />
      <Stack.Navigator initialRouteName="Tutorial">
      <Stack.Screen name=" " component={NewHome} 
        options={{headerShown:false}}

      /> 
       <Stack.Screen name="TrainerSignUpScreen" component={TrainerSignUpScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="SessionsScreen" component={SessionsScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="TrainerSignInScreen" component={TrainerSignInScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="CourseCreationScreen" component={CourseCreationScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="TrainerDashboardScreen" component={TrainerDashboardScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="SetAvailableHoursScreen" component={SetAvailableHoursScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="CoursesScreen" component={CoursesScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="CourseDetailsScreen" component={CourseDetailsScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="TrainerListScreen" component={TrainerListScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="TrainerDetailsScreen" component={TrainerDetailsScreen}  options={{ headerShown: false }}/>
       <Stack.Screen name="CustomGoalScreen" component={CustomGoalScreen}  options={{ headerShown: false }}/>
          <Stack.Screen name="BodyPartScreen" component={BodyPartScreen} />
          <Stack.Screen name="TutorialScreen" component={TutorialScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
          <Stack.Screen name="TutorialHome" component={TutorialHome}/>
          <Stack.Screen name="BodyPartVideosScreen" component={BodyPartVideosScreen} />
          <Stack.Screen name= "AdminLoginScreen" component={AdminLoginScreen}/>
          <Stack.Screen name= "Store" component={Payment}/>
          <Stack.Screen name="MealPlanPage" component={MealPlanPage} />
          <Stack.Screen name= "MemberSupportScreen" component={MemberSupportScreen}/>
          <Stack.Screen name= "UserDashboard" component={UserDashboard}/>
          <Stack.Screen name= "MembershipPage" component={MembershipPage}/>
          
          <Stack.Screen name= "Trainers" component={TrainersModule}/>
          <Stack.Screen name="Newhome" component={NewHome} options={{ headerShown: false }} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UpcomingBookingsPage" component={UpcomingBookingsPage} options={{ headerShown: false }} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BookingPage" component={BookingPage} options={{ headerShown: false }} />
          <Stack.Screen name="TimePicker" component={TimePicker} />
          <Stack.Screen name="GoalDetailsScreen" component={GoalDetailsScreen}  />
          <Stack.Screen name="MembershipPayment" component={MembershipPayment}  />
          <Stack.Screen name="FitnessDashboard" component={FitnessDashboard}  />
          <Stack.Screen name="WorkoutPlanScreen" component={WorkoutPlanScreen} />
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{headerShown:false}} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{headerShown:false}} />
          <Stack.Screen name="AddEquipmentScreen" component={AddEquipmentScreen} options={{headerShown:false}} />
          <Stack.Screen name="GoalsScreen" component={GoalsScreen}  options={{ headerShown: false }}/>
          <Stack.Screen name="PlanDetailsScreen" component={PlanDetailsScreen}  options={{ headerShown: false }}/>
          <Stack.Screen name="MuscleGroupsScreen" component={MuscleGroupsScreen}  options={{ headerShown: false }}/>
          <Stack.Screen name="UpdateAvailabilityScreen" component={UpdateAvailabilityScreen}  options={{ headerShown: false }}/>
          <Stack.Screen name="ManageEquipmentScreen" component={ManageEquipmentScreen}  options={{ headerShown: false }}/>
          <Stack.Screen name="EquipmentHomeScreen" component={EquipmentHomeScreen}  options={{ headerShown: false }}/>
          <Stack.Screen name="UpdatedGoalsDetailsScreen" component={UpdatedGoalsDetailsScreen}  options={{ headerShown: false }}/>
   
          {/* <Stack.Screen name="TrainerPage" component={TrainerPage} />
<Stack.Screen name="BMI" component={BMI} />
<Stack.Screen name="FitnessDashboard" component={FitnessDashboard} />
<Stack.Screen name="AttendancePage" component={AttendancePage} />
<Stack.Screen name="FitnessGoalsPage" component={FitnessGoalsPage} />
<Stack.Screen name="Goals" component={Goals} />
<Stack.Screen name="MembershipPage" component={MembershipPage} />
<Stack.Screen name="PaymentModule" component={PaymentModule} />
<Stack.Screen name="Plans" component={Plans} />
<Stack.Screen name="ProfileScreen" component={ProfileScreen} />
<Stack.Screen name="RecentActivityPage" component={RecentActivityPage} />
<Stack.Screen name="SelectDateAndSlot" component={SelectDateAndSlot} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
