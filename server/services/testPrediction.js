require("dotenv").config();
const { predictWaterQuality } = require("./predictionService");

(async () => {
  const history = [
    {
      ph: 7.1,
      turbidity: 3.2,
      temperature: 28,
      dissolvedOxygen: 6.2,
      timestamp: new Date(),
    },
    {
      ph: 7.0,
      turbidity: 3.8,
      temperature: 29,
      dissolvedOxygen: 6.1,
      timestamp: new Date(),
    },
  ];

  const current = {
    ph: 6.9,
    turbidity: 4.1,
    temperature: 30,
    dissolvedOxygen: 5.9,
    timestamp: new Date(),
  };

  const response = await predictWaterQuality({
    history,
    current,
    location: "Test Lake",
  });

  console.log("Gemini Response:", response);
})();
