# 🎅 Track Santa

A festive React application that lets you track Santa's magical journey around the world on Christmas Eve!

## Features

- **Live Countdown**: Before December 24th, see a countdown timer to Santa's departure
- **Real-time Tracking**: On December 24th, track Santa's location in real-time
- **Interactive Map**: Visual representation of Santa's route with visited and upcoming cities
- **Statistics**: See presents delivered, cities visited, and journey progress
- **Beautiful UI**: Festive Christmas theme with falling snowflakes

## How It Works

### Santa's Journey Algorithm

Santa's journey follows a realistic route around the world:

1. **Departure**: Santa leaves the North Pole at midnight (UTC+12) on December 24th
2. **Route**: He travels west, following the night across:
   - Far East Russia → Oceania → Asia → Middle East → Europe → Africa → Americas
3. **Duration**: The complete journey takes 24 hours
4. **Return**: Santa arrives back at the North Pole at midnight (UTC-12) on December 25th

The algorithm calculates Santa's position based on the current time, interpolating between major cities along the route.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18
- Vite
- Pure CSS (no frameworks)

## Screenshots

The app shows different views based on the date:
- **Before Dec 24**: Countdown timer to Santa's departure
- **Dec 24-25**: Live tracking map and statistics
- **After journey**: Completion celebration screen

---

🎄 Made with ❤️ for Christmas 🎄


