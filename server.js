const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 1. تفعيل الـ CORS بجميع الصلاحيات للربط مع Vercel
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// 2. الاتصال بقاعدة البيانات MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully...");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

// 3. مسار تجريبي للتأكد أن السيرفر يعمل
app.get("/", (req, res) => {
  res.send("Your service is live 🚀");
});

// 4. ربط مسارات المناسبات والضيوف بشكل صحيح تماماً
const guestRoutes = require("./routes/guestRoutes");
app.use("/api/events", guestRoutes);

// 5. تشغيل السيرفر
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
