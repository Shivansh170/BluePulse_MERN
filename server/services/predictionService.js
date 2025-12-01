const predictWaterQuality = async ({ history, current, location }) => {
  try {
    const prompt = `You are an expert water quality prediction AI.
    Analyze the following water data for the location: ${location}
    Historical readings:
    ${JSON.stringify(history)}
    Current reading:
    ${JSON.stringify(current)}
    Based on trends, predict the next water quality parameters.
    Return ONLY strict JSON in this format:
    {
      "predicted_ph": number,
      "predicted_turbidity": number,
      "predicted_temperature": number,
      "predicted_dissolvedOxygen": number,
      "risk_level": "low" | "moderate" | "high",
      "trend_summary": string,
      "7_day_forecast": [
        { "day": number, "ph": number, "turbidity": number, "temperature": number, "dissolvedOxygen": number }
      ]
    } you can also return the result if the current readings are not provided`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const result = await response.json();

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = text
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Prediction Service Error:", error);
    throw error;
  }
};

module.exports = { predictWaterQuality };
