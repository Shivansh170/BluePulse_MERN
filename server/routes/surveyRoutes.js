const {
  createSurveyReport,
  getMysurveys,
  getSingleSurveyForSurveyor,
} = require("../controllers/surveyControllers");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const express = require("express");
const router = express.Router();

router.post("/createSurvey", auth, role("Surveyor"), createSurveyReport);
router.get("/getMysurveys", auth, role("Surveyor"), getMysurveys);
router.get("/my/:surveyId", auth, role("Surveyor"), getSingleSurveyForSurveyor);
module.exports = router;
