# LoyaltyOS — Store Loyalty Admin System

A beautiful, fully frontend loyalty management system for general stores.

## 🚀 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Framework: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

> No backend, no database, no environment variables needed.

## 🛠 Local Development

```bash
npm install
npm run dev
```

## ✨ Features

- **Dashboard** — Stats overview, recent activity, top customers, reward-eligible panel
- **Customers** — Live search, filter chips, card grid with points progress bars
- **Add Service** — 8 preset services or custom name/price with real-time points preview
- **Auto-create** — If no customer found, prompt to create one in-flow
- **Reward alerts** — Gold glow + crown badge for customers at 100+ points
- **Service history** — Full timestamped log per customer
- **Manual adjust** — Add or deduct points with required note
- **Edit customer** — Update name or phone inline
- **Redeem rewards** — One-click reward redemption deducting 100 pts
- **Services page** — View all 8 preset services with emoji and points rates
- **Rewards page** — Dedicated view of all eligible customers

## 🎨 Tech Stack

- React 18 + Vite
- Pure CSS (no UI libraries)
- Lucide icons
- 100% client-side state (localStorage not required)
- Google Fonts: Syne + DM Sans

## 📁 Structure

```
src/
  App.jsx       # Full app — all components in one file
  index.css     # Complete design system
  main.jsx      # React entry point
index.html      # HTML shell with font imports
vercel.json     # SPA routing config (prevents 404)
vite.config.js  # Vite config
```
