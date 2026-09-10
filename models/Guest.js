const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    invitationCode: { type: String, unique: true },
    companions: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "قادمة", "مؤكد", "معتذر"],
      default: "pending",
    },
    invitationCard: { type: String },
    isScanned: { type: Boolean, default: false }, // للتاكد من استخدام الباركود مرة واحدة فقط
  },
  { timestamps: true },
);

module.exports = mongoose.model("Guest", guestSchema);
