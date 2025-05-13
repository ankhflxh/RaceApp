// Timer Elements
const hourInterval = document.querySelector(".hour");
const minuteInterval = document.querySelector(".minute");
const secondInterval = document.querySelector(".second");
const millisecondInterval = document.querySelector(".milliseconds");

// Buttons
const startButton = document.querySelector(".start");
const resetButton = document.querySelector(".reset");
const restartButton = document.querySelector(".restart");
const saveButton = document.querySelector(".save");
const clearButton = document.querySelector(".clear");

// Sections
const sidePanel = document.querySelector(".sidePanel");
const logList = document.querySelector(".logList");
const timerBox = document.querySelector(".timerDisplay");
const runnerInput = document.querySelector("#runnerInput");
const idPrompt = document.querySelector("#idPrompt");
const idForm = document.querySelector("#idForm");
const feedback = document.querySelector("#feedback");

// Timer State
let timer = null;
let isRunning = false;
let hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0;
let recordedTime = "";

function format(num) {
  return num.toString().padStart(2, "0");
}

function updateTimer() {
  millisecond++;
  if (millisecond >= 100) {
    millisecond = 0;
    second++;
  }
  if (second >= 60) {
    second = 0;
    minute++;
  }
  if (minute >= 60) {
    minute = 0;
    hour++;
  }

  hourInterval.textContent = format(hour);
  minuteInterval.textContent = format(minute);
  secondInterval.textContent = format(second);
  millisecondInterval.textContent = format(millisecond);
}

// Start / Pause Logic
startButton.addEventListener("click", () => {
  if (!isRunning) {
    timer = setInterval(updateTimer, 10);
    isRunning = true;
    startButton.textContent = "Pause";
    sidePanel.classList.remove("hidden");
    timerBox.classList.add("animate");
    feedback.textContent = "Timer started.";
  } else {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = "Play";
    timerBox.classList.remove("animate");
    feedback.textContent = "Timer paused.";
  }
});

// Reset Button
resetButton.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  hour = minute = second = millisecond = 0;
  updateTimer();

  startButton.textContent = "Play";
  timerBox.classList.remove("animate");
  sidePanel.classList.add("hidden");

  feedback.textContent = "Timer reset.";
});

// Restart (resumes immediately)
restartButton.addEventListener("click", () => {
  clearInterval(timer);
  timer = setInterval(updateTimer, 10);
  isRunning = true;
  startButton.textContent = "Pause";
  timerBox.classList.add("animate");
  feedback.textContent = "Timer restarted.";
});

// Save Lap Time → prompt for ID
saveButton.addEventListener("click", () => {
  if (!isRunning) {
    feedback.textContent = "Start the timer first.";
    return;
  }

  recordedTime = `${format(hour)}:${format(minute)}:${format(second)}:${format(
    millisecond
  )}`;
  idPrompt.hidden = false;
  runnerInput.focus();
  feedback.textContent = "Time recorded. Please enter runner ID.";
});

// Submit Runner ID
idForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = runnerInput.value.trim();

  if (!id || !recordedTime) {
    feedback.textContent = "Runner ID or time missing.";
    return;
  }

  const item = document.createElement("li");
  item.textContent = `Runner ${id} – ${recordedTime}`;
  logList.appendChild(item);

  runnerInput.value = "";
  idPrompt.hidden = true;
  recordedTime = "";
  feedback.textContent = "Runner time saved.";
});

// Reset Lap Logs
clearButton.addEventListener("click", () => {
  logList.innerHTML = "";
  feedback.textContent = "All finish times cleared.";
});
