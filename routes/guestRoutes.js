const express = require("express");
const router = express.Router();
const Guest = require("../models/Guest");

// 1. إضافة ضيف جديد
router.post("/", async (req, res) => {
  try {
    const newGuest = new Guest(req.body);
    await newGuest.save();
    res.status(201).json({ success: true, data: newGuest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 2. جلب بيانات ضيف معين
router.get("/:id", async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest)
      return res
        .status(404)
        .json({ success: false, message: "الضيف غير موجود" });
    res.json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. تحديث حالة الحضور
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json({ success: true, data: updatedGuest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// مسح الباركود عند حضور الضيف للقاعة (يستخدم مرة واحدة فقط)
router.post("/scan/:id", async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest)
      return res
        .status(404)
        .json({ success: false, message: "الضيف غير موجود" });

    if (guest.isScanned) {
      return res.status(400).json({
        success: false,
        message:
          "عذراً، تم استخدام هذا الباركود مسبقاً ولا يمكن استخدامه مرة أخرى!",
      });
    }

    guest.isScanned = true;
    guest.status = "confirmed";
    await guest.save();

    res.json({
      success: true,
      message: "تم تسجيل الحضور بنجاح أهلاً بك!",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
