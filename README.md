# Race Timer - by up2257356

## Key Features

**Timer Pro** is a lightweight, offline-friendly race tracking web app designed for the Portsmouth Joggers’ Club. It allows race organizers to time events, record runner finishes, and publish results — all while remaining simple, robust, and accessible for older users even in challenging winter conditions.

---

### 🏁 Landing Page (`landing.html`)

**Purpose:**  
This is the entry point into the Timer Pro system.

**Main Features:**
- ℹ️ **About Button** (top-right) links to `about.html`
- ⏱️ **Race Timer Button** navigates to `index.html`
- 📊 **View Results Button** goes to `spectator.html`
- 🏃‍♂️ Animated runner image scrolls across the bottom for visual energy

Designed for quick access with large buttons and an aesthetic gradient background.

---

### ⏱️ Timer Interface (`index.html` + `index.js` + `index.css`)

**Purpose:**  
This is the primary admin tool for timing a race and recording each finisher.

**Functional Areas:**

- **Timer Display** (`.timerDisplay`)
  - Shows hours, minutes, seconds, and milliseconds
  - Glowing border animation toggled when timer is running

- **Control Buttons:**
  - **Start / Pause (Toggle)** – Toggles between play and pause
  - **Restart** – Continues from current time
  - **Reset** – Resets all time to zero
  - **Record** – Captures the current time and prompts for runner ID
  - **Reset Laps** – Clears all saved results locally and in the backend
  - **Finish Race** – Posts all recorded results to the backend and triggers modal

- **Runner ID Input**
  - Prevents duplicate entries
  - Sorts runners by time and auto-assigns position (🥇, 🥈, 🥉, etc.)

- **Modal Confirmation**
  - Shown after submitting race results
  - Options to view results or remain on page

- **Feedback Section**
  - Accessible updates for user actions

- **Persistence**
  - Timer state is saved to the backend every second via `POST /timer-state`
  - On page load, timer values and results are restored from `/timer-state` and `/results`

---

### 👥 Spectator View (`spectator.html`)

**Purpose:**  
Allows the public to view results in real time after a race.

**Features:**
- Fetches and displays results from `/results`
- Displays medals for top 3
- Allows exporting to CSV
- Simple layout optimized for outdoor readability
- Back button returns to landing page

---

### 🧾 Admin Results Page (`results.html`)

**Purpose:**  
A full-screen interface for managing and exporting race results.

**Features:**
- View and sort all runner data
- Manual refresh
- CSV export
- Clear all server results with one click
- Return to timer interface for additional updates

---

### ℹ️ About Page (`about.html`)

**Purpose:**  
Explains the purpose of the app and key features. Built for non-technical users.

---

## 🧠 Backend Overview

### 📁 Structure

- `server.js`: Main server logic using Express
- `initializeDb.js`: Creates and initializes SQLite database
- `clearRoute.js`: Modular delete route logic (later merged into `server.js`)
- `package.json`: Defines dependencies and scripts

### 🛠 Database Initialization (Automatic)

The database is automatically initialized when the server starts. This is handled by this code in `server.js`:

```js
import initDb from "./initializeDb.js";
const db = initDb(); 
