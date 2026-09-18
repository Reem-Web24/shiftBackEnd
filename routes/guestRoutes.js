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
// تنبيه: هذي المسارات المحددة (guests...) لازم تكون قبل
// مسار GET /:id العام تحت، وإلا إكسبرس بيفسّر كلمة "guests"
// كأنها معرّف مناسبة (id) ويصير خطأ 500.
// ==========================================

// جلب قائمة المدعوين — يدعم فلترة حسب المناسبة عبر ?eventId=...
router.get("/guests", async (req, res) => {
  try {
    const filter = {};

    if (req.query.eventId) {
      filter.eventId = req.query.eventId;
    }

    const guests = await Guest.find(filter);
    res.status(200).json({ success: true, count: guests.length, data: guests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// إضافة ضيف جديد (لازم يترسل eventId جوا body الطلب)
router.post("/guests", async (req, res) => {
  try {
    if (!req.body.eventId) {
      return res.status(400).json({
        success: false,
        message: "لازم تحدد eventId عند إضافة مدعو",
      });
    }

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
      success: true,
      message: "تم تسجيل الحضور بنجاح أهلاً بك!",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// حذف ضيف معيّن
router.delete("/guests/:id", async (req, res) => {
  try {
    const deletedGuest = await Guest.findByIdAndDelete(req.params.id);
    if (!deletedGuest) {
      return res
        .status(404)
        .json({ success: false, message: "الضيف غير موجود" });
    }
    res.status(200).json({ success: true, message: "تم حذف الضيف بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. جلب مناسبة واحدة بالـ ID
// تنبيه: هذا المسار العام لازم يكون آخر شي بالملف، بعد كل
// مسارات /guests المحددة، وإلا يبلعها ويسبب أخطاء.
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. تحديث إعدادات المناسبة (كرت الدعوة، رابط الموقع، رسالة الاعتذار)
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedEvent) {
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });
    }

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 4. حذف مناسبة كاملة (وكل مدعويها معها تلقائياً)
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });
    }

    // نحذف كل المدعوين المرتبطين بهذي المناسبة عشان ما تبقى بيانات يتيمة
    await Guest.deleteMany({ eventId: req.params.id });

    res.status(200).json({
      success: true,
      message: "تم حذف المناسبة وكل مدعويها بنجاح",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
