require("dotenv").config();

(async () => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );

    const data = await response.json();

    console.log("Available models:\n");
    data.models.forEach((m) => console.log("• " + m.name));
  } catch (err) {
    console.error("Error:", err);
  }
})();
