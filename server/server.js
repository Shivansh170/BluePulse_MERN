const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/user", userRoutes);
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
