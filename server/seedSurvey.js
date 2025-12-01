const dotenv = require("dotenv");
const mongoose = require("mongoose");
const WaterQualitySurvey = require("./models/WaterQualitySurveys");
dotenv.config();

// SURVEYORS
const surveyors = [
  "692d7c6639248a00dc45df47",
  "692d7c9039248a00dc45df4c",
  "692d7db539248a00dc45df53",
];

// MASSIVE LIST OF WATER BODIES ACROSS INDIA
// scale = large / medium / small
const waterBodies = [
  // 🌊 LARGE (Priority Rivers & Lakes - Heavy Data)
  {
    name: "Ganga River - Varanasi",
    lat: 25.3176,
    lng: 82.9739,
    scale: "large",
  },
  {
    name: "Ganga River - Haridwar",
    lat: 29.9457,
    lng: 78.1642,
    scale: "large",
  },
  { name: "Ganga River - Patna", lat: 25.6154, lng: 85.101, scale: "large" },
  { name: "Yamuna River - Delhi", lat: 28.6448, lng: 77.216, scale: "large" },
  { name: "Yamuna River - Agra", lat: 27.1767, lng: 78.0081, scale: "large" },
  {
    name: "Brahmaputra River - Guwahati",
    lat: 26.1445,
    lng: 91.7362,
    scale: "large",
  },
  {
    name: "Godavari River - Nashik",
    lat: 19.9975,
    lng: 73.7898,
    scale: "large",
  },
  {
    name: "Narmada River - Jabalpur",
    lat: 23.1815,
    lng: 79.9864,
    scale: "large",
  },
  {
    name: "Krishna River - Vijayawada",
    lat: 16.5062,
    lng: 80.648,
    scale: "large",
  },
  { name: "Kaveri River - Mysuru", lat: 12.2958, lng: 76.6394, scale: "large" },
  {
    name: "Hooghly River - Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    scale: "large",
  },
  { name: "Chilika Lake - Odisha", lat: 19.65, lng: 85.46, scale: "large" },
  { name: "Vembanad Lake - Kerala", lat: 9.55, lng: 76.37, scale: "large" },
  { name: "Pangong Lake - Ladakh", lat: 33.749, lng: 78.613, scale: "large" },
  { name: "Dal Lake - Srinagar", lat: 34.117, lng: 74.856, scale: "large" },
  {
    name: "Sardar Sarovar Dam Reservoir",
    lat: 21.8257,
    lng: 73.7451,
    scale: "large",
  },
  {
    name: "Tehri Lake - Uttarakhand",
    lat: 30.3752,
    lng: 78.48,
    scale: "large",
  },
  {
    name: "Hirakud Reservoir - Odisha",
    lat: 21.5167,
    lng: 83.8667,
    scale: "large",
  },

  // 🏞️ MEDIUM (Rivers, Reservoirs, Dams, Lakes)
  { name: "Beas River - Himachal", lat: 31.633, lng: 77.0, scale: "medium" },
  { name: "Ravi River - Punjab", lat: 31.634, lng: 75.482, scale: "medium" },
  { name: "Chenab River - J&K", lat: 32.55, lng: 75.12, scale: "medium" },
  {
    name: "Mahanadi River - Cuttack",
    lat: 20.4625,
    lng: 85.883,
    scale: "medium",
  },
  { name: "Tapti River - Surat", lat: 21.1702, lng: 72.8311, scale: "medium" },
  {
    name: "Sabarmati River - Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    scale: "medium",
  },
  {
    name: "Gomti River - Lucknow",
    lat: 26.8467,
    lng: 80.9462,
    scale: "medium",
  },
  {
    name: "Musi River - Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    scale: "medium",
  },
  {
    name: "Tungabhadra River - Karnataka",
    lat: 15.335,
    lng: 76.46,
    scale: "medium",
  },
  {
    name: "Sutlej River - Punjab",
    lat: 31.1048,
    lng: 77.1734,
    scale: "medium",
  },
  {
    name: "Indrayani River - Pune",
    lat: 18.5204,
    lng: 73.8567,
    scale: "medium",
  },
  { name: "Pichola Lake - Udaipur", lat: 24.576, lng: 73.682, scale: "medium" },
  { name: "Upper Lake - Bhopal", lat: 23.25, lng: 77.4, scale: "medium" },
  {
    name: "Hussain Sagar Lake - Hyderabad",
    lat: 17.4239,
    lng: 78.4738,
    scale: "medium",
  },
  {
    name: "Sukhna Lake - Chandigarh",
    lat: 30.7421,
    lng: 76.8188,
    scale: "medium",
  },
  {
    name: "Ramganga River - Moradabad",
    lat: 28.8386,
    lng: 78.7733,
    scale: "medium",
  },
  {
    name: "Rithala Lake - Rohini",
    lat: 28.7195,
    lng: 77.1067,
    scale: "medium",
  },
  { name: "Loktak Lake - Manipur", lat: 24.5733, lng: 93.842, scale: "medium" },
  { name: "Wular Lake - Kashmir", lat: 34.3181, lng: 74.5619, scale: "medium" },

  // 🏺 SMALL (Urban lakes, ponds, wetlands)
  { name: "Nakki Lake - Mount Abu", lat: 24.5925, lng: 72.708, scale: "small" },
  {
    name: "Banjara Lake - Hyderabad",
    lat: 17.4156,
    lng: 78.4345,
    scale: "small",
  },
  {
    name: "Santragachi Lake - Howrah",
    lat: 22.5946,
    lng: 88.2636,
    scale: "small",
  },
  { name: "Khanpur Lake - Ahmedabad", lat: 23.03, lng: 72.58, scale: "small" },
  { name: "Periyar Lake - Kerala", lat: 9.533, lng: 77.133, scale: "small" },
  { name: "Ooty Lake - Tamil Nadu", lat: 11.41, lng: 76.69, scale: "small" },
  {
    name: "Kodaikanal Lake - Tamil Nadu",
    lat: 10.2381,
    lng: 77.4892,
    scale: "small",
  },
  {
    name: "Rankala Lake - Kolhapur",
    lat: 16.7049,
    lng: 74.2341,
    scale: "small",
  },
  { name: "Shivpuri Lake - MP", lat: 25.4, lng: 77.65, scale: "small" },
  { name: "Bhalswa Lake - Delhi", lat: 28.75, lng: 77.17, scale: "small" },
  {
    name: "Najafgarh Lake - Delhi Border",
    lat: 28.52,
    lng: 76.9,
    scale: "small",
  },
];

// SURVEY DISTRIBUTION BASED ON SIZE
function getSurveyCount(scale) {
  if (scale === "large") return Math.floor(Math.random() * 60 + 60); // 60–120
  if (scale === "medium") return Math.floor(Math.random() * 30 + 25); // 25–55
  return Math.floor(Math.random() * 15 + 5); // 5–20
}

function getRandom(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// GENERATE SINGLE SURVEY
function generateSurvey(location) {
  const ph = getRandom(6.5, 9);
  const turbidity = getRandom(1, 60);
  const temperature = getRandom(5, 40);
  const oxygen = getRandom(3, 12);

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
      url: "https://dummyimage.com/600x400/00838f/ffffff&text=Survey",
      publicId: "",
    },
    timestamps: {
      surveyorTime: new Date(Date.now() - getRandom(1e7, 2e9)),
      serverReceivedTime: new Date(),
    },
    status: "Verified",
    adminReview: {
      reviewedBy: surveyors[0],
      reviewedAt: new Date(),
      comments: "Auto-generated dataset",
      flaggedReasons: [],
    },
    autoChecks: {
      phValid: ph >= 6.5 && ph <= 9,
      temperatureValid: temperature <= 40,
      turbidityValid: turbidity <= 60,
      dissolvedOxygenValid: oxygen >= 4 && oxygen <= 12,
      anomalyScore: 0,
    },
  };
}

// MAIN SEED FUNCTION
async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("Clearing existing surveys...");
    await WaterQualitySurvey.deleteMany({});

    let surveys = [];

    for (let body of waterBodies) {
      const count = getSurveyCount(body.scale);
      console.log(`→ ${body.name}: ${count} surveys`);

      for (let i = 0; i < count; i++) {
        surveys.push(generateSurvey(body));
      }
    }

    console.log(`\nTotal generated surveys: ${surveys.length}`);

    await WaterQualitySurvey.insertMany(surveys);

    console.log(
      "🎉 Database successfully seeded with realistic 2000+ surveys!"
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
