import { randomScrambleForEvent } from "https://cdn.cubing.net/v0/js/cubing/scramble";

let resultList = [];
let interval;
const timerMil = document.getElementById("mil");
const timerSec = document.getElementById("sec");
const timerMin = document.getElementById("min");
let ready = 0;
let isTimerStart = 0;
let mil = 0;
let sec = 0;
let min = 0;
let idx = 0;
let armTimeout = null;

async function generateScramble() {
  let scramble = await randomScrambleForEvent("333bf");
  let scrambles = String(scramble).split("");
  for (let i = 0; i < scrambles.length; i++) {
    if (scrambles[i] == "D" && scrambles[i + 1] == "w") scrambles[i] = "U";
  }
  scrambles = scrambles.join("");
  document.getElementById("scramble").innerHTML = scrambles;
}

generateScramble();

function addNewTime(idx, time, ao5) {
  const table = document.getElementById("resultTable");

  const newResult = table.insertRow(1);
  const newIdx = newResult.insertCell(0);
  const newTime = newResult.insertCell(1);
  const newStatus = newResult.insertCell(2);

  newIdx.innerText = idx;
  newTime.innerText = time;
  newStatus.innerText = ao5;
}

function averageOf(num) {
  let sum = 0;
  let maximum = resultList[resultList.length - 1];
  let minnimum = resultList[resultList.length - 1];
  for (let i = resultList.length - 1; i >= resultList.length - num; i--) {
    sum += resultList[i];
    if (resultList[i] > maximum) {
      maximum = resultList[i];
    }
    if (resultList[i] < minnimum) {
      minnimum = resultList[i];
    }
  }
  sum -= minnimum;
  sum -= maximum;
  sum = Math.round(sum / (num - 2));

  let minOfAver = Math.floor(sum / 6000);
  let secOfAver = Math.floor(sum / 100) % 60;
  let milOfAver = sum % 100;
  const average = [minOfAver, secOfAver, milOfAver];

  return average;
}

function meanOf(num) {
  let sum = 0;
  for (let i = resultList.length - 1; i >= resultList.length - num; i--) {
    sum += resultList[i];
  }
  sum = Math.round(sum / num);

  let minOfMean = Math.floor(sum / 6000);
  let secOfMean = Math.floor(sum / 100) % 60;
  let milOfMean = sum % 100;
  const mean = [minOfMean, secOfMean, milOfMean];

  return mean;
}

function timerStart(startTime) {
  let currentTime = Date.now() - startTime;
  mil = Math.floor(currentTime / 10) % 100;
  sec = Math.floor(currentTime / 1000) % 60;
  min = Math.floor(currentTime / 60000);
  timerMil.innerHTML = String(mil).padStart(2, "0");
  timerSec.innerHTML = String(sec).padStart(2, "0");
  timerMin.innerHTML = String(min).padStart(2, "0");
}

window.addEventListener("keyup", (e) => {
  if (e.keyCode != 32) return;
  e.preventDefault();

  if (e.keyCode == 32 && isTimerStart == 0 && ready == 1) {
    clearTimeout(armTimeout);
    armTimeout = null;
    const timerEl = document.getElementById("timer");
    timerEl.classList.remove("ready", "armed");

    let startTime = Date.now();
    interval = setInterval(() => {
      timerStart(startTime);
    }, 10);
    isTimerStart = 1;
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode != 32) return;
  e.preventDefault();

  const timerEl = document.getElementById("timer");

  // If timer is running, a fresh (non-repeated) keydown stops it and records the solve
  if (isTimerStart == 1 && !e.repeat) {
    generateScramble();
    resultList.push(min * 6000 + sec * 100 + mil);
    if (resultList.length >= 5) {
      let [minOfAo5, secOfAo5, milOfAo5] = averageOf(5);

      addNewTime(
        ++idx,
        String(min).padStart(2, "0") +
          ":" +
          String(sec).padStart(2, "0") +
          "." +
          String(mil).padStart(2, "0"),
        String(minOfAo5).padStart(2, "0") +
          ":" +
          String(secOfAo5).padStart(2, "0") +
          "." +
          String(milOfAo5).padStart(2, "0")
      );
    } else {
      addNewTime(
        ++idx,
        String(min).padStart(2, "0") +
          ":" +
          String(sec).padStart(2, "0") +
          "." +
          String(mil).padStart(2, "0"),
        "-"
      );
    }

    clearInterval(interval);
    isTimerStart = 0;
    ready = 0;
    clearTimeout(armTimeout);
    armTimeout = null;
    timerEl.classList.remove("ready", "armed", "running");
    return;
  }

  // Start arming only on the initial keydown (ignore repeats)
  if (isTimerStart == 0 && !e.repeat && ready == 0) {
    ready = 1;
    timerEl.classList.add("ready");

    clearTimeout(armTimeout);
    armTimeout = setTimeout(() => {
      if (ready && isTimerStart == 0) {
        timerEl.classList.remove("ready");
        timerEl.classList.add("armed");
      }
    }, 550);
  }
});
