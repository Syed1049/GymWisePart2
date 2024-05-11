import { supabase } from './supabase'; // Import your Supabase client

export const saveCourseInfo = async (courseName, courseDifficulty, courseBodyPart, numDays, trainerId) => {
    try {
        // Insert course data into the 'courses' table
        const { data: courseData, error: courseError } = await supabase.from('courses').insert([
            {
                course_name: courseName,
                course_difficulty: courseDifficulty,
                course_body_part: courseBodyPart,
                num_days: parseInt(numDays),
                trainer_id: trainerId
            }
        ]);

        if (courseError) {
            throw courseError;
        }

        // Fetch the maximum course ID after insertion
        const { data: maxCourseIdData, error: maxCourseIdError } = await supabase
            .from('courses')
            .select('course_id')
            .order('course_id', { ascending: false })
            .limit(1);

        if (maxCourseIdError) {
            throw maxCourseIdError;
        }

        // Extract and return the course ID
        if (maxCourseIdData && maxCourseIdData.length > 0) {
            return maxCourseIdData[0].course_id;
        } else {
            throw new Error('Failed to retrieve the course ID after insertion.');
        }
    } catch (error) {
        throw error;
    }
};

  
export const saveExerciseInfo = async (courseId, exerciseList) => {
    try {
      // Flatten the exercise list to prepare for insertion
      const flattenedExercises = exerciseList.flatMap((day, dayIndex) => {
        return day.exercises.map((exercise, exerciseIndex) => {
          // Define the exercise object with mandatory fields
          const exerciseData = {
            course_id: courseId,
            day_index: dayIndex + 1,
            name: exercise.name,
            description: exercise.description,
            difficulty: exercise.difficulty,
            sets: exercise.sets,
            reps: exercise.reps,
            equipment: exercise.equipment
          };
  
          // Include video data if available
          if (exercise.video) {
            // Assuming 'video' contains the video data (e.g., base64)
            exerciseData.video_data = exercise.video; // Add the video data to the exercise data
          }
  
          return exerciseData;
        });
      });
  
      // Insert exercise data into the 'course_exercises' table
      const { data, error } = await supabase.from('course_exercises').insert(flattenedExercises);
      if (error) {
        throw error;
      }
  
      console.log('Inserted exercises:', data);
    } catch (error) {
      throw error;
    }
  };
  