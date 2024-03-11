const Customer = require('../models/Customer');
const Coach = require('../models/Coach')
const Appointment = require('../models/Appointments');
const Preferences = require('../models/Preferences');
const mealType = require('../models/MealType');
const milestone = require('../models/Milestone');
const foodLog = require('../models/FoodLog');
const mealPlan = require('../models/MealPlan')

const CustomerController = {
  get_customer_data: async (req, res) => {
    try {
      console.log(req.query.customerId)
      const customerData = await Customer.findById(req.query.customerId);
      console.log(customerData)
      res.status(200).json(customerData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_weight_history: async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const weightHistory = await milestone.find({ _id: customerId }).limit(7).sort({ date: -1 });
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
        const currentAppointments = await appointment.find({ customerId });
        res.json(currentAppointments);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },

  schedule_appointment: async (req, res) => {
    try {
        const { cust_id, coach_id, datetime } = req.body;
        console.log(req.body)
        const date = new Date(datetime);
    
        if (!cust_id || !coach_id || !date) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        const currentCoach = await Coach.findById(coach_id);
        if (!currentCoach) {
          return res.status(404).json({ error: 'Coach not found' });
        }
    
        const currentCustomer = await Customer.findById(cust_id);
        if (!currentCustomer) {
          return res.status(404).json({ error: 'Customer not found' });
        }
    
        const newAppointment = new Appointment({
          date,
          coach_id,
          coach_name: currentCoach.name,
          cust_id
        });
    
        await newAppointment.save();
    
        res.status(201).json({ message: 'Appointment scheduled successfully', newAppointment });
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
        console.log(req.body)
        if (!cust_id || !coach_id) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        const currentCustomer = await Customer.findById(cust_id);
        if (!currentCustomer) {
          return res.status(404).json({ error: 'Customer not found' });
        }
    
        currentCustomer.coach_id = coach_id;
        await currentCustomer.save();
    
        res.json({ message: 'Coach selected successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },
  get_selected_coach: async (req, res) => {
    try {
        const { coach_id } = req.query;

        const coachData = await Coach.findById(coach_id);
    
        if (!coachData) {
          return res.status(404).json({ error: 'Coach not found' });
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
          return res.status(400).json({ error: 'Missing required fields' });
        }
  
        const newMealPlan = new mealPlan({
          cust_id,
          meals: {
            breakfast: meals.breakfast,
            lunch: meals.lunch,
            dinner: meals.dinner
          }
        });
  
        await newMealPlan.save();
  
        res.status(201).json({ message: 'Meal plan created successfully', newMealPlan });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },

  log_meal: async (req, res) => {
    try {
        const { cust_id, name, serving_size, timeStamp, meal_type, info } = req.body;
    
        if (!cust_id || !name || !serving_size || !timeStamp || !meal_type || !info) {
          return res.status(400).json({ error: 'Missing required fields' });
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
            proteins: info.proteins || 0
          }
        });
    
        await newFoodLog.save();
    
        res.status(201).json({ message: 'Meal logged successfully', newFoodLog });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },

  get_meal_plan: async (req, res) => {
    try {
        const cust_id = req.query.cust_id;
    
        if (!cust_id) {
          return res.status(400).json({ error: 'Missing customer ID' });
        }
    
        const newMealPlan = await mealPlan.findOne({ cust_id });
    
        if (!newMealPlan) {
          return res.status(404).json({ error: 'Meal plan not found for the customer' });
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
          return res.status(400).json({ error: 'Missing customer ID' });
        }
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const todayMeals = await foodLog.find({ cust_id, timeStamp: { $gte: today } });
    
        res.json(todayMeals);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },

  store_preferences: async (req, res) => {
    try {
        const { cust_id, gender, age, weight, height, goal, activityLevel } = req.body;

        if (!cust_id || !gender || !age || !weight || !height || !goal || !activityLevel) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let existingPreference = await Preferences.findOne({ cust_id });

        if (existingPreference) {
            // Update existing preference
            existingPreference.gender = gender;
            existingPreference.age = age;
            existingPreference.weight = weight;
            existingPreference.height = height;
            existingPreference.goal = goal;
            existingPreference.activityLevel = activityLevel;

            await existingPreference.save();

            res.status(200).json({ message: 'Preferences updated successfully', updatedPreference: existingPreference });
        } else {
            // Create new preference
            const newPreference = new Preferences({
                cust_id,
                gender,
                age,
                weight,
                height,
                goal,
                activityLevel
            });

            await newPreference.save();

            res.status(201).json({ message: 'Preferences stored successfully', newPreference });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

  get_preferences: async (req, res) => {
    try {
        const { cust_id } = req.query;
    
        if (!cust_id) {
          return res.status(400).json({ error: 'Missing customer ID' });
        }
    
        const preferences = await Preferences.findOne({ cust_id });
    
        if (!preferences) {
          return res.status(404).json({ error: 'Preferences not found for the customer' });
        }
    
        res.json(preferences);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  }
};


module.exports = CustomerController;
