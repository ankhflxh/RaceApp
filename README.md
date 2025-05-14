# Race Timer (Pro) – University of Portsmouth Coursework

Author: up2257356 · Module: WEB Programming 2025

A lightweight, offline-friendly race-timing web-app built for the Portsmouth Joggers Club.  
It lets organisers start / stop the clock, record each finisher, and publish live results that spectators can watch on-site—no external dependencies beyond vanilla JS, Express, and SQLite.

---

## Table of Contents

1. [Key Features](#key-features)
2. [Folder Structure](#folder-structure)
3. [Tech Stack](#tech-stack)
4. [Setup & Running Locally](#setup--running-locally)
5. [Backend & API](#backend--api)
6. [Accessibility & UX Choices](#accessibility--ux-choices)
7. [AI Assistance Log](#ai-assistance-log)
8. [Final Reflection](#final-reflection)
9. [External Learning](#External Learning)

---

---

## Key Features

### 🏁 Landing Page – `landing.html`

The landing page is the starting point of the application. It has a clean and welcoming design with a gradient background and an animated runner image that adds a dynamic feel. This page helps users easily navigate to the different parts of the app using three large, glove-friendly buttons placed in the center:

- **ℹ️ About (Top-Right Corner)**: A floating circular icon that links to `about.html`. It provides users with context about the app and how to use it.
- **⏱️ Race Timer**: Navigates to the core timer interface at `Timer Pro/index.html`. This is where race officials can manage the live stopwatch and record finish times.
- **📊 View Results**: Leads to `spectator.html`, a live-updating results page for the audience to follow race standings.

The design is fully responsive, easy to use, and optimized for visibility in outdoor environments.

---

### ⏱️ Timer Interface – `index.html`, `index.js`, `index.css`

This is the heart of the application where the race is timed and runner results are recorded. It features a digital stopwatch with real-time updates and animated borders that glow when running. The layout is clean, with the following components and buttons:

- **Timer Display**: Shows the current time in `HH:MM:SS:MS` format.
- **Start / Pause Button**: Toggles between starting and pausing the timer. Changes label dynamically to "Play" or "Pause".
- **Restart Button**: Resumes the timer after a pause without resetting the time.
- **Reset Button**: Clears the timer and resets all values to zero.
- **Record Button**: Captures the current time and prompts the user to enter a unique runner ID.
- **Runner ID Input**: Appears when recording; ensures each runner’s ID is unique. Prevents duplicates and displays warnings.
- **Finish Race Button**: Submits all results to the server and opens a modal asking whether to view the final results.
- **Modal – View Results Prompt**:
  - **Yes**: Redirects to `results.html`.
  - **No**: Closes modal, lets user continue editing.
- **Live Log Area**: Displays a list of recorded runner finish times, positions, and medals.
- **Clear Laps Button**: Clears the UI and backend race results (`DELETE /clear`).

The page automatically:

- Loads saved timer state from `/timer-state`.
- Restores previously recorded results from `/results`.
- Saves timer state every second for reliability.

---

### 👥 Spectator View – `spectator.html`

Designed for public viewing, this page fetches and displays race results in real-time. It's intended for use on large screens or personal devices by spectators. Features include:

- **Race Results Table**: Displays runner position, ID, time, and medal (🥇🥈🥉) based on their finish order.
- **CSV Export Button**: Downloads the visible data in `.csv` format for analysis or records.
- **Back Button (🔙)**: Returns the user to `landing.html`.

The results are updated from the `/results` endpoint, sorted automatically by time.

---

### 🧾 Admin Results Page – `results.html`

A full-screen administrative version of the spectator view with more controls. It supports both viewing and managing results post-race:

- **Race Results Table**: Same layout and sorting logic as `spectator.html`.
- **Refresh Button**: Manually fetches the latest results from the backend.
- **Clear Server Results**: Calls `DELETE /clear` to completely wipe race results from the database.
- **Back to Timer**: Returns to `index.html` for any final edits or timing corrections.
- **Export as CSV**: Saves the current result table as a `.csv` file.

Used mainly by officials post-race to validate or reset data.

---

### ℹ️ About Page – `about.html`

Provides a concise explanation of what Timer Pro is, who it was built for, and what it offers. This page includes:

- **Overview**: A short description of the app and its purpose.
- **Key Features List**:
  - Starting and managing timers
  - Automatic ranking with medals
  - Real-time results display
- **Back Button (🔙)**: Links back to `landing.html`.

Clean typography and a centered layout make it easy to read and understand.

---

## Tech Stack

- **Frontend**: HTML, CSS (no frameworks), Vanilla JavaScript
- **Backend**: Node.js with Express
- **Database**: SQLite (file-based, no external hosting)
- **No third-party libraries or frameworks** used (complies with coursework rules)

---

## Setup & Running Locally

1. Make sure Node.js is installed on your machine.
2. Download or clone this project folder.
3. Navigate to the project root and run:

```bash
npm install        # Installs express and sqlite3
npm run start      # Starts the server at http://localhost:8080
```

### ✅ Automatic Database Initialization

No manual setup is required for the database.  
When the server launches, `initializeDb.js` runs automatically and:

- Creates a `database.db` file (if not already present)
- Initializes two tables:
  - `race_results` – stores all runner finish data
  - `timer_state` – persists timer state for recovery after refresh or crash

---

## Backend & API

The backend is powered by Express and SQLite. It handles data persistence, syncing, and timer state management.

### 📡 Endpoints

| Route          | Method | Description                                             |
| -------------- | ------ | ------------------------------------------------------- |
| `/`            | GET    | Serves the landing page                                 |
| `/submit`      | POST   | Accepts and stores race results in bulk or single entry |
| `/results`     | GET    | Returns all race results in JSON format                 |
| `/clear`       | DELETE | Wipes all race results from the database                |
| `/timer-state` | GET    | Retrieves the latest saved timer state                  |
| `/timer-state` | POST   | Saves or updates the current timer state                |

These are used throughout the app to enable real-time result viewing, autosave, and recovery.

---

## Accessibility & UX Choices

- **Glove-Friendly UI**: All buttons are large and well-spaced for easy tapping in outdoor conditions.
- **High Contrast Colors**: Colors were chosen to be colorblind-safe and readable under direct sunlight.
- **Minimal Interaction Steps**: Race results are saved with only two actions — record and enter ID.
- **Timer Recovery**: The timer auto-saves every second and restores automatically after reload.
- **Scroll Management**: The runner log scrolls independently, so the timer and controls remain fixed and always visible.
- **Offline Support**: Designed to work in airplane mode — results are stored locally and submitted later.
- **Responsive Design**: Optimized for mobile, tablets, and laptops.

---

---

## AI

This section details how I used AI during development: the prompts I used, how they helped or failed, and what I learned from the experience. I've grouped them based on the functionality or feature they relate to.

---

### Prompts to Develop the Animated Runner

> How can I animate a running figure across the screen using HTML/CSS?

The response suggested using SVG sprites or animated GIFs. However, due to coursework constraints and limitations on asset quality, I settled on a looping `<img>` tag with a CSS `@keyframes` animation that moves a static image across the screen.  
The final implementation is visible in `landing.html` with the `#runner` element.

---

### Prompts to Develop the Timer & Toggle Logic

> How do I create a Start/Pause toggle button in vanilla JavaScript?

This helped set up the logic that changes button text between "Play" and "Pause", and toggles timer animation and intervals accordingly.  
It’s implemented in `index.js` inside the `startButton.addEventListener`.

> How do I persist timer state using fetch and restore it?

This led to the `/timer-state` API and autosave feature. I also asked:

> How can I restore timer values after a page reload?

The guidance shaped the auto-loading and restoring logic now seen in the IIFE at the bottom of `index.js`.

---

### Prompts to Develop Result Handling & CSV Export

> What’s the best way to export JavaScript array as a CSV file?

This helped me structure the `exportCSV()` function in both `spectator.html` and `results.html`.

> How do I allow spectators to see final results after admin ends the race?

AI helped structure the modal (`#resultModal`) and timing of `POST /submit` requests. This created a clear distinction between admin-side race handling and spectator display.

---

### Prompts to Design for Color & Accessibility

> What color palettes are best for visibility under sunlight?

> What colors are safe for colorblind users?

These influenced background and text color combinations in `index.css` and other pages. AI recommendations helped increase contrast while avoiding harsh tones.

> Why use rem instead of px and how do I convert?

I had feedback from a reviewer to switch from `px` to `rem`. AI explained accessibility/scaling benefits and gave me a formula for conversion. This influenced updates across `index.css`.

---

### Prompts to Enhance UX and Prevent Errors

> How do I stop duplicate IDs from being entered?

The suggestion to check `.some()` over the raceResults array was simple but effective. It’s implemented in `index.js` during the form submission logic.

> How do I make logs scroll in a fixed area?

AI taught me to wrap the log list in a container with `overflow-y: auto` and fixed height, preserving layout integrity. This was applied in `.logs` styling.

---

### Prompts to Structure the README

> How should I structure a professional, clear README for a coursework project?

This guided how I built the entire `README.md`, organizing sections with markdown anchors, clean headings, and reflection. AI didn’t write the content fully but provided a skeleton I rewrote and expanded.

---

### What Went Wrong

Some AI responses were too generalized, or suggested third-party libraries (like jsPDF for PDFs), which violated coursework rules. Sometimes prompts had to be rephrased several times before getting a relevant answer — especially for edge-case logic or working without any frameworks.

> Using AI taught me patience — because sometimes the prompts and instructions completely destroyed my code and I had to kind of start my logic again.

---

### What I Learned

- YOU HAVE TO KNOW WHAT YOU ARE DOING AND NOT SOLELY RELY ON AI
- The value of simplicity: clear layouts and big buttons matter
- How to think like a user — especially under cold, wet, race-day conditions
- How to persist and restore state using APIs

---

## Final Reflection

This project tested more than my ability to code — it challenged how I think about users, real-world conditions, and maintainable systems. Designing something simple enough for older users, yet reliable enough for cold and offline race conditions, required a mindset shift.

While AI accelerated a few ideas, it couldn’t replace the need to debug, refactor, and truly understand the logic. I learned when to rely on AI and when to trust my own reasoning. Even the best AI-generated code needs a human to make it truly usable.

I’m proud of this solution — it’s fast, clean, accessible, and fits the brief exactly. It also makes my 4-year-old self proud. 🚀

---

## External Learning:

I also watched these YouTube tutorials during development which helped with brainstorming ideas:

Stopwatch using HTML, CSS and JavaScript | Play, Reset and add Laps by The Coding Lab:
https://youtu.be/2TLjO0MlBLg?feature=shared

Create a StopWatch using HTML, CSS, and JavaScript | Action (Start, Pause, Reset, Restart, Lap) by Creative JS Coder:
https://youtu.be/mwFDH58U_3o?feature=shared
