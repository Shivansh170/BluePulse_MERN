const User = require("../models/User");
const WaterQualitySurvey = require("../models/WaterQualitySurveys");
const bcrypt = require("bcryptjs");
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: `${name} registered as ${role}.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const fetchAllSurveyors = async (req, res) => {
  try {
    const surveyors = await User.find({ role: "Surveyor" });
    return res.status(200).json({
      success: true,
      data: { surveyors },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getWaterBodiesStatus = async (req, res) => {
  try {
    const surveys = await WaterQualitySurvey.find();
    const waterBodyMap = {};

    for (let s of surveys) {
      if (
        !waterBodyMap[s.location] ||
        new Date(s.samplingDate) >
          new Date(waterBodyMap[s.location].samplingDate)
      ) {
        waterBodyMap[s.location] = s;
      }
    }

    const results = [];

    for (let location in waterBodyMap) {
      const survey = waterBodyMap[location];

      const { ph, turbidity, temperature, dissolvedOxygen } = survey;
      let score = 0;

      if (ph >= 6.5 && ph <= 8.5) score += 1;
      else if (ph >= 6.2 && ph <= 9.0) score += 0.5;

      if (turbidity <= 5) score += 1;
      else if (turbidity > 5 && turbidity <= 15) score += 0.5;

      if (temperature >= 20 && temperature <= 28) score += 1;
      else if (temperature >= 15 && temperature <= 34) score += 0.5;

      if (dissolvedOxygen >= 6) score += 1;
      else if (dissolvedOxygen >= 5) score += 0.5;

      let status = "";
      if (score === 4) status = "Good";
      else if (score === 3) status = "Moderate";
      else if (score === 2) status = "Poor";
      else status = "Critical";

      results.push({
        location,
        surveyId: survey._id,
        sampledAt: survey.samplingDate,
        score,
        status,
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchAllSurveys = async (req, res) => {
  try {
    const surveyorId = req.params.surveyorId;
    const surveys = await WaterQualitySurvey.find({ user: surveyorId });
    return res.status(200).json({
      success: true,
      surveys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchGlobally = async (req, res) => {
  try {
    const surveys = await WaterQualitySurvey.find()
      .populate("user", "name email role")
      .sort({ "timestamps.serverReceivedTime": -1 });

    return res.status(200).json({
      success: true,
      count: surveys.length,
      surveys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingSurveys = async (req, res) => {
  try {
    const pendingSurveys = await WaterQualitySurvey.find({
      status: "Pending Verification",
    })
      .populate("user", "name email role")
      .sort({ "timestamps.serverReceivedTime": -1 });

    return res.status(200).json({
      success: true,
      count: pendingSurveys.length,
      pendingSurveys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not fetch pending surveys",
    });
  }
};

const getSingleSurveyAdmin = async (req, res) => {
  try {
    const survey = await WaterQualitySurvey.findById(
      req.params.surveyId
    ).populate("user", "name email role");

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    return res.status(200).json({
      success: true,
      survey,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifySurvey = async (req, res) => {
  try {
    const survey = await WaterQualitySurvey.findById(req.params.surveyId);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    survey.status = "Verified";
    survey.adminReview = {
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      comments: req.body.comments || "Verified",
      flaggedReasons: [],
    };

    await survey.save();

    return res.status(200).json({
      success: true,
      message: "Survey verified successfully",
      survey,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const flagSurvey = async (req, res) => {
  try {
    const { reasons, comments } = req.body;
    const survey = await WaterQualitySurvey.findById(req.params.surveyId);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    survey.status = "Flagged for Resurvey";
    survey.adminReview = {
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      comments: comments || "Flagged for resurvey",
      flaggedReasons: reasons || [],
    };

    await survey.save();

    return res.status(200).json({
      success: true,
      message: "Survey flagged for resurvey",
      survey,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const adminStats = async (req, res) => {
  try {
    const total = await WaterQualitySurvey.countDocuments();
    const pending = await WaterQualitySurvey.countDocuments({
      status: "Pending Verification",
    });
    const verified = await WaterQualitySurvey.countDocuments({
      status: "Verified",
    });
    const flagged = await WaterQualitySurvey.countDocuments({
      status: "Flagged for Resurvey",
    });

    return res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        verified,
        flagged,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteSurveyor = async (req, res) => {
  try {
    const surveyorId = req.params.surveyorId;

    const surveyor = await User.findById(surveyorId);

    if (!surveyor) {
      return res.status(404).json({
        success: false,
        message: "Surveyor not found",
      });
    }

    if (surveyor.role !== "Surveyor") {
      return res.status(400).json({
        success: false,
        message: "User is not a surveyor",
      });
    }

    await WaterQualitySurvey.deleteMany({ user: surveyorId });

    await User.findByIdAndDelete(surveyorId);

    return res.status(200).json({
      success: true,
      message: "Surveyor and their surveys deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
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
};
