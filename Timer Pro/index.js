const hourInterval = document.querySelector(".hour");
const minuteInterval = document.querySelector(".minute");
const secondInterval = document.querySelector(".second");
const millisecondInterval = document.querySelector(".milliseconds");

const startButton = document.querySelector(".start");
const resetButton = document.querySelector(".reset");
const restartButton = document.querySelector(".restart");
const saveButton = document.querySelector(".save");
const clearButton = document.querySelector(".clear");
const finishBtn = document.querySelector("#finishRaceBtn");
const viewResultsBtn = document.querySelector("#viewResultsBtn");
const stayBtn = document.querySelector("#stayBtn");

const resultModal = document.querySelector("#resultModal");
const warningBox = document.querySelector("#warningMessage");

const logList = document.querySelector(".logList");
const timerBox = document.querySelector(".timerDisplay");
const runnerInput = document.querySelector("#runnerInput");
const idPrompt = document.querySelector("#idPrompt");
const idForm = document.querySelector("#idForm");
const feedback = document.querySelector("#feedback");

let timer = null;
let isRunning = false;
let hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0;
let recordedTime = "";
let raceResults = [];

function format(num) {
  return num.toString().padStart(2, "0");
}

function timeToMs(timeStr) {
  const [h, m, s, ms] = timeStr.split(":").map(Number);
  return (h * 60 * 60 + m * 60 + s) * 100 + ms;
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

function showExtraButtons() {
  resetButton.classList.remove("hidden");
  restartButton.classList.remove("hidden");
  saveButton.classList.remove("hidden");
  clearButton.classList.remove("hidden");
}

function hideExtraButtons() {
  resetButton.classList.add("hidden");
  restartButton.classList.add("hidden");
  saveButton.classList.add("hidden");
  clearButton.classList.add("hidden");
}

startButton.addEventListener("click", () => {
  if (!isRunning) {
    timer = setInterval(updateTimer, 10);
    isRunning = true;
    startButton.textContent = "Pause";
    timerBox.classList.add("animate");
    feedback.textContent = "Timer started.";
    showExtraButtons();
  } else {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = "Play";
    timerBox.classList.remove("animate");
    feedback.textContent = "Timer paused.";
  }
});

resetButton.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  hour = 0;
  minute = 0;
  second = 0;
  millisecond = 0;

  hourInterval.textContent = "00";
  minuteInterval.textContent = "00";
  secondInterval.textContent = "00";
  millisecondInterval.textContent = "00";

  startButton.textContent = "Play";
  timerBox.classList.remove("animate");
  feedback.textContent = "Timer reset.";
  hideExtraButtons();
});

restartButton.addEventListener("click", () => {
  clearInterval(timer);
  timer = setInterval(updateTimer, 10);
  isRunning = true;
  startButton.textContent = "Pause";
  timerBox.classList.add("animate");
  feedback.textContent = "Timer restarted.";
});

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

idForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = runnerInput.value.trim();

  warningBox.classList.add("hidden");

  if (!id || !recordedTime) {
    feedback.textContent = "Runner ID or time missing.";
    return;
  }

  const alreadyExists = raceResults.some((r) => r.id === id);
  if (alreadyExists) {
    warningBox.classList.remove("hidden");
    feedback.textContent = "Duplicate ID detected.";
    return;
  }

  raceResults.push({
    id,
    time: recordedTime,
    ms: timeToMs(recordedTime),
  });

  raceResults.sort((a, b) => a.ms - b.ms);

  while (logList.firstChild) {
    logList.removeChild(logList.firstChild);
  }

  raceResults.forEach((runner, index) => {
    const li = document.createElement("li");
    let positionLabel = "";

    if (index === 0) positionLabel = "🥇 1st";
    else if (index === 1) positionLabel = "🥈 2nd";
    else if (index === 2) positionLabel = "🥉 3rd";
    else positionLabel = `${index + 1}th`;

    const text = document.createTextNode(
      `Runner ${runner.id} – ${runner.time} (${positionLabel} Position)`
    );
    li.appendChild(text);
    logList.appendChild(li);
  });

  runnerInput.value = "";
  idPrompt.hidden = true;
  recordedTime = "";
  feedback.textContent = "Runner time saved.";
});

clearButton.addEventListener("click", () => {
  raceResults = [];

  while (logList.firstChild) {
    logList.removeChild(logList.firstChild);
  }

  feedback.textContent = "All finish times cleared.";
});

async function postResultsToServer() {
  try {
    const res = await fetch("http://localhost:8080/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(raceResults),
    });

    if (res.ok) {
      feedback.textContent = "Results saved to server.";
      resultModal.classList.remove("hidden");
    } else {
      feedback.textContent = "Failed to save results to server.";
    }
  } catch (err) {
    feedback.textContent = "Error connecting to server.";
    console.error(err);
  }
}

finishBtn.addEventListener("click", () => {
  if (raceResults.length === 0) {
    feedback.textContent = "No results to save.";
    return;
  }

  postResultsToServer();
});

viewResultsBtn.addEventListener("click", () => {
  window.location.href = "results.html";
});

stayBtn.addEventListener("click", () => {
  resultModal.classList.add("hidden");
  feedback.textContent = "You can still review or add results.";
});
