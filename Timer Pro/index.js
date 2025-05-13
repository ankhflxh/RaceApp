const playButton = document.querySelector(".playButton");
const resetButton = document.querySelector(".resetButton");
const recordButton = document.querySelector(".recordButton");
const restartButton = document.querySelector(".restartButton");
const resetLapButton = document.querySelector(".resetLapButton");
const buttons = document.querySelector(".buttons");

const hour = document.querySelector(".hour");
const minute = document.querySelector(".minute");
const second = document.querySelector(".second");
const msec = document.querySelector(".milliSecond");
const recordLap = document.querySelector(".laps");

const runnerInputSection = document.querySelector("#runnerInputSection");
const runnerForm = document.querySelector("#runnerForm");
const runnerIdInput = document.querySelector("#runnerIdInput");
const statusMessage = document.querySelector("#statusMessage");

let isPlay = false;
let isReset = false;
let timer = null;

let hourCounter = 0;
let minuteCounter = 0;
let secondCounter = 0;
let milliCounter = 0;
let recordedLapTime = "";

function formatTime(value) {
  return value.toString().padStart(2, "0");
}

function updateDisplay() {
  hour.textContent = formatTime(hourCounter);
  minute.textContent = formatTime(minuteCounter);
  second.textContent = formatTime(secondCounter);
  msec.textContent = formatTime(milliCounter);
}

function startTimer() {
  timer = setInterval(() => {
    milliCounter++;
    if (milliCounter === 100) {
      milliCounter = 0;
      secondCounter++;
    }
    if (secondCounter === 60) {
      secondCounter = 0;
      minuteCounter++;
    }
    if (minuteCounter === 60) {
      minuteCounter = 0;
      hourCounter++;
    }
    updateDisplay();
  }, 10);
}

playButton.addEventListener("click", () => {
  const outerCircle = document.querySelector(".outerCircle");
  const buttons = document.querySelector(".buttons");

  if (!isPlay) {
    startTimer();
    isPlay = true;
    isReset = false;
    playButton.textContent = "Pause";
    outerCircle.classList.add("animate");
    buttons.classList.remove("hidden");
    statusMessage.textContent = "Timer started.";
  } else {
    clearInterval(timer);
    isPlay = false;
    playButton.textContent = "Play";
    outerCircle.classList.remove("animate");
    buttons.classList.add("hidden");
    statusMessage.textContent = "Timer paused.";
  }
});

resetButton.addEventListener("click", () => {
  clearInterval(timer);
  isPlay = false;
  isReset = true;
  hourCounter = 0;
  minuteCounter = 0;
  secondCounter = 0;
  milliCounter = 0;
  updateDisplay();
  playButton.textContent = "Play";
  statusMessage.textContent = "Timer reset.";
});

recordButton.addEventListener("click", () => {
  if (!isPlay) {
    statusMessage.textContent = "Start the timer first.";
    return;
  }
  recordedLapTime = `${formatTime(hourCounter)}:${formatTime(
    minuteCounter
  )}:${formatTime(secondCounter)}:${formatTime(milliCounter)}`;
  runnerInputSection.hidden = false;
  runnerIdInput.focus();
  statusMessage.textContent = "Time recorded. Enter runner ID.";
});

runnerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const runnerId = runnerIdInput.value.trim();
  if (!runnerId || !recordedLapTime) {
    statusMessage.textContent = "Runner ID or time missing.";
    return;
  }

  const li = document.createElement("li");
  li.textContent = `Runner ${runnerId} - ${recordedLapTime}`;
  recordLap.appendChild(li);

  runnerInputSection.hidden = true;
  runnerIdInput.value = "";
  recordedLapTime = "";
  statusMessage.textContent = "Runner time saved.";
});

restartButton.addEventListener("click", () => {
  clearInterval(timer);
  isPlay = false;
  startTimer();
  playButton.textContent = "Pause";
  statusMessage.textContent = "Timer restarted.";
});

resetLapButton.addEventListener("click", () => {
  recordLap.innerHTML = "";
  statusMessage.textContent = "All laps cleared.";
});
