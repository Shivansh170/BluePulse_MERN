const express = require("express");
const router = express.Router();
const {
  predictWaterQualityController,
} = require("../controllers/predictionController");
router.post("/predict-water-quality", predictWaterQualityController);

module.exports = router;
