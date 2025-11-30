const { GoogleGenerativeAI } = require("@google/generative-ai"); //bring in the google-generative-ai class in the app.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); //create the object of the GoogleGenerativeAI class

//function to call the specific model of gemini for our process
const getGeminiModel = (modelName = "models/gemini-2.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = { getGeminiModel };
