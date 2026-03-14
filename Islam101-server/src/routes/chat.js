const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

// Rate limit: max 30 chat requests per 15 minutes per user
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, message: 'Too many requests. Please wait 15 minutes.' },
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req)
});

// ── POST /api/chat ────────────────────────────────────────────────────────────
router.post('/', protect, chatLimiter, async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ success: false, message: 'Messages array is required.' });
        }

        // Forward request to Groq — API key stays on the server, NEVER sent to client
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages,
                temperature: 0.7,
                max_tokens: 1024,
                stream: true
            })
        });

        if (!groqResponse.ok) {
            const err = await groqResponse.json().catch(() => ({}));
            return res.status(groqResponse.status).json({
                success: false,
                message: err?.error?.message || 'AI service error'
            });
        }

        // Increment user's chat message count in the database
        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { 'stats.chatMessages': 1 }
        });

        // Stream the response directly to the client
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Pipe Groq's stream straight to the client
        const reader = groqResponse.body.getReader();
        const push = async () => {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    res.end();
                    break;
                }
                res.write(value);
            }
        };
        push().catch((err) => {
            console.error('Stream error:', err.message);
            res.end();
        });

    } catch (error) {
        console.error('Chat route error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Server error.' });
        }
    }
});

module.exports = router;
