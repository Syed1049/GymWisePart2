// DBService.js

import { supabase } from './supabase';
import { getUserSession } from './SessionService';

export const saveWorkoutPlan = async (workoutPlanData) => {
  try {
    // Insert the workout plan data into the database table named 'workoutplans'
    const { error } = await supabase.from('workoutplans').insert([workoutPlanData]);

    if (error) {
      throw new Error(error.message);
    }

    console.log('Workout plan saved successfully');

    // Fetch the maximum plan ID from the workoutplans table
    const { data: latestPlanIdData, error: fetchError } = await supabase
      .from('workoutplans')
      .select('plan_id')
      .order('plan_id', { ascending: false })
      .limit(1);

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const planId = latestPlanIdData[0].plan_id;

    console.log('Latest plan ID:', planId);

    // Return the plan ID
    return planId;

  } catch (error) {
    throw new Error('Failed to save workout plan to the database');
  }
};

export const saveRecommendedExercises = async (recommendedExercises, planId) => {
  try {
    // Create an array to hold the objects for batch insertion
    const exercisesToInsert = [];

    // Populate the array with exercise objects
    recommendedExercises.forEach((exercise) => {
      exercisesToInsert.push({
        exercise_id: exercise.id,
        plan_id: planId,
        exercise_name: exercise.name,
        description: exercise.desc,
        exercise_body_part: exercise.bodysection,
        exercise_equipment: exercise.equipment,
        reps: exercise.reps,
        sets: exercise.sets,
      });
    });

    // Perform the batch insert operation
    const { data, error } = await supabase.from('exercisesinplan').insert(exercisesToInsert);

    // Check for errors in the batch insert operation
    if (error) {
      throw new Error(error.message);
    }

    console.log('Recommended exercises saved successfully');
    return data; // Return the inserted data if needed
  } catch (error) {
    throw new Error('Failed to save recommended exercises to the database');
  }
};

export const fetchUserSession = async () => {
  try {
    const session = await getUserSession();
    return session.userId;
  } catch (error) {
    console.error('Error fetching user session:', error.message);
    throw new Error('Failed to fetch user session');
  }
};

export const fetchExercises = async (bodySection, fitnessLevel) => {
  try {
    const { data, error } = await supabase
      .from('exercise_goals')
      .select('*')
      .eq('exercise_bodysection', bodySection)
      .eq('exercise_level', fitnessLevel)
      .order('exercise_title', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
        console.log(data)
      return data;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error('Failed to fetch exercises from the database');
  }
};

export const recommendExercises = (exercises, timeLimit, fitnessLevel) => {
  const exercisesByLevel = {
    Beginner: { '30': { sets: 3, reps: 8, count: 6 }, '60': { sets: 3, reps: 8, count: 10 } },
    Intermediate: { '30': { sets: 4, reps: 10, count: 8 }, '60': { sets: 4, reps: 10, count: 12 } },
    Advanced: { '30': { sets: 5, reps: 12, count: 10 }, '60': { sets: 5, reps: 12, count: 15 } }
  };

  const maxExercises = exercisesByLevel[fitnessLevel]?.[timeLimit] || 0;

  if (typeof maxExercises === 'object') {
    const { sets, reps, count } = maxExercises;
    const recommendedExercises = exercises.slice(0, count).map((exercise, index) => {
      return {
        ...exercise,
        sets: sets,
        reps: reps,
        id: exercise.exercise_id,
        name: exercise.exercise_title,
        desc: exercise.exercise_desc,
        equipment: exercise.exercise_equipment,
        bodysection: exercise.exercise_bodysection,
      };
    });
    return recommendedExercises;
  } else {
    const { sets, reps } = exercisesByLevel[fitnessLevel]?.[timeLimit] || {};
    const recommendedExercises = exercises.slice(0, maxExercises).map((exercise, index) => {
      return {
        ...exercise,
        sets: sets,
        reps: reps,
        id: exercise.exercise_id,
        name: exercise.exercise_title,
        desc: exercise.exercise_desc,
        equipment: exercise.exercise_equipment,
        bodysection: exercise.exercise_bodysection,
      };
    });
    return recommendedExercises;
  }
};
