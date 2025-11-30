const WaterQualitySurvey = require("../models/WaterQualitySurveys");

function validateSurvey(measurements) {
  const issues = [];

  const { ph, turbidity, temperature, dissolvedOxygen } = measurements;

  const autoChecks = {
    phValid: ph >= 0 && ph <= 14,
    temperatureValid: temperature >= 0 && temperature <= 60,
    turbidityValid: turbidity >= 0,
    dissolvedOxygenValid: dissolvedOxygen >= 0 && dissolvedOxygen <= 14,
  };

  if (!autoChecks.phValid) issues.push("Invalid pH range");
  if (!autoChecks.temperatureValid) issues.push("Temperature out of range");
  if (!autoChecks.turbidityValid) issues.push("Turbidity cannot be negative");
  if (!autoChecks.dissolvedOxygenValid)
    issues.push("DO value is not realistic");

  autoChecks.anomalyScore = issues.length;

  return autoChecks;
}

const createSurveyReport = async (req, res) => {
  try {
    const { location, measurements, surveyorTime, photoProof } = req.body;
    const autoChecks = validateSurvey(measurements);
    const newSurvey = new WaterQualitySurvey({
      user: req.user.id,
      location,
      measurements,
      photoProof,
      timestamps: {
        surveyorTime,
      },
      status: "Pending Verification",
      autoChecks,
    });
    await newSurvey.save();

    res.status(201).json({
      success: true,
      message: "Survey report submitted successfully!",
      survey: newSurvey,
    });
  } catch (error) {
    console.error("Survey creation error: ", error);
    res.status(500).json({
      success: false,
      error: "Could not create survey report",
    });
  }
};

const getMysurveys = async (req, res) => {
  try {
    const surveyorId = req.user.id;
    const surveys = await WaterQualitySurvey.find({ user: surveyorId }).sort({
      "timestamps.serverReceivedTime": -1,
    });

    return res.status(200).json({
      success: true,
      count: surveys.length,
      surveys,
    });
  } catch (error) {
    console.error("getMySurveys error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch surveys",
    });
  }
};

const getSingleSurveyForSurveyor = async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const userId = req.user.id;
    const survey = await WaterQualitySurvey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }
    if (survey.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this survey",
      });
    }

    return res.status(200).json({
      success: true,
      survey,
    });
  } catch (error) {
    console.error("getSingleSurveyForSurveyor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching survey details",
    });
  }
};
module.exports = {
  createSurveyReport,
  getMysurveys,
  getSingleSurveyForSurveyor,
};
