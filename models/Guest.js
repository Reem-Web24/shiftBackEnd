const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, default: "بدون اسم" },
    phone: { type: String, required: false, default: "0000000000" },
    title: { type: String }, // في حال كنتِ ترسلين اسم المناسبة
    date: { type: String }, // تاريخ المناسبة
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

module.exports = mongoose.model("Guest", guestSchema);
