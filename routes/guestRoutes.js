const express = require("express");
const router = express.Router();
const { Guest, Event } = require("../models/Guest"); // استدعاء المودلين معاً

// ==========================================
// مسارات المناسبات (Events)
// ==========================================

// 0. جلب قائمة كل المناسبات
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 1. إضافة مناسبة جديدة
router.post("/", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// مسارات الضيوف (Guests)
// ==========================================

// جلب قائمة كل المدعوين
router.get("/guests", async (req, res) => {
  try {
    const guests = await Guest.find();
    res.status(200).json({ success: true, count: guests.length, data: guests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// إضافة ضيف جديد
router.post("/guests", async (req, res) => {
  try {
    const newGuest = new Guest(req.body);
    await newGuest.save();
    res.status(201).json({ success: true, data: newGuest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// جلب بيانات ضيف معين
router.get("/guests/:id", async (req, res) => {
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

// تحديث حالة الحضور للضيف
router.put("/guests/:id/status", async (req, res) => {
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

// مسح الباركود عند حضور الضيف للقاعة
router.post("/guests/scan/:id", async (req, res) => {
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
      success: true, // تم تصحيحها هنا
      message: "تم تسجيل الحضور بنجاح أهلاً بك!",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
