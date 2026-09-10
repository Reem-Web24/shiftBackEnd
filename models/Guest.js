const mongoose = require("mongoose");

// جدول الضيوف
const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, default: "بدون اسم" },
    phone: { type: String, required: false, default: "0000000000" },
    title: { type: String },
    date: { type: String },
    invitationCode: { type: String, unique: true, sparse: true },
    companions: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "قادمة", "مؤكد", "معتذر"],
      default: "قادمة",
    },
    invitationCard: { type: String },
    isScanned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// جدول المناسبات الجديد
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // اسم المناسبة
    date: { type: String, required: true }, // تاريخ المناسبة
    status: { type: String, default: "قادمة" },
  },
  { timestamps: true },
);

// تصدير المودلين معاً لضمان عدم حدوث أي خطأ في مسارات السيرفر
const Guest = mongoose.model("Guest", guestSchema);
const Event = mongoose.model("Event", eventSchema);

module.exports = { Guest, Event };
