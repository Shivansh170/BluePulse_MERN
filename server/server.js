const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/admin", adminRoutes);
const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log("Server started successfully!");
    });
  } catch (error) {
    console.log(error.message);
  }
};

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server connected successfully...",
  });
});

startServer();
