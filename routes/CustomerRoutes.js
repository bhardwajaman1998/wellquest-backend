const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController");

router.get("/get_user_data", CustomerController.get_customer_data);

router.get("/get_weight_history", CustomerController.get_weight_history);
router.get("/get_milestone", CustomerController.get_milestone);

router.get(
  "/get_scheduled_appointments",
  CustomerController.get_scheduled_appointments
);
router.post("/schedule_appointment", CustomerController.schedule_appointment);
router.post("/cancel_appointment", CustomerController.cancel_appointment);

router.get("/get_coaches", CustomerController.get_coaches);
router.post("/select_coach", CustomerController.select_coach);
router.get("/get_selected_coach", CustomerController.get_selected_coach);

router.post("/make_meal_plan", CustomerController.make_meal_plan);
router.post("/log_meal", CustomerController.log_meal);
router.get("/get_meal_plan", CustomerController.get_meal_plan);
router.get("/get_today_meals", CustomerController.get_today_meals);
router.get("/get_calories_consumed", CustomerController.get_calories_consumed);
router.get("/get_history_meals", CustomerController.getLastThreeMeals);

router.post("/store_preferences", CustomerController.store_preferences);
router.get("/get_preferences", CustomerController.get_preferences); //new

module.exports = router;
