function addNewTime(time, ao5){
    const table = document.getElementById("resultTable");

    const newResult = table.insertRow(1);

    const newTime = newResult.insertCell(0);
    const newStatus = newResult.insertCell(1);

    newTime.innerText = time;
    newStatus.innerText = ao5;
}

let resultList = [];

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
            resultList.push(min*6000+sec*100+mil);
            if(resultList.length>=5){
                let sum = 0;
                let maximum = resultList[resultList.length-1];
                let minnimum = resultList[resultList.length-1];
                for(let i = resultList.length-1; i>=resultList.length-5; i--){
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
                sum = Math.round(sum/3);

                minOfAo5 = Math.floor(sum/6000);
                SecOfAo5 = Math.floor(sum/100)%60;
                milOfAo5 = sum%100;

                addNewTime(String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0") + "." + String(mil).padStart(2,"0"), String(minOfAo5).padStart(2,"0") + ":" + String(SecOfAo5).padStart(2,"0") + "." + String(milOfAo5).padStart(2,"0"))
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