const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// تفعيل الCORS لسحب الطلبات من Vercel بدون مشاكل
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// الاتصال بقاعدة البيانات
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully...");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

// مسار تجريبي للتأكد من عمل السيرفر
app.get("/", (req, res) => {
  res.send("Your service is live 🚀");
});

// ربط مسارات الضيوف والمناسبات
const guestRoutes = require("./routes/guestRoutes");
app.use("/api/events", guestRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
