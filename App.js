import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import TutorialScreen from "./src/screens/TutorialScreen";
import BodyPartScreen from "./src/screens/BodyPartScreen";
import TutorialHome from "./src/screens/TutorialHome";
import BodyPartVideosScreen from "./src/screens/BodyPartVideosScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AdminLoginScreen from "./src/screens/AdminLoginScreen";
import MemberSupportScreen from "./src/screens/MemberSupportScreen";
import UserDashboard from "./src/screens/UserDashboard";
import Store from "./src/screens/Store";
import TrainerSignUpScreen from "./src/screens/TrainerSignUpScreen";
import TrainerSignInScreen from "./src/screens/TrainerSignInScreen";
import TrainerDashboardScreen from "./src/screens/TrainerDashboardScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import BookingPage from "./src/screens/BookingPage";
import UpcomingBookingsPage from "./src/screens/UpcomingBookingsPage";
import TimePicker from "./src/screens/TimePicker";
import NewHome from "./src/screens/newhome";
import GoalDetailsScreen from "./src/screens/GoalDetailsScreen";
import WorkoutPlanScreen from "./src/screens/WorkoutPlanScreen";
import GoalsScreen from "./src/screens/GoalsScreen";
import MuscleGroupsScreen from "./src/screens/MuscleGroupsScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import PlanDetailsScreen from "./src/screens/PlanDetailsScreen";
import AdminDashboard from "./src/screens/AdminDashboard";
import AddEquipmentScreen from "./src/screens/AddEquipmentScreen";
import UpdateAvailabilityScreen from "./src/screens/UpdateAvailabilityScreen";
import ManageEquipmentScreen from "./src/screens/ManageEquipmentScreen";
import EquipmentHomeScreen from "./EquipmentHomeScreen";
import UpdatedGoalsDetailsScreen from "./src/screens/UpdatedGoalsDetailsScreen";
import CourseCreationScreen from "./src/screens/CourseCreationScreen";
import SetAvailableHoursScreen from "./src/screens/SetAvailbleHoursScreen";
import CoursesScreen from "./src/screens/CoursesScreen";
import CourseDetailsScreen from "./src/screens/CourseDetailsScreen";
import SessionsScreen from "./src/screens/SessionsScreen";
import TrainerListScreen from "./src/screens/TrainerListScreen";
import TrainerDetailsScreen from "./src/screens/TrainerDetailsScreen";
import CustomGoalScreen from "./src/screens/CustomGoalScreen";
import TrainerPage from "./src/screens/TrainerPage";
import BMI from "./src/screens/BMI";
import FitnessDashboard from "./src/screens/FitnessDashboard";
import AttendancePage from "./src/screens/AttendancePage";
import FitnessGoalsPage from "./src/screens/RecentActivityPage";
import Goals from "./src/screens/Goals";
import MembershipPage from "./src/screens/MembershipPage";
import PaymentModule from "./src/screens/PaymentModule";
import Plans from "./src/screens/Plans";
import ProfileScreen from "./src/screens/profileScreen";
import RecentActivityPage from "./src/screens/RecentActivityPage";
import SelectDateAndSlot from "./src/screens/SelectDateAndSlot";
import Payment from "./src/screens/payment";
import TrainersModule from "./src/screens/TrainersModule";
import MealPlanPage from "./src/screens/MealPlanPage";
import MembershipPayment from "./src/screens/membershipPayment";
const Stack = createStackNavigator();
export default function App() {
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
          options={{ 
            headerShown: true,
            headerStyle: { backgroundColor: '#000' }, // Set header background color to black
            headerTintColor: '#ff8c00', // Set header text color to orange
          }} // Hide the header
        />
        <Stack.Screen
          name="BookingPage"
          component={BookingPage}
          options={{ 
            headerShown: false,
            headerStyle: { backgroundColor: '#000' }, // Set header background color to black
            headerTintColor: '#ff8c00', // Set header text color to orange
          }}
        />

        <Stack.Screen name="TimePicker" component={TimePicker} />
        <Stack.Navigator initialRouteName="Tutorial">
          <Stack.Screen
            name=" "
            component={NewHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TrainerSignUpScreen"
            component={TrainerSignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SessionsScreen"
            component={SessionsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TrainerSignInScreen"
            component={TrainerSignInScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="CourseCreationScreen"
            component={CourseCreationScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="TrainerDashboardScreen"
            component={TrainerDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SetAvailableHoursScreen"
            component={SetAvailableHoursScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="CoursesScreen"
            component={CoursesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CourseDetailsScreen"
            component={CourseDetailsScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="TrainerListScreen"
            component={TrainerListScreen}
            options={{ 
              headerShown: true,
              headerStyle: { backgroundColor: '#000' }, // Set header background color to black
              headerTintColor: '#ff8c00', // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="TrainerDetailsScreen"
            component={TrainerDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomGoalScreen"
            component={CustomGoalScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="BodyPartScreen" component={BodyPartScreen} />
          <Stack.Screen name="TutorialScreen" component={TutorialScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="TutorialHome" component={TutorialHome} />
          <Stack.Screen
            name="BodyPartVideosScreen"
            component={BodyPartVideosScreen}
          />
          <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen} />
          <Stack.Screen
            name="Store"
            component={Payment}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="MealPlanPage"
            component={MealPlanPage}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="MemberSupportScreen"
            component={MemberSupportScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
          <Stack.Screen name="MembershipPage" component={MembershipPage} />

          <Stack.Screen name="Trainers" component={TrainersModule} />
          <Stack.Screen
            name="Newhome"
            component={NewHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpcomingBookingsPage"
            component={UpcomingBookingsPage}
            options={{ 
              headerShown: true,
              headerStyle: { backgroundColor: '#000' }, // Set header background color to black
              headerTintColor: '#ff8c00', // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={{ 
              headerShown: true,
              headerStyle: { backgroundColor: '#000' }, // Set header background color to black
              headerTintColor: '#ff8c00', // Set header text color to orange
            }}
          
          />
          <Stack.Screen
            name="BookingPage"
            component={BookingPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="TimePicker" component={TimePicker} />
          <Stack.Screen
            name="GoalDetailsScreen"
            component={GoalDetailsScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="MembershipPayment"
            component={MembershipPayment}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen name="FitnessDashboard" component={FitnessDashboard} />
          <Stack.Screen
            name="WorkoutPlanScreen"
            component={WorkoutPlanScreen}
          />
          <Stack.Screen
            name="DashboardScreen"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddEquipmentScreen"
            component={AddEquipmentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoalsScreen"
            component={GoalsScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" }, // Set header background color to black
              headerTintColor: "#ff8c00", // Set header text color to orange
            }}
          />
          <Stack.Screen
            name="PlanDetailsScreen"
            component={PlanDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MuscleGroupsScreen"
            component={MuscleGroupsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateAvailabilityScreen"
            component={UpdateAvailabilityScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageEquipmentScreen"
            component={ManageEquipmentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EquipmentHomeScreen"
            component={EquipmentHomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdatedGoalsDetailsScreen"
            component={UpdatedGoalsDetailsScreen}
            options={{ headerShown: false }}
          />

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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
