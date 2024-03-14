const Customer = require("../models/Customer");
const Coach = require("../models/Coach");
const Appointment = require("../models/Appointments");
const Preferences = require("../models/Preferences");
const mealType = require("../models/MealType");
const milestone = require("../models/Milestone");
const foodLog = require("../models/FoodLog");
const mealPlan = require("../models/MealPlan");

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

      // Calculate BMR based on gender

      const numericPart2 = height.match(/\d+/);
      const number2 = parseFloat(numericPart2[0]);

      const numericPart3 = weight.match(/\d+/);
      const number3 = parseFloat(numericPart3[0]);

      let bmr;
      if (gender === "male") {
        bmr =
          10 * parseFloat(number3).toFixed(2) +
          6.25 * parseFloat(number2).toFixed(2) -
          5 * parseFloat(age).toFixed(2) +
          5;
      } else if (gender === "female") {
        bmr =
          10 * parseFloat(number3).toFixed(2) +
          6.25 * parseFloat(number2).toFixed(2) -
          5 * parseFloat(age).toFixed(2) -
          161;
      }

      // Adjust BMR based on activity level (TDEE) - Total Daily Energy Expenditure
      let tdee = 2000;
      switch (goal) {
        case "Get Fitter":
          activityMultiplier = 1.2;
          break;
        case "Gain Weight":
          activityMultiplier = 1.375;
          break;
        case "Lose Weight":
          activityMultiplier = 1.55;
          break;
        case "Build Muscle":
          activityMultiplier = 1.725;
          break;
        case "Improve Endurance":
          activityMultiplier = 1.9;
          break;
        default:
          activityMultiplier = 1.2; // Default to Get Fitter
      }

      let existingPreference = await Preferences.findOne({ cust_id });
      const customerData = await Customer.findById({ cust_id });

      if (existingPreference) {
        // Update existing preference
        existingPreference.gender = gender;
        existingPreference.age = age;
        existingPreference.weight = number3;
        existingPreference.height = number2;
        existingPreference.goal = goal;
        existingPreference.activityLevel = activityLevel;
        existingPreference.minimumCalories = tdee; // Store calculated minimum calories

        await existingPreference.save();

        res.status(200).json({
          message: "Preferences updated successfully",
          updatedPreference: existingPreference,
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
          minimumCalories: tdee, // Store calculated minimum calories
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
