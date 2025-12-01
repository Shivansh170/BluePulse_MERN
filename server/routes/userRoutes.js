const {
  userLogin,
  fetchAllSurveys,
  fetchSingleWaterBody,
  countNumberOfSurveys,
  countNumberOfSurveyors,
} = require("../controllers/userController");

const express = require("express");
const router = express.Router();

router.post("/loginUser", userLogin);
router.get("/results", fetchAllSurveys);
router.get("/results/:waterBodyName", fetchSingleWaterBody);
router.get("/total-surveys", countNumberOfSurveys);
router.get("/total-surveyors", countNumberOfSurveyors);
module.exports = router;
