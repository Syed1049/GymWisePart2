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
  TouchableOpacity,
  Linking
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
      if (response.ok) {
        setMealPlans(data);
      } else {
        throw new Error(data.message || "Unable to fetch data");
      }
    } catch (error) {
      setError(error.toString());
    } finally {
      setIsLoading(false);
    }
  };

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
      <View style={styles.buttonContainer}>
        <Button
          title="Generate Meal Plan"
          onPress={fetchMealPlan}
          color="orange"
        />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#FFF" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {mealPlans && (
        <ScrollView style={styles.mealPlanContainer}>
          {mealPlans.week && Object.entries(mealPlans.week).map(([day, dayPlan], index) => (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>Meals for {day.charAt(0).toUpperCase() + day.slice(1)}:</Text>
              {dayPlan.meals.map((meal) => (
                <View key={meal.id} style={styles.mealItem}>
                  <Image
                    style={styles.mealImage}
                    source={{ uri: `https://spoonacular.com/recipeImages/${meal.id}-240x150.${meal.imageType}` }}
                  />
                  <View style={styles.mealDetailContainer}>
                    <Text style={styles.mealTitle}>{meal.title}</Text>
                    <Text style={styles.mealInfo}>Ready in: {meal.readyInMinutes} minutes</Text>
                    <Text style={styles.mealInfo}>Servings: {meal.servings}</Text>
                    <TouchableOpacity
                      style={styles.recipeButton}
                      onPress={() => Linking.openURL(meal.sourceUrl)}
                    >
                      <Text style={styles.buttonText}>View Recipe</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={styles.nutrientsContainer}>
                <Text style={styles.nutrientsTitle}>Total Nutrients for {day}:</Text>
                <Text style={styles.nutrientText}>Calories: {dayPlan.nutrients.calories.toFixed(2)}</Text>
                <Text style={styles.nutrientText}>Carbohydrates: {dayPlan.nutrients.carbohydrates.toFixed(2)}g</Text>
                <Text style={styles.nutrientText}>Fat: {dayPlan.nutrients.fat.toFixed(2)}g</Text>
                <Text style={styles.nutrientText}>Protein: {dayPlan.nutrients.protein.toFixed(2)}g</Text>
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
    backgroundColor: "black",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  input: {
    height: 40,
    backgroundColor: "grey",
    color: "white",
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    borderColor: "orange", // Added orange border color
    borderWidth: 1, // Added border width to make the border visible
  },
  mealPlanContainer: {
    marginTop: 20,
  },
  dayContainer: {
    marginBottom: 30,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  mealItem: {
    flexDirection: 'row',
    backgroundColor: '#555',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  mealImage: {
    width: 100,
    height: 'auto',
  },
  mealDetailContainer: {
    flex: 1,
    padding: 10,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  mealInfo: {
    color: 'white',
  },
  recipeButton: {
    marginTop: 10,
    backgroundColor: "blue",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  nutrientsContainer: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    marginTop: 10,
    borderColor: 'green',
  },
  nutrientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  nutrientText: {
    color: 'white',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
  }
});


export default MealPlanPage;
