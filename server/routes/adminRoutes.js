const {
  fetchAllSurveyors,
  fetchAllSurveys,
  fetchGlobally,
  getPendingSurveys,
  getSingleSurveyAdmin,
  verifySurvey,
  flagSurvey,
  adminStats,
  getWaterBodiesStatus,
  deleteSurveyor,
  registerUser,
} = require("../controllers/adminController");

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/fetch-all-surveyors", auth, role("Admin"), fetchAllSurveyors);
router.delete("/surveyor/:surveyorId", auth, role("Admin"), deleteSurveyor); // NEW
router.post("/createUser", auth, role("Admin"), registerUser);
router.get("/surveys", auth, role("Admin"), fetchGlobally);
router.get("/surveys/pending", auth, role("Admin"), getPendingSurveys);
router.get("/surveys/:surveyorId", auth, role("Admin"), fetchAllSurveys);
router.get("/survey/:surveyId", auth, role("Admin"), getSingleSurveyAdmin);
router.patch("/survey/:surveyId/verify", auth, role("Admin"), verifySurvey);
router.patch("/survey/:surveyId/flag", auth, role("Admin"), flagSurvey);

router.get("/stats", auth, role("Admin"), adminStats);
router.get("/water-bodies/status", auth, role("Admin"), getWaterBodiesStatus); // NEW

module.exports = router;
