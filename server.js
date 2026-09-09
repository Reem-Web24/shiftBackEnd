const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");

const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// حزم وتعديلات الأمان (Security Middleware)
app.use(helmet());

// تقييد عدد الطلبات لمنع هجمات التخمين والضغط (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // أقصى عدد طلبات لكل IP خلال 15 دقيقة
});
app.use(limiter);

// تفعيل الـ CORS والـ JSON Middleware
app.use(cors());
app.use(express.json());

// Routes (تم تعديل المسار هنا ليطابق /api/events)
app.use("/api/events", require("./routes/guestRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
