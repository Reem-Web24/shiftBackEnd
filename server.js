const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");

const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/guests", require("./routes/guestRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
