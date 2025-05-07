const resetButton = document.getElementsByClassName("resetButton")[0];
const playButton = document.getElementsByClassName("playButton")[0];
const recordButton = document.getElementsByClassName("recordButton")[0];
const minute = document.getElementsByClassName("minute")[0];
const second = document.getElementsByClassName("second")[0];
const msec = document.getElementsByClassName("milliSecond")[0];
const lap = document.getElementsByClassName("laps")[0];

let isPlay = false;
let isReset = false;
let minuteCounter = 0;
let secondCounter = 0;
let milliCounter = 0;
let min;
let sec;
let milliSecond

const togButton = () => {
    resetButton.classList.remove("hidden");
    recordButton.classList.remove("hidden");
}

const play = () => {
    if (!isPlay && !isReset) {
        playButton.innerHTML = 'Pause';
        min = setInterval(() => {
            minute.innerHTML = `${++minuteCounter} :`;
        }, 60*1000);
        sec = setInterval(() => {
            if (secondCounter === 60) {
                secondCounter = 0;
            }
            second.innerHTML = `&nbsp;${++secondCounter} :`;
        }, 1000);
        milliSecond = setInterval(() => {
            if (milliCounter === 100) {
                milliCounter = 0;
            }
            msec.innerHTML = `&nbsp;${++milliCounter}  `;
        }, 10);
        isPlay = true;
        isReset = true;
    }
    else {
        playButton.innerHTML = 'Play';
        clearInterval(min);
        clearInterval(sec);
        clearInterval(milliSecond);
        isPlay = false;
        isReset = false;
    }
    togButton();
}

const reset = () => {
    isReset = true;
    play();
    resetButton.classList.add("hidden");
    recordButton.classList.add("hidden");
    minute.innerHTML = '0 :'
    second.innerHTML = '&nbsp;0 :'
    msec.innerHTML = '&nbsp;0';
}


const laps = () => {
    const list = document.createElement("li")
    const position = document.createElement("span")
    const time = document.createElement("span")

    list.setAttribute("class", "lapItems");
    position.setAttribute("class", "position");
    time.setAttribute("class", "time");

    time.innerHTML = `${minuteCounter} : ${secondCounter} : ${milliCounter}`

    list.append(position, time);
    lap.append(list)
}



playButton.addEventListener("click", play);
resetButton.addEventListener("click", reset)
recordButton.addEventListener("click", l)