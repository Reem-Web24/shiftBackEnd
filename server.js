const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// إجبار Node على استخدام DNS جوجل (يحل مشاكل querySrv ECONNREFUSED
// اللي تصير أحياناً بسبب إعدادات شبكة/مضيف معينة)
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// يجب أن يكون الـ CORS في أول سطر للـ middleware قبل الـ routes
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 👇 رفعنا الحد الافتراضي (100kb) عشان يستوعب صور بطاقة الدعوة
// المحوّلة إلى Base64، واللي ممكن يوصل حجمها لعدة ميجابايت
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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
