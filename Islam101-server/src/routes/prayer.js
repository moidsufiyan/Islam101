const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Simple in-memory cache for prayer times (stays valid for 24 hours)
const prayerCache = new Map();

// ── GET /api/prayer?city=Hyderabad&country=India ─────────────────────────────
router.get('/', protect, async (req, res) => {
    try {
        const { city, country } = req.query;

        if (!city || !country) {
            return res.status(400).json({ success: false, message: 'City and country are required.' });
        }

        // Cache key = "city:country:date"
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `${city.toLowerCase()}:${country.toLowerCase()}:${today}`;

        // Return cached data if available
        if (prayerCache.has(cacheKey)) {
            return res.json({ success: true, timings: prayerCache.get(cacheKey), cached: true });
        }

        // Fetch from AlAdhan
        const response = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`
        );
        const data = await response.json();

        if (data.code !== 200) {
            return res.status(400).json({ success: false, message: 'Could not find prayer times for this location.' });
        }

        const timings = {
            Fajr: data.data.timings.Fajr,
            Dhuhr: data.data.timings.Dhuhr,
            Asr: data.data.timings.Asr,
            Maghrib: data.data.timings.Maghrib,
            Isha: data.data.timings.Isha,
            Sunrise: data.data.timings.Sunrise,
        };

        // Store in cache (expires after 25 hours)
        prayerCache.set(cacheKey, timings);
        setTimeout(() => prayerCache.delete(cacheKey), 25 * 60 * 60 * 1000);

        res.json({ success: true, timings, cached: false });

    } catch (error) {
        console.error('Prayer route error:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
