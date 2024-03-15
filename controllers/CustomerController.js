const Customer = require("../models/Customer");
const Coach = require("../models/Coach");
const Appointment = require("../models/Appointments");
const Preferences = require("../models/Preferences");
const mealType = require("../models/MealType");
const milestone = require("../models/Milestone");
const foodLog = require("../models/FoodLog");
const mealPlan = require("../models/MealPlan");


const calculateCalories = (weight, height, gender, age, goal, activityLevel) => {
  // Constants for calculating BMR
  const MALE_BMR_CONSTANT = 66.5;
  const FEMALE_BMR_CONSTANT = 65.1;
  const WEIGHT_CONSTANT = 13.75;
  const HEIGHT_CONSTANT = 5.003;
  const AGE_CONSTANT = 6.775;

  let bmr;
  if (gender === 'male') {
      bmr = MALE_BMR_CONSTANT + (WEIGHT_CONSTANT * weight) + (HEIGHT_CONSTANT * height) - (AGE_CONSTANT * age);
  } else if (gender === 'female') {
      bmr = FEMALE_BMR_CONSTANT + (WEIGHT_CONSTANT * weight) + (HEIGHT_CONSTANT * height) - (AGE_CONSTANT * age);
  } else {
      throw new Error('Invalid gender');
  }

  switch (goal) {
     case 'Get Fitter':
         break;
     case 'Gain Muscle':
         bmr *= 1.2;
         break;
     case 'Lose Weight':
         bmr *= 0.8;
         break;
     case 'Build Muscle':
         bmr *= 1.1;
         break;
     case 'Improve Endurance':
         bmr *= 1.05;
         break;
     default:
         throw new Error('Invalid goal');
 }

  const activityFactor = activityLevel;
  
  if (!activityFactor) {
      throw new Error('Invalid activity level');
  }
  const caloriesRequired = bmr * activityFactor;

  return caloriesRequired;
}

const CustomerController = {
  get_customer_data: async (req, res) => {
    try {
      console.log(req.query.customerId);
      const customerData = await Customer.findById(req.query.customerId);
      console.log(customerData);
      res.status(200).json(customerData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_weight_history: async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const weightHistory = await milestone
        .find({ _id: customerId })
        .limit(7)
        .sort({ date: -1 });
      res.status(200).json(weightHistory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_milestone: async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const newMilestones = await milestone.find({ customerId });
      res.json(newMilestones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_scheduled_appointments: async (req, res) => {
    try {
      const customerId = req.query.customerId;
      const currentAppointments = await Appointment.find({ customerId });
      res.json(currentAppointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  schedule_appointment: async (req, res) => {
    try {
      const { cust_id, coach_id, date, timeSlot } = req.body;
      console.log(req.body);

      if (!cust_id || !coach_id || !date || !timeSlot) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const currentCoach = await Coach.findById(coach_id);
      if (!currentCoach) {
        return res.status(404).json({ error: "Coach not found" });
      }

      const currentCustomer = await Customer.findById(cust_id);
      if (!currentCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      const newAppointment = new Appointment({
        date,
        coach_id,
        coach_name: currentCoach.name,
        cust_id,
        timeSlot,
      });

      await newAppointment.save();

      res.status(201).json({
        message: "Appointment scheduled successfully",
        newAppointment,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_coaches: async (req, res) => {
    try {
      const coaches = await Coach.find();
      res.json({ coaches });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  select_coach: async (req, res) => {
    try {
      const { cust_id, coach_id } = req.body;
      console.log(req.body);
      if (!cust_id || !coach_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const currentCustomer = await Customer.findById(cust_id);
      if (!currentCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      currentCustomer.coach_id = coach_id;
      await currentCustomer.save();

      res.json({ message: "Coach selected successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  get_selected_coach: async (req, res) => {
    try {
      const { coach_id } = req.query;

      const coachData = await Coach.findById(coach_id);

      if (!coachData) {
        return res.status(404).json({ error: "Coach not found" });
      }

      res.json({ coachData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  make_meal_plan: async (req, res) => {
    try {
      const { cust_id, meals } = req.body;

      if (!cust_id || !meals.breakfast || !meals.lunch || !meals.dinner) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newMealPlan = new mealPlan({
        cust_id,
        meals: {
          breakfast: meals.breakfast,
          lunch: meals.lunch,
          dinner: meals.dinner,
        },
      });

      await newMealPlan.save();

      res
        .status(201)
        .json({ message: "Meal plan created successfully", newMealPlan });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  log_meal: async (req, res) => {
    try {
      const { cust_id, name, serving_size, timeStamp, meal_type, info } =
        req.body;

      if (
        !cust_id ||
        !name ||
        !serving_size ||
        !timeStamp ||
        !meal_type ||
        !info
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newFoodLog = new foodLog({
        cust_id,
        name,
        serving_size,
        timeStamp,
        meal_type,
        info: {
          calories: info.calories || 0,
          carbs: info.carbs || 0,
          fats: info.fats || 0,
          proteins: info.proteins || 0,
        },
      });

      await newFoodLog.save();

      res.status(201).json({ message: "Meal logged successfully", newFoodLog });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_meal_plan: async (req, res) => {
    try {
      const cust_id = req.query.cust_id;

      if (!cust_id) {
        return res.status(400).json({ error: "Missing customer ID" });
      }

      const newMealPlan = await mealPlan.findOne({ cust_id });

      if (!newMealPlan) {
        return res
          .status(404)
          .json({ error: "Meal plan not found for the customer" });
      }

      res.json(newMealPlan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_today_meals: async (req, res) => {
    try {
      const cust_id = req.query.cust_id;

      if (!cust_id) {
        return res.status(400).json({ error: "Missing customer ID" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayMeals = await foodLog.find({
        cust_id,
        timeStamp: { $gte: today },
      });

      res.json(todayMeals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_calories_consumed: async (req, res) => {
    try {
      const cust_id = req.query.cust_id;
      if (!cust_id) {
        return res.status(400).json({ error: "Missing customer ID" });
      }
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const todayMeals = await foodLog.find({
        cust_id,
        timeStamp: { $gte: startOfDay },
      });
      let totalCalories = 0;
      todayMeals.forEach((meal) => {
        totalCalories += meal.info.calories;
      });
      res.json({ totalCaloriesConsumed: totalCalories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLastThreeMeals: async (req, res) => {
    try {
      const { cust_id } = req.query;

      if (!cust_id) {
        return res.status(400).json({ error: "Missing customer ID" });
      }

      const lastThreeMeals = await foodLog
        .find({ cust_id: cust_id })
        .sort({ timeStamp: -1 })
        .limit(3)
        .exec();

      res.json(lastThreeMeals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  store_preferences: async (req, res) => {
    try {
      const { cust_id, gender, age, weight, height, goal, activityLevel } =
        req.body;

      if (
        !cust_id ||
        !gender ||
        !age ||
        !weight ||
        !height ||
        !goal ||
        !activityLevel
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const numericHeight = parseFloat(height.match(/\d+/)[0]);
      const numericWeight = parseFloat(weight.match(/\d+/)[0]);

      let activityMultiplier = 0;
      switch (activityLevel) {
        case "Sedentary":
          activityMultiplier = 1.2;
          break;
        case "Lightly Active":
          activityMultiplier = 1.375;
          break;
        case "Moderately Active":
          activityMultiplier = 1.55;
          break;
        case "Very Active":
          activityMultiplier = 1.725;
          break;
        case "Extra Active":
          activityMultiplier = 1.9;
          break;
        default:
          activityMultiplier = 1.2;
      }

      let bmr = calculateCalories(numericWeight, numericHeight, gender, age, goal, activityMultiplier);


      let existingPreference = await Preferences.findOne({ cust_id });
      const customerData = await Customer.findById( cust_id );

      customerData.dailyCalories = parseFloat(bmr).toFixed(0);
      await customerData.save();

      if (existingPreference) {
        existingPreference.gender = gender;
        existingPreference.age = age;
        existingPreference.weight = weight;
        existingPreference.height = height;
        existingPreference.goal = goal;
        existingPreference.activityLevel = activityLevel;
        existingPreference.minimumCalories = parseFloat(bmr).toFixed(0);

        await existingPreference.save();

        res.status(200).json({
          message: "Preferences updated successfully",
          updatedPreference: existingPreference,
          customerData: customerData
        });
      } else {
        // Create new preference
        const newPreference = new Preferences({
          cust_id,
          gender,
          age,
          weight,
          height,
          goal,
          activityLevel,
          minimumCalories: tdee,
        });

        await newPreference.save();

        res
          .status(201)
          .json({ message: "Preferences stored successfully", newPreference });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_preferences: async (req, res) => {
    try {
      const { cust_id } = req.query;

      if (!cust_id) {
        return res.status(400).json({ error: "Missing customer ID" });
      }

      const preferences = await Preferences.findOne({ cust_id });

      if (!preferences) {
        return res
          .status(404)
          .json({ error: "Preferences not found for the customer" });
      }

      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CustomerController;
