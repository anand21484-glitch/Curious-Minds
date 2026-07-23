# Handoff: Curious Minds — India's Scientists App

## Overview
Curious Minds is a mobile app for kids (8–18) celebrating 60+ Indian scientists through comic-style stories, facts, quizzes, and a live multiplayer "Think Fast Challenge". It tracks XP, streaks, badges, and a composite "Curiosity Quotient" (CQ) score on a dashboard.

## About the Design Files
The files in this bundle (Curious Minds.dc.html, Curious Minds - standalone.html) are **design references built in HTML** — interactive prototypes demonstrating intended look, content, and behavior. They are not production code to copy as-is. The task is to **recreate these designs in your target codebase's existing environment** (React Native, Flutter, native iOS/Android, etc.) using its established patterns, navigation, and state-management libraries. If no environment exists yet, choose the framework best suited to a cross-platform mobile app and implement the designs there.

Supporting files android-frame.jsx and image-slot.js are prototype-only scaffolding (device bezel + drag-drop image placeholder) and have no bearing on production code — ignore them for implementation.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interaction logic (scoring formulas, XP math, streak rules) shown here are final — implement them pixel- and logic-accurate. All screens are data-driven in the prototype (no hardcoded scores/badges) — replicate that: every number on screen must derive from real user state, not placeholders.

## Screens / Views

### 1. Login
- Full-bleed dark navy background, centered card.
- App name "Curious Minds" (800 weight, 26px, Poppins), tagline below.
- Name input (pill-shaped, dark fill) + "Let's Go" button (gold pill). Enter key submits.
- On submit: name is persisted (localStorage) and reused on return visits — returning users skip login.

### 2. Home
- Time-aware greeting banner: "Good Morning/Afternoon/Evening, {name}!" based on device hour (<12 morning, <17 afternoon, else evening).
- Streak pill (top bar): "{N}-day streak" — only shown once streak > 0.
- Streak celebration overlay: full-screen modal every 5-day milestone, "+100 XP Bonus", confetti emoji, dismissable.
- "Today's Mission" card with 3 pill tabs: Learn / Explore / Discover.
- "Continue Learning" button: resumes the exact last-read story at its exact page (persisted via localStorage: story id + page index).
- "Story of the Day": one featured story, rotates by calendar date (deterministic index = day-of-year modulo story count — same story all day, different tomorrow).
- "Daily Discovery" fact: one of 30 rotating facts, same day-of-year modulo rotation logic.
- Subtle science-icon watermarks (flask/atom/rocket/DNA outline SVGs) in background, ~15–19% opacity.

### 3. Explore
- Top banner (moved to top of screen), three top-level sections: Modern India, Ancient India, Nobel Laureates — each expands into a sub-grid (~12 sub-fields total, e.g. Mathematics, Physics, Astronomy, Chemistry, Biology, Medicine, Space, Environment...).
- Each field card: 2-letter mono badge, name, accent color (each field has its own hex + rgb, e.g. Mathematics #FF5C8A, Physics #4EA8FF).
- Tapping a field opens its scientist grid; tapping a scientist opens their Profile.

### 4. Scientist Profile
- Hero card in the field's accent color/gradient.
- Comic-style story (multi-page, swipeable, page dots, prev/next arrows).
- Curiosity Corner facts, Timeline (year + event), Life Lesson (colored callout), Achievements/Awards.
- "Badge unlocked" chip appears once the theme's quiz is passed (theme's badge, e.g. "Legend Explorer").

### 5. Quiz Zone (Hub)
- Grid of 14 themed quizzes (e.g. "India's Scientific Legends", "Ancient India", "Nobel Laureates", etc.), each with: name, badge name, estimated time label, status (Not started / In progress / Completed, color-coded).
- Age-band selector (8–10 / 11–14 / 15–18) controls easy/medium/hard question mix per quiz.

### 6. Quiz (in progress)
- Question card: difficulty pill (color-coded), type label (Multiple Choice / True-False / Who Am I? / Match / Arrange in Order / Observation / Logic Scenario), "+{XP} XP" pill (10/20/30 XP for easy/medium/hard), "~{time}s" pill.
- Answer options: on selection, correct answer highlights gold, wrong selection highlights red; explanation + "Did You Know?" fact card reveal below.
- XP awarded immediately per question answered correctly, added to running total.

### 7. Quiz Result
- Score summary, "You earned {N} XP this quiz", themed badge unlock chip.
- Special "Curious Minds Champion" badge celebration when ALL 14 theme badges are earned.
- "Try again" button restarts the quiz.

### 8. Think Fast Challenge (live multiplayer, simulated bots)
Sub-phases, same screen:
- **Setup**: choose theme, question count, difficulty (mixed/easy/medium/hard), time per question, max players (up to 4).
- **Lobby**: generates a join code ("CM-#####"), shows a QR-code-style pixel grid placeholder, player list with join/ready status (bots "join" and "ready up" on staggered timers to feel live).
- **Countdown**: 3-2-1-GO overlay.
- **Question**: synced timer bar (color shifts green to gold to red as time runs low), player "answered" chips, options grid.
- **Scoring formula** (tfPointsFor): correct answer scores 100 pts if answered in the first third of the time window, 90 pts in the middle third, 80 pts in the last third; 0 for wrong/no answer. Bots simulate a per-round "skill" (random 0.75 to 1.25) combined with a difficulty factor (easy 0.85 / medium 0.65 / hard 0.45) to decide correctness and a randomized answer time — this is a prototype stand-in for real opponents; a real backend should replace it with actual player input.
- **Round result**: your correctness + points, live scoreboard sorted by score, medals for top 3.
- **Final Results**: champion crown + star rating (1 to 5 stars scaled off champion score vs. max possible), "Quick Thinker" badge unlocked on completion, "Learn from Mistakes" review screen listing missed questions with correct answers + explanations.

### 9. The Curiosity Dashboard (Rank tab)
10 live metrics, in order:
1. **Curiosity Level** — tier name + emoji + star rating, computed from total XP against level thresholds (Young Explorer 0 XP, Junior Scientist 150 XP, ...), with progress bar to next tier.
2. **Curiosity Points (XP)** — total XP + itemized source breakdown (stories read, quizzes completed, etc.).
3. **Scientists Discovered** — count/percentage of profiles viewed.
4. **Field Mastery** — stars per field based on quiz performance.
5. **Daily Streak** — current streak, 7-day week view.
6. **Friends Leaderboard** — see below.
7. **Fast Thinker Score** — average correct-answer time across all Think Fast rounds ever played.
8. **Accuracy Rate** — correct/attempted percentage across all quiz + Think Fast questions.
9. **Discovery Badges** — grid of all earnable badges (14 theme badges + Champion + Quick Thinker), locked/unlocked state.
10. **Curiosity Quotient (CQ)** — composite score weighted: stories 150 + quizzes 250 + accuracy 250 + consistency(streak/30 capped) 150 + exploration 200, with a chip breakdown per component.

**Friends Leaderboard** (latest addition): kids invite friends by name via a text input + "+ Invite" button. Each invited friend is stored (id, name, join timestamp, a seeded base score + daily growth rate derived from a deterministic hash of their name — no two friends grow identically, but each friend's trajectory is stable across reloads). Displayed score = base + growthRate x days-since-invited, recalculated live on every render. "You" row always shows live XP. List re-sorts by score descending; friends can be removed. No hardcoded rival names or scores remain — the previous static bot leaderboard was replaced with this fully dynamic, user-populated one.

### 10. Featured Stories tab
- List of featured longer-form stories (e.g. Ramanujan, APJ Abdul Kalam), same comic-page reader as Profile stories.

### 11. Our Mission (static content page — no data, intentionally evergreen copy about why science/curiosity matters).

## Interactions & Behavior
- Bottom tab bar: Home / Explore / Quiz / Scoreboard / Stories — active tab dot + label in gold (#E7B93C).
- All screen transitions are simple state swaps (no route-based deep linking in the prototype).
- Streak logic: calendar-day-based (not 24h rolling). Missing a full day resets streak to 1. Every 5th consecutive day awards +100 XP with a celebration overlay, once per day.
- Story position (last read) and streak state persist via localStorage. Friends list also persists via localStorage. XP/badges currently do NOT persist across a hard reload in the prototype — confirm with product whether XP/badges should also persist client-side or move to a real backend in production.

## State Management
Key state a production implementation needs:
- userName, onboarding/login flag
- xpTotal, earnedBadges[], per-theme best scores
- viewedScientistIds[], readStoryIds[], last-read story position
- streakDays, last-active date
- Quiz session state: current theme, question index, score, selected answer, answered flag
- Think Fast session state: phase (setup/lobby/countdown/question/result/final/review), players array (name, isBot, score, correctCount, timeSum, fastestTime), current question index, timer
- friends[]: {id, name, joinedAt, baseScore, dailyRate} — replace the seeded-growth stand-in with real friend accounts + real score sync in production
- Aggregate all-time counters for dashboard: totalQuestionsAnswered, totalCorrectAnswers, tfAllTimeTimeSum, tfAllTimeCorrectCount, tfChallengesPlayed

## Design Tokens

### Colors
- Background (base): #0F0B2E
- Card/surface: #1B1547
- Card gradient (accent panels): linear-gradient(135deg,#2C2270,#150F3E)
- Gold (primary accent / XP / CTA): #E7B93C, text-on-gold: #F3D783, button text on gold: #20170A
- Purple accent (Think Fast / challenge cards): #8B7BFF, panel linear-gradient(135deg,#3A1E5C,#1B1547), border rgba(139,123,255,0.35)
- Success/correct green: #2FD9A0
- Error/incorrect red/pink: #FF5C8A / #E1556B
- Primary text: #F6F4FF
- Secondary/muted text: #9187C4, #D8D3F2, #6C6591
- Field accent colors (examples): Mathematics #FF5C8A, Physics #4EA8FF
- Borders: mostly rgba(255,255,255,0.06 to 0.1) hairlines, or accent color at 30 to 40% opacity

### Typography
- Headings/buttons/emphasis: Poppins, weights 700 to 800
- Body/UI text: Inter, weights 500 to 700
- Sizes: hero title 26px, section titles 18 to 20px, card titles 14 to 16px, body 12 to 14px, micro-labels (uppercase, letter-spacing 0.6 to 0.8px) 11 to 12px, big stat numbers 22 to 40px

### Shape & Spacing
- Border radius: pills = 100px (buttons/chips/badges), cards 14 to 24px
- Standard card padding: 14 to 22px
- Gaps: 8 to 20px between stacked elements

## Assets
No external image assets are used yet — the prototype uses inline SVG watermarks (flask/atom/rocket/DNA outlines) and emoji for badges/icons. Production will need: app icon, scientist portrait illustrations (comic-style, per the 60+ scientist roster), field icons if emoji isn't desired long-term.

## Files
- Curious Minds.dc.html — primary design source (Design Component format: template + logic class)
- Curious Minds - standalone.html — same design as a single self-contained file for easy viewing/sharing
- android-frame.jsx, image-slot.js — prototype scaffolding only, not for production use