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

async function generateScramble(){
    let scramble = await randomScrambleForEvent("333bf");
    let scrambles = String(scramble).split("");
    for (let i=0; i<scrambles.length; i++){
        if(scrambles[i] == 'D' && scrambles[i+1] == 'w')
            scrambles[i] = 'U';
    }
    scrambles = scrambles.join("");
    document.getElementById("scramble").innerHTML = scrambles;
}

generateScramble();

function addNewTime(time, ao5){
    const table = document.getElementById("resultTable");

    const newResult = table.insertRow(1);

    const newTime = newResult.insertCell(0);
    const newStatus = newResult.insertCell(1);

    newTime.innerText = time;
    newStatus.innerText = ao5;
}



function averageOf(num){
    let sum = 0;
    let maximum = resultList[resultList.length-1];
    let minnimum = resultList[resultList.length-1];
    for(let i = resultList.length-1; i>=resultList.length-num; i--){
        sum += resultList[i];
        if (resultList[i] > maximum){
            maximum = resultList[i];
        }
        if (resultList[i] < minnimum){
            minnimum = resultList[i];
        }

    }
    sum -= minnimum;
    sum -= maximum;
    sum = Math.round(sum/(num-2));

    let minOfAver = Math.floor(sum/6000);
    let secOfAver = Math.floor(sum/100)%60;
    let milOfAver = sum%100;
    const average = [minOfAver, secOfAver, milOfAver];

    return average;
}

function meanOf(num){
    let sum = 0;
    for(let i = resultList.length-1; i>=resultList.length-num; i--){
        sum += resultList[i];
    }
    sum = Math.round(sum/num);

    let minOfMean = Math.floor(sum/6000);
    let secOfMean = Math.floor(sum/100)%60;
    let milOfMean = sum%100;
    const mean = [minOfMean, secOfMean, milOfMean];

    return mean;
}



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
            generateScramble();
            resultList.push(min*6000+sec*100+mil);
            if(resultList.length>=3){
                let [minOfAo5, secOfAo5, milOfAo5] = meanOf(3);

                addNewTime(String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0") + "." + String(mil).padStart(2,"0"), String(minOfAo5).padStart(2,"0") + ":" + String(secOfAo5).padStart(2,"0") + "." + String(milOfAo5).padStart(2,"0"))
            }
            else{
                addNewTime((String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0") + "." + String(mil).padStart(2,"0")), "-")
            }
        }
        clearInterval(interval);
        isTimerStart = 0;
        ready = 0;
        document.getElementById("timer").classList.remove("ready");
        document.getElementById("timer").classList.remove("running");
    }
})