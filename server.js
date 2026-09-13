const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// إعدادات الـ CORS والسماح بالاتصال من أي Frontend (مثل Vercel)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// الاتصال بقاعدة البيانات MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully...");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

// مسار تجريبي للتأكد أن السيرفر يعمل
app.get("/", (req, res) => {
  res.send("Your service is live 🚀");
});

// استيراد مسارات الـ Events أو المناسبات (تأكدبي من مسار الـ routes عندك)
// const eventRoutes = require('./routes/eventRoutes');
// app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
