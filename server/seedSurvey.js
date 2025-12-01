const dotenv = require("dotenv");
const mongoose = require("mongoose");
const WaterQualitySurvey = require("./models/WaterQualitySurveys"); // adjust path if needed
dotenv.config();
// YOUR 3 SURVEYORS
const surveyors = [
  "692d7c6639248a00dc45df47", // AditiRatna
  "692d7c9039248a00dc45df4c", // raju
  "692d7db539248a00dc45df53", // shreyanshi
];

const waterBodies = [
  {
    name: "Yamuna River - Delhi",
    lat: 28.6448,
    lng: 77.216,
  },
  {
    name: "Ramganga River - Moradabad",
    lat: 28.8386,
    lng: 78.7733,
  },
  {
    name: "Chilika Lake - Odisha",
    lat: 19.65,
    lng: 85.46,
  },
  {
    name: "Pangong Lake - Ladakh",
    lat: 33.749,
    lng: 78.613,
  },
  {
    name: "Rithala Lake - Rohini",
    lat: 28.7195,
    lng: 77.1067,
  },
];

function getRandom(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function generateSurvey() {
  const location = waterBodies[Math.floor(Math.random() * waterBodies.length)];

  const ph = getRandom(6.5, 9);
  const turbidity = getRandom(2, 40);
  const temperature = getRandom(10, 40);
  const oxygen = getRandom(4, 12);

  const user = surveyors[Math.floor(Math.random() * surveyors.length)];

  return {
    user,
    location: {
      name: location.name,
      latitude: location.lat,
      longitude: location.lng,
    },
    measurements: {
      ph,
      turbidity,
      temperature,
      dissolvedOxygen: oxygen,
    },
    photoProof: {
      url: "https://dummyimage.com/600x400/00bcd4/ffffff&text=Survey",
      publicId: "",
    },
    timestamps: {
      surveyorTime: new Date(Date.now() - getRandom(1, 2000000000)),
      serverReceivedTime: new Date(),
    },
    status: "Verified",
    adminReview: {
      reviewedBy: surveyors[0], // mark Aditi as reviewer
      reviewedAt: new Date(),
      comments: "Auto-generated for testing",
      flaggedReasons: [],
    },
    autoChecks: {
      phValid: ph >= 6.5 && ph <= 9,
      temperatureValid: temperature <= 40,
      turbidityValid: turbidity <= 40,
      dissolvedOxygenValid: oxygen >= 4 && oxygen <= 12,
      anomalyScore: 0,
    },
  };
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("Clearing old surveys...");
    await WaterQualitySurvey.deleteMany({});

    console.log("Generating surveys...");
    const surveys = [];

    for (let i = 0; i < 30; i++) {
      surveys.push(generateSurvey());
    }

    await WaterQualitySurvey.insertMany(surveys);
    console.log("Inserted 30 survey records successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding surveys:", error);
    process.exit(1);
  }
}

seed();
