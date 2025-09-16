require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Routes
const mentorRoutes = require("./routes/mentors");
const studentRoutes = require("./routes/students");

const app = express();


app.use(express.json());

app.use("/api/mentors", mentorRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Mentor–Student API running 🚀" });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Mongo connection error:", err.message);
    process.exit(1);
  });
