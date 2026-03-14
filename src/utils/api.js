const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper: get the JWT token from localStorage
const getToken = () => localStorage.getItem('islam101_token');

// Helper: build headers with Authorization
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

// ── Auth API calls ────────────────────────────────────────────────────────────
export const authAPI = {
    register: async (name, email, password) => {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return res.json();
    },

    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    me: async () => {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: authHeaders()
        });
        return res.json();
    }
};

// ── Chat API call ─────────────────────────────────────────────────────────────
export const chatAPI = {
    // Returns a raw Response (for streaming SSE)
    sendMessage: async (messages, signal) => {
        const res = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ messages }),
            signal // AbortController signal for cancellation
        });
        return res;
    }
};

// ── Prayer API call ───────────────────────────────────────────────────────────
export const prayerAPI = {
    getTimes: async (city, country) => {
        const res = await fetch(
            `${BASE_URL}/api/prayer?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
            { headers: authHeaders() }
        );
        return res.json();
    }
};

// ── User API calls ────────────────────────────────────────────────────────────
export const userAPI = {
    getProfile: async () => {
        const res = await fetch(`${BASE_URL}/api/user/profile`, { headers: authHeaders() });
        return res.json();
    },
    updateProfile: async (data) => {
        const res = await fetch(`${BASE_URL}/api/user/profile`, {
            method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
        });
        return res.json();
    },
    addScheduleBlock: async (block) => {
        const res = await fetch(`${BASE_URL}/api/user/schedule`, {
            method: 'POST', headers: authHeaders(), body: JSON.stringify(block)
        });
        return res.json();
    },
    deleteScheduleBlock: async (blockId) => {
        const res = await fetch(`${BASE_URL}/api/user/schedule/${blockId}`, {
            method: 'DELETE', headers: authHeaders()
        });
        return res.json();
    },
    recordScan: async () => {
        const res = await fetch(`${BASE_URL}/api/user/scan-done`, {
            method: 'POST', headers: authHeaders()
        });
        return res.json();
    }
};
