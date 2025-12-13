function addNewTime(time, status){
    const table = document.getElementById("resultTable");

    const newResult = table.insertRow(1);

    const newTime = newResult.insertCell(0);
    const newStatus = newResult.insertCell(1);

    newTime.innerText = time;
    newStatus.innerText = status;
}

const timerMil = document.getElementById("mil");
const timerSec = document.getElementById("sec");
const timerMin = document.getElementById("min");
let ready = 0;
let isTimerStart = 0;
let mil = 0;
let sec = 0;
let min = 0;

let time = 0;

function timerStart(startTime){
    let currentTime = Date.now()-startTime;
    mil = (Math.floor(currentTime/10))%100;
    sec = (Math.floor(currentTime/1000))%60;
    min = (Math.floor(currentTime/60000));
    timerMil.innerHTML=String(mil).padStart(2,"0");
    timerSec.innerHTML=String(sec).padStart(2,"0");
    timerMin.innerHTML=String(min).padStart(2,"0");
    
}

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 32 && isTimerStart == 0 && ready == 1){
        let startTime = Date.now();
        interval = setInterval(() => {
            timerStart(startTime);
        }, 10);
        isTimerStart= 1;
        document.getElementById("timer").classList.add("running");
    }
})

window.addEventListener("keydown", (e) => {
    
    if(e.keyCode == 32 && isTimerStart==0){
        ready = 1;
        document.getElementById("timer").classList.add("ready");
    }
    else{
        if (isTimerStart == 1){
            addNewTime(String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0") + "." + String(mil).padStart(2,"0"))
        }
        clearInterval(interval);
        isTimerStart = 0;
        ready = 0;
        document.getElementById("timer").classList.remove("ready");
        document.getElementById("timer").classList.remove("running");
    }
})