const { predictWaterQuality } = require("../services/predictionService");

const predictWaterQualityController = async (req, res) => {
  try {
    const { history, current, location } = req.body;
    if (!history || !current || !location) {
      return res.status(400).json({
        success: false,
        message: "History, current and location are important fields",
      });
    }
    const predicted = await predictWaterQuality({ history, current, location });
    return res.status(200).json({
      success: true,
      data: predicted,
    });
  } catch (error) {
    console.log("Prediction controller error..", error.message);
    return res.status(400).json({
      success: false,
      message: `Failed in prediction controller due to ${error.message}`,
    });
  }
};

module.exports = { predictWaterQualityController };
