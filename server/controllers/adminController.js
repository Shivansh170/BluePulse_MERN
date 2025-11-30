const User = require("../models/User");
const WaterQualitySurvey = require("../models/WaterQualitySurveys");

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

module.exports = {
  fetchAllSurveyors,
  fetchAllSurveys,
  fetchGlobally,
  getPendingSurveys,
  getSingleSurveyAdmin,
  verifySurvey,
  flagSurvey,
  adminStats,
};
