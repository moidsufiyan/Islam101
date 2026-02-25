# 🕌 Islam101

**Your personal Islamic utility ecosystem for spiritual growth.**

A premium, dark-themed Progressive Web App built with React, featuring smart Islamic guidance, real-time prayer scheduling, OCR ingredient scanning, and madhab-filtered rulings.

---

## ✨ Features

### 🏠 Home Dashboard
- Dynamic greeting with time-of-day awareness
- Next Prayer card with real Aladhan API data
- **State of Heart** — 5 emotional states with Arabic duas and Quranic remedies
- **Verse of the Day** with Arabic calligraphy (Amiri font)
- Quick access to Solutions page

### 🕐 Smart Namaz Scheduler
- **Real prayer times** fetched from the [Aladhan API](https://aladhan.com/prayer-times-api)
- Manual timetable entry for classes/work schedule
- **Smart conflict detection** — finds optimal prayer windows around your busy schedule
- Suggestions like: *"Free window before your Physics Lecture at 1:00 PM. Good time for Dhuhr!"*

### 📖 Solutions by Belief
- **15 Islamic rulings** across Prayer, Fasting, Food, Daily Life, and Spirituality
- **Auto-filtered by madhab** — only shows answers matching your selected school of thought
- Full-text search with category filter pills
- Expandable cards with Short Answer → Evidence (Quran/Hadith) → Explanation

### 📸 Halal/Haram Lens (OCR Scanner)
- Camera capture via HTML5 `<input capture="environment">`
- **Tesseract.js** client-side OCR — works offline after initial load
- **45-item haram ingredient database** (E-numbers like E120, E441 + named ingredients)
- Confidence bar with flagged/safe ingredient breakdown
- Extracted text preview for manual verification

### 💬 Digital Hujra (Guided Chat)
- Multi-turn conversational interface with Islamic knowledge
- 3 rotating response templates with Quran/Hadith citations
- Tone toggle (Motherly / Brother's voice)
- Copy-to-clipboard, typing indicator, auto-scroll

### 👤 Profile
- Avatar with verified badge
- Stats grid (Verses Read, Days Active, Questions Asked, Scans Done)
- Notification toggle with spring animation
- Dark mode indicator
- Reset onboarding option

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Styling with custom dark theme |
| **Framer Motion** | Animations & page transitions |
| **Zustand** | State management with localStorage persistence |
| **React Router v7** | Client-side routing |
| **Tesseract.js** | Client-side OCR engine |
| **Lucide React** | Icon system |
| **Aladhan API** | Real-time prayer times |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** 9+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Islam101

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist/` folder.

---

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Vite and deploys — no config needed

### Netlify
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → New Site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`

### Manual / Any Static Host
1. Run `npm run build`
2. Upload the `dist/` folder to any static hosting (GitHub Pages, Firebase Hosting, etc.)
3. Make sure your server redirects all routes to `index.html` (SPA routing)

---

## 📁 Project Structure

```
Islam101/
├── public/
│   └── manifest.json            # PWA manifest
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx        # 5-tab glass navigation
│   │   ├── ErrorBoundary.jsx    # Error recovery screen
│   │   └── Onboarding.jsx      # 2-step welcome flow
│   ├── data/
│   │   ├── haramIngredients.js  # Haram ingredient database
│   │   └── solutions.js        # Madhab-tagged rulings
│   ├── pages/
│   │   ├── Home.jsx             # Dashboard
│   │   ├── Hujra.jsx            # Guided chat
│   │   ├── Profile.jsx          # User settings
│   │   ├── Scanner.jsx          # OCR scanner
│   │   ├── Scheduler.jsx        # Namaz scheduler
│   │   └── Solutions.jsx        # Belief-filtered rulings
│   ├── store/
│   │   ├── useMadhabStore.js    # User preferences (persisted)
│   │   └── useScheduleStore.js  # Prayer times & schedule (persisted)
│   ├── App.jsx                  # Root with routing
│   ├── index.css                # Theme & custom utilities
│   └── main.jsx                 # Entry point with ErrorBoundary
├── index.html                   # HTML shell with SEO & PWA meta
├── package.json
└── vite.config.js
```

---

## 📋 API Reference

| API | Endpoint | Auth | Usage |
|-----|----------|------|-------|
| Aladhan | `api.aladhan.com/v1/timingsByCity` | None (free) | Prayer times by city |

---

## 📄 License

MIT — Built with ❤️ for the Ummah.
