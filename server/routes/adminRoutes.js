const {
  fetchAllSurveyors,
  fetchAllSurveys,
  fetchGlobally,
  getPendingSurveys,
  getSingleSurveyAdmin,
  verifySurvey,
  flagSurvey,
  adminStats,
} = require("../controllers/adminController");

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// Get all surveyors
router.get("/fetch-all-surveyors", auth, role("Admin"), fetchAllSurveyors);

// Global surveys
router.get("/surveys", auth, role("Admin"), fetchGlobally);

// Pending surveys
router.get("/surveys/pending", auth, role("Admin"), getPendingSurveys);

// Single survey (admin)
router.get("/survey/:surveyId", auth, role("Admin"), getSingleSurveyAdmin);

// Verify survey
router.patch("/survey/:surveyId/verify", auth, role("Admin"), verifySurvey);

// Flag survey
router.patch("/survey/:surveyId/flag", auth, role("Admin"), flagSurvey);

// Dashboard stats
router.get("/stats", auth, role("Admin"), adminStats);

// Surveys by surveyor (keep last because it's dynamic)
router.get("/surveys/:surveyorId", auth, role("Admin"), fetchAllSurveys);

module.exports = router;
