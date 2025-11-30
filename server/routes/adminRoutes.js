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
router.get("/fetch-all-surveyors", auth, role("Admin"), fetchAllSurveyors);
router.get("/surveys", auth, role("Admin"), fetchGlobally);
router.get("/surveys/pending", auth, role("Admin"), getPendingSurveys);
router.get("/survey/:surveyId", auth, role("Admin"), getSingleSurveyAdmin);
router.patch("/survey/:surveyId/verify", auth, role("Admin"), verifySurvey);
router.patch("/survey/:surveyId/flag", auth, role("Admin"), flagSurvey);
router.get("/stats", auth, role("Admin"), adminStats);
router.get("/surveys/:surveyorId", auth, role("Admin"), fetchAllSurveys);

module.exports = router;
