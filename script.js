let startTime = 0;
let elapsed = 0;
let interval;
let running = false;
const display = document.getElementById("display");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const laps = document.getElementById("laps");

function updateDisplay(ms) {
  const date = new Date(ms);
  const h = String(date.getUTCHours()).padStart(2, "0");
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  const msStr = String(ms % 1000).padStart(3, "0");
  display.textContent = `${h} : ${m} : ${s} : ${msStr}`;
}

function start() {
  startTime = Date.now() - elapsed;
  interval = setInterval(() => {
    elapsed = Date.now() - startTime;
    updateDisplay(elapsed);
  }, 10);
}

function stop() {
  clearInterval(interval);
}

function reset() {
  stop();
  elapsed = 0;
  updateDisplay(0);
  laps.innerHTML = "";
  localStorage.removeItem("laps");
}

function lap() {
  const lapTime = display.textContent;
  const li = document.createElement("li");
  li.textContent = `Lap ${laps.children.length + 1}: ${lapTime}`;
  laps.prepend(li);
  saveLap(lapTime);
}

function toggleStartStop() {
  if (!running) {
    start();
    startStopBtn.textContent = "⏸️ Pause";
  } else {
    stop();
    startStopBtn.textContent = "▶️ Start";
  }
  running = !running;
}

function saveLap(time) {
  let savedLaps = JSON.parse(localStorage.getItem("laps")) || [];
  savedLaps.unshift(time);
  localStorage.setItem("laps", JSON.stringify(savedLaps));
}

function loadLaps() {
  const savedLaps = JSON.parse(localStorage.getItem("laps")) || [];
  savedLaps.forEach((time, i) => {
    const li = document.createElement("li");
    li.textContent = `Lap ${i + 1}: ${time}`;
    laps.appendChild(li);
  });
}

// Theme toggle
document.getElementById("theme-toggle").onclick = () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
};

// Load theme & laps on load
window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
  }
  loadLaps();
};

startStopBtn.onclick = toggleStartStop;
resetBtn.onclick = reset;
lapBtn.onclick = lap;
