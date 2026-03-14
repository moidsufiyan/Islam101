const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// ── GET /api/user/profile ────────────────────────────────────────────────────
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── PUT /api/user/profile ─────────────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, madhab, city, country } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, madhab, city, country },
            { new: true, runValidators: true }
        );
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── POST /api/user/schedule ───────────────────────────────────────────────────
router.post('/schedule', protect, async (req, res) => {
    try {
        const { name, start, end } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { scheduleBlocks: { name, start, end } } },
            { new: true }
        );
        res.json({ success: true, scheduleBlocks: user.scheduleBlocks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── DELETE /api/user/schedule/:blockId ────────────────────────────────────────
router.delete('/schedule/:blockId', protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { scheduleBlocks: { _id: req.params.blockId } } },
            { new: true }
        );
        res.json({ success: true, scheduleBlocks: user.scheduleBlocks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── POST /api/user/scan-done ──────────────────────────────────────────────────
router.post('/scan-done', protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $inc: { 'stats.scansDone': 1 } },
            { new: true }
        );
        res.json({ success: true, stats: user.stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
