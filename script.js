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

// mark the initial tbody as empty so we can style the placeholder rows differently
const resultTbody = document.querySelector("#resultTable tbody");
if (resultTbody) resultTbody.classList.add("empty");

function addNewTime(idx, time, ao5, ao12) {
  const table = document.getElementById("resultTable");
  let newResult;

  // If this is the first input, reuse the single placeholder row (table.rows[1]).
  // From the second input onward, insert a new row at the top so ordering and CSS nth-child alternation stays consistent.
  if (idx === 1) {
    newResult = table.rows[1];
  } else {
    newResult = table.insertRow(1);
  }

  // 기존 셀이 있으면 업데이트, 없으면 생성
  if (newResult.cells.length === 0) {
    newResult.insertCell(0);
    newResult.insertCell(1);
    newResult.insertCell(2);
    newResult.insertCell(3);
  }

  newResult.cells[0].innerText = idx;
  newResult.cells[1].innerText = time;
  newResult.cells[2].innerText = ao5;
  newResult.cells[3].innerText = ao12;

  // assign persistent stripe class so the row's color doesn't change when new rows are inserted
  newResult.classList.remove("stripe-odd", "stripe-even");
  if (idx % 2 === 0) {
    newResult.classList.add("stripe-even");
  } else {
    newResult.classList.add("stripe-odd");
  }

  // If this was the first input, remove the 'empty' placeholder styling
  const tbody = table.querySelector("tbody");
  if (tbody && tbody.classList.contains("empty")) {
    tbody.classList.remove("empty");
  }
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

function averageOfNum(list, num) {
  if (list.length < num) return null;
  const slice = list.slice(-num);
  let sum = slice.reduce((a, b) => a + b, 0);
  const maximum = Math.max(...slice);
  const minnimum = Math.min(...slice);
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
  if (e.code !== "Space") return;
  e.preventDefault();

  const timerEl = document.getElementById("timer");

  if (e.code === "Space" && isTimerStart == 0) {
    clearTimeout(armTimeout);
    armTimeout = null;

    if (timerEl.classList.contains("armed")) {
      timerEl.classList.remove("ready", "armed");

      let startTime = Date.now();
      interval = setInterval(() => {
        timerStart(startTime);
      }, 10);
      isTimerStart = 1;
    } else {
      timerEl.classList.remove("ready", "armed");
    }

    ready = 0;
  }
});

window.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;
  e.preventDefault();

  const timerEl = document.getElementById("timer");

  // If timer is running, a fresh (non-repeated) keydown stops it and records the solve
  if (isTimerStart == 1 && !e.repeat) {
    generateScramble();
    resultList.push(min * 6000 + sec * 100 + mil);

    let ao5Str = "-";
    let ao12Str = "-";

    if (resultList.length >= 5) {
      let [minOfAo5, secOfAo5, milOfAo5] = averageOf(5);
      ao5Str =
        String(minOfAo5).padStart(2, "0") +
        ":" +
        String(secOfAo5).padStart(2, "0") +
        "." +
        String(milOfAo5).padStart(2, "0");
    }

    if (resultList.length >= 12) {
      let [minOfAo12, secOfAo12, milOfAo12] = averageOfNum(resultList, 12);
      ao12Str =
        String(minOfAo12).padStart(2, "0") +
        ":" +
        String(secOfAo12).padStart(2, "0") +
        "." +
        String(milOfAo12).padStart(2, "0");
    }

    addNewTime(
      ++idx,
      String(min).padStart(2, "0") +
        ":" +
        String(sec).padStart(2, "0") +
        "." +
        String(mil).padStart(2, "0"),
      ao5Str,
      ao12Str
    );

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
