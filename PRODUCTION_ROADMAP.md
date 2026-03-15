# Islam101 — Complete Production Engineering Roadmap
### The Definitive Guide from Prototype to Production

This document contains **exact code snippets**, **command lines**, and **logic flows** needed to take Islam101 to a professional, scalable level. 

---

## 🟢 PHASE 1 — Infrastructure & Security (COMPLETED)
**Status:** Verified & Operational 🕋
- **Backend**: Express server running on Port 5000.
- **Database**: MongoDB Atlas connected via Mongoose.
- **Security**: JWT Auth established, Groq API proxied.
- **Philosophy**: "Unified Ummah" — Removed all madhab/sectarian legacy code.

---

## 🟡 PHASE 2 — Performance & Core Feature Completion (ACTIVE)
**Goal:** Fix prototype-level technical debt and implement real data persistence.

### Step 2.1 — Fixing the Scanner Memory Leak
**Location:** `src/pages/Scanner.jsx`
**Problem:** Every time you snap a photo, a `blob:` URL is created in the browser memory. If you snap 20 photos, your browser RAM usage spikes.
**The Fix:**
1.  **Modify `handleCapture`**:
    ```javascript
    const handleCapture = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // 1. Clean up old preview to free memory
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        
        // 2. Setup new state
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        // ... reset results
    };
    ```
2.  **Modify `handleReset`**:
    ```javascript
    const handleReset = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview); // CRITICAL
        setImage(null);
        setImagePreview(null);
        // ... clear other states
    };
    ```

### Step 2.2 — Transitioning from Hardcoded to Live Stats
**Goal:** Make the "Verses Read" and "Questions Asked" numbers on the Profile match reality.
**Instruction:**
1.  **Backend Controller (`src/controllers/userController.js`)**:
    Create a function to increment stats:
    ```javascript
    exports.incrementStat = async (req, res) => {
        const { statName } = req.body; // e.g., 'chatMessages'
        const user = await User.findById(req.user.id);
        user.stats[statName] += 1;
        await user.save();
        res.json({ success: true, stats: user.stats });
    };
    ```
2.  **Frontend Utility (`src/utils/api.js`)**:
    ```javascript
    recordAction: async (statName) => {
        return fetch(`${BASE_URL}/api/user/stat-inc`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ statName })
        }).then(r => r.json());
    }
    ```
3.  **Hujra Integration**: Call `api.recordAction('chatMessages')` every time the user sends a message.

### Step 2.3 — Geolocation-Based Prayer Times (COMPLETED)
**Location:** `src/pages/Scheduler.jsx`
**Instruction:** Replace manual text input with one-tap location detection.
**The Code:**
```javascript
const detectLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use a reverse geocoding API or AlAdhan's latitude/longitude endpoint
        const url = `http://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
        const res = await fetch(url);
        const data = await res.json();
        setPrayerTimes(data.data.timings);
    });
};
```

---

## 🔵 PHASE 3 — Progressive Web App (PWA) & Offline Mode (COMPLETED)
**Goal:** Allow users to "Install" Islam101 as an App and view prayer times offline.

### Step 3.1 — Vite PWA Setup (COMPLETED)
1.  **Install**: `npm install -D vite-plugin-pwa`
2.  **Configure `vite.config.js`**:
    ```javascript
    import { VitePWA } from 'vite-plugin-pwa'
    export default defineConfig({
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          manifest: {
            name: 'Islam101',
            short_name: 'Islam101',
            description: 'One Ummah, One App',
            theme_color: '#14b8a6',
            icons: [
              { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
              { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
            ]
          }
        })
      ]
    })
    ```

### Step 3.2 — Offline Prayer Times Cache (COMPLETED)
Modify `useScheduleStore.js` to persist data in `localStorage`.
- When an API call succeeds, save `data` and `timestamp`.
- On app load, if `timestamp` is within the same day, use the cached data instead of fetching.

---

## 🟣 PHASE 4 — Deployment & Launch
**Goal:** Deploy the new full-stack MERN architecture and update the existing Vercel deployment.

### Step 4.1 — Backend Deployment (Railway/Render)
Since the app now requires a dedicated Node.js/Express backend (and is no longer frontend-only/serverless), we need to host the server separately.
1.  Create a `Procfile` in `Islam101-server/`: `web: node server.js`
2.  Connect your GitHub repo to **Railway.app** or **Render.com**.
3.  Add your `.env` variables (`MONGODB_URI`, `JWT_SECRET`, `GROQ_API_KEY`) into the deployment Dashboard.
4.  Copy the generated URL (e.g., `https://islam101-api.up.railway.app`).

### Step 4.2 — Update Existing Frontend Deployment (Vercel)
*Note: The app is currently deployed on Vercel, but it is the old frontend-only serverless version.*
1.  Go to your existing **Islam101** project dashboard on **Vercel.com**.
2.  Add a new **Environment Variable**: `VITE_API_BASE_URL` and set its value to your new Backend URL (from Step 4.1).
3.  Push your latest GitHub commits to the `main` branch to trigger a fresh Vercel rebuild.
4.  Verify that authentication, the scanner stat-tracking, and the Hujra AI chat all successfully communicate with the new live API!

---

## 🔴 CRITICAL MAINTENANCE & PROTOCOLS
1.  **Version Control**: Always `git commit -m "feat: description"` before starting a new phase.
2.  **Database Backups**: Perform a `mongodump` weekly once in production.
3.  **Security Audits**: Run `npm audit` monthly to catch vulnerable packages.

---
*Created for Moid Sufiyan by Antigravity Assistant.*
*Date: March 14, 2026*
