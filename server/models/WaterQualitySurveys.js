const mongoose = require("mongoose");

const WaterQualitySurveySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  location: {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },

  measurements: {
    ph: { type: Number, required: true },
    turbidity: { type: Number, required: true },
    temperature: { type: Number, required: true },
    dissolvedOxygen: { type: Number, required: true },
  },

  photoProof: {
    url: { type: String },
    publicId: { type: String },
  },

  timestamps: {
    surveyorTime: { type: Date, required: true },
    serverReceivedTime: { type: Date, default: Date.now },
  },

  status: {
    type: String,
    enum: ["Pending Verification", "Verified", "Flagged for Resurvey"],
    default: "Pending Verification",
  },

  adminReview: {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    comments: { type: String },
    flaggedReasons: [{ type: String }],
  },

  autoChecks: {
    phValid: Boolean,
    temperatureValid: Boolean,
    turbidityValid: Boolean,
    dissolvedOxygenValid: Boolean,
    anomalyScore: Number,
  },
});

module.exports = mongoose.model("WaterQualitySurvey", WaterQualitySurveySchema);
