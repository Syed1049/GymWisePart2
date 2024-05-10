import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,TouchableOpacity
} from "react-native";

const MealPlanPage = ({ apiKey }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mealPlans, setMealPlans] = useState();

  const [targetCalories, setTargetCalories] = useState("2000");
  const [diet, setDiet] = useState("");
  const [exclude, setExclude] = useState("");

  const fetchMealPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiKey = "1859bfc26a2d42df9b3a697d7b54d590";
      const response = await fetch(
        `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&targetCalories=${targetCalories}&diet=${diet}&exclude=${exclude}`,
        {
          headers: {
            "x-api-key": apiKey,
            "Auth-Type": "spoonacular",
          },
        }
      );
      const data = await response.json();
      console.log("meal plane data", data);
      if (response.ok) {
        setMealPlans(data); // Append new plan to existing array
      } else {
        throw new Error(data.message || "Unable to fetch data");
      }
    } catch (error) {
      setError(error.toString());
    } finally {
      setIsLoading(false);
    }
  };
  console.log(mealPlans);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Daily Meal Plan</Text>
      <TextInput
        style={styles.input}
        value={targetCalories}
        onChangeText={setTargetCalories}
        placeholder="Target Calories (e.g., 2000)"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={diet}
        onChangeText={setDiet}
        placeholder="Diet (e.g., vegetarian)"
      />
      <TextInput
        style={styles.input}
        value={exclude}
        onChangeText={setExclude}
        placeholder="Exclude (e.g., shellfish, olives)"
      />
      <View style={{ borderRadius: 20, overflow: "hidden" }}>
        <Button
          title="Generate Meal Plan"
          onPress={fetchMealPlan}
          color="orange"
        />
      </View>
      {isLoading && <ActivityIndicator size="large" color="white" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {mealPlans && (
        <ScrollView style={styles.mealPlanContainer}>
          {mealPlans &&
            Object.entries(mealPlans?.week).map(([day, dayPlan], index) => (
              <View key={index} style={styles.planItem}>
                <Text style={{ color: "white" }}>Meals for {day}:</Text>
                {dayPlan.meals.map((meal) => (
                  <View key={meal.id} style={styles.mealItem}>
                    <Text style={{ color: "white" }}>{meal.title}</Text>
                    <Image
                      style={styles.mealImage}
                      source={{
                        uri: `https://spoonacular.com/recipeImages/${meal.id}-240x150.${meal.imageType}`,
                      }}
                    />
                    <Text style={{ color: "white" }}>
                      Ready in: {meal.readyInMinutes} minutes
                    </Text>
                    <Text style={{ color: "white" }}>
                      Servings: {meal.servings}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "blue",
                        borderRadius: 20,
                        padding: 10,
                        alignItems: "center",
                      }}
                      onPress={() => Linking.openURL(meal.sourceUrl)}
                    >
                      <Text style={{ color: "white" }}>View Recipe</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={styles.nutrientsContainer}>
                  <Text style={styles.nutrientsTitle}>Total Nutrients:</Text>
                  <Text>Calories: {dayPlan.nutrients.calories.toFixed(2)}</Text>
                  <Text>
                    Carbohydrates: {dayPlan.nutrients.carbohydrates.toFixed(2)}g
                  </Text>
                  <Text>Fat: {dayPlan.nutrients.fat.toFixed(2)}g</Text>
                  <Text>Protein: {dayPlan.nutrients.protein.toFixed(2)}g</Text>
                </View>
              </View>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Background color black
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white", // Text color white
  },
  input: {
    height: 40,
    backgroundColor: "grey", // Background color grey
    marginBottom: 10,
    padding: 10,
    borderRadius: 20, // Border radius
    color: "white", // Text color white
  },
  mealPlanContainer: {
    marginTop: 20,
    backgroundColor: "black",
  },
  mealImage: {
    width: 240,
    height: 150,
    marginBottom: 10,
  },
  mealImage: {
    width: 240,
    height: 150,
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white", // Text color white
  },
});

export default MealPlanPage;
