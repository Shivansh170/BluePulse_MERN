const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const WaterQualitySurveys = require("../models/WaterQualitySurveys");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email.",
      });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Login successful",
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
    const surveys = await WaterQualitySurveys.aggregate([
      { $match: { status: "Verified" } },

      // Group by location.name
      {
        $group: {
          _id: "$location.name",
          latitude: { $first: "$location.latitude" },
          longitude: { $first: "$location.longitude" },

          avgPH: { $avg: "$measurements.ph" },
          avgTurbidity: { $avg: "$measurements.turbidity" },
          avgTemperature: { $avg: "$measurements.temperature" },
          avgDissolvedOxygen: { $avg: "$measurements.dissolvedOxygen" },

          totalSurveys: { $sum: 1 },
        },
      },

      // Clean the response structure
      {
        $project: {
          _id: 0,
          name: "$_id",
          latitude: 1,
          longitude: 1,
          avgPH: { $round: ["$avgPH", 2] },
          avgTurbidity: { $round: ["$avgTurbidity", 2] },
          avgTemperature: { $round: ["$avgTemperature", 2] },
          avgDissolvedOxygen: { $round: ["$avgDissolvedOxygen", 2] },
          totalSurveys: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      waterBodies: surveys,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const fetchSingleWaterBody = async (req, res) => {
  try {
    const waterBodyName = req.params.waterBodyName;

    const surveys = await WaterQualitySurveys.find({
      status: "Verified",
      "location.name": waterBodyName,
    });

    // If NOT surveyed
    if (surveys.length === 0) {
      return res.status(404).json({
        success: false,
        message: `${waterBodyName} has not been surveyed yet`,
      });
    }

    // Calculate averages
    const avgPH =
      surveys.reduce((a, b) => a + b.measurements.ph, 0) / surveys.length;
    const avgTurbidity =
      surveys.reduce((a, b) => a + b.measurements.turbidity, 0) /
      surveys.length;
    const avgTemperature =
      surveys.reduce((a, b) => a + b.measurements.temperature, 0) /
      surveys.length;
    const avgDO =
      surveys.reduce((a, b) => a + b.measurements.dissolvedOxygen, 0) /
      surveys.length;

    return res.status(200).json({
      success: true,
      waterBody: {
        name: waterBodyName,
        latitude: surveys[0].location.latitude,
        longitude: surveys[0].location.longitude,

        averages: {
          avgPH: Number(avgPH.toFixed(2)),
          avgTurbidity: Number(avgTurbidity.toFixed(2)),
          avgTemperature: Number(avgTemperature.toFixed(2)),
          avgDissolvedOxygen: Number(avgDO.toFixed(2)),
        },

        totalSurveys: surveys.length,
        surveyHistory: surveys,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const countNumberOfSurveys = async (req, res) => {
  try {
    const surveys = await WaterQualitySurveys.find();
    return res.status(200).json({
      success: true,
      count: surveys.length,
    });
  } catch (error) {
    console.log(
      "Error in counting numbe rof surveys in user Controller",
      error.message
    );
  }
};
const countNumberOfSurveyors = async (req, res) => {
  try {
    const surveyors = await User.find({ role: "Surveyor" });
    return res.status(200).json({
      success: true,
      count: surveyors.length,
    });
  } catch (error) {
    console.log(
      "Error occured in counting the number of the surveyors in the user Controller",
      error.message
    );
  }
};
module.exports = {
  userLogin,
  fetchAllSurveys,
  fetchSingleWaterBody,
  countNumberOfSurveys,
  countNumberOfSurveyors,
};
