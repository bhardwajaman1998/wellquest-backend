const express = require("express");
const router = express.Router();

const CustomerController = require("../controllers/CustomerController");
const authenticateToken = require("../middleware/JwtValidate");

router.get("/get_user_data", authenticateToken, CustomerController.get_customer_data);

router.get("/get_weight_history", authenticateToken, CustomerController.get_weight_history);
router.get("/get_milestone", authenticateToken, CustomerController.get_milestone);

router.get(
  "/get_scheduled_appointments",
  authenticateToken,
  CustomerController.get_scheduled_appointments
);
router.post("/schedule_appointment", authenticateToken, CustomerController.schedule_appointment);
router.post("/cancel_appointment", authenticateToken,  CustomerController.cancel_appointment);

router.get("/get_coaches", authenticateToken, CustomerController.get_coaches);
router.post("/select_coach",authenticateToken,  CustomerController.select_coach);
router.get("/get_selected_coach",authenticateToken,  CustomerController.get_selected_coach);

router.post("/make_meal_plan",authenticateToken, CustomerController.make_meal_plan);
router.post("/log_meal", authenticateToken, CustomerController.log_meal);
router.get("/get_meal_plan",authenticateToken,  CustomerController.get_meal_plan);
router.get("/get_today_meals",authenticateToken,  CustomerController.get_today_meals);
router.get("/get_calories_consumed",authenticateToken, CustomerController.get_calories_consumed);
router.get("/get_history_meals", authenticateToken,CustomerController.getLastThreeMeals);

router.post("/store_preferences",authenticateToken, CustomerController.store_preferences);
router.get("/get_preferences", authenticateToken, CustomerController.get_preferences); //new

module.exports = router;
