# UPSC Chrono-Master

A static, offline-first web application for UPSC exam time-discipline practice.

## Features

### Prelims Mode
- Practice MCQ timing with lap tracking
- GS Paper I and CSAT Paper II support
- Configurable questions count and time limit
- Visual heatmap showing time per question
- OMR buffer calculation
- Performance insights

### Mains Mode
- 10 Marks (7 min), 15 Marks (12 min), and Essay (custom) modes
- Visual milestone phases (Outline → Write → Conclude)
- Audio cues on phase transitions
- Overrun/underrun tracking

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- requestAnimationFrame + performance.now() for accurate timers

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (static export)
npm run build

# Serve the static build locally
npx serve out
```

## Deployment

This app is configured for static export and can be deployed to:
- Vercel (zero configuration)
- Netlify
- GitHub Pages
- Any static hosting

The `out/` directory contains the complete static build.

## Design Principles

- Dark theme with zen, distraction-free UI
- Mobile-first responsive layout
- One primary action per screen
- Exam-hall seriousness
- No gamification or edtech fluff

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Name entry
│   ├── mode/              # Mode selection
│   ├── prelims/           # Prelims flow
│   │   ├── paper/         # Paper setup
│   │   ├── timer/         # Active timer
│   │   └── summary/       # Results
│   └── mains/             # Mains flow
│       ├── type/          # Question type
│       ├── timer/         # Countdown timer
│       └── end/           # Session end
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Timer.tsx         # Timer display
│   ├── Heatmap.tsx       # Question time heatmap
│   └── MilestoneIndicator.tsx
├── hooks/                 # Custom React hooks
│   └── useTimer.ts       # Timer hook with rAF
├── store/                 # Zustand store
│   └── useStore.ts
└── lib/                   # Utilities
    ├── analytics.ts      # Stats calculations
    └── constants.ts      # App constants
```

## Constraints

- No backend or API routes
- No authentication
- No database
- No user history persistence
- Session state resets on refresh
- Only name is persisted to localStorage
