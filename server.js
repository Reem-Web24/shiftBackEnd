const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// يجب أن يكون الـ CORS في أول سطر للـ middleware قبل الـ routes
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully..."))
  .catch((err) => console.error("Database connection error:", err.message));

app.get("/", (req, res) => {
  res.send("Your service is live 🚀");
});

// مسارات الضيوف والمناسبات
const guestRoutes = require("./routes/guestRoutes");
app.use("/api/events", guestRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
