let time = 1800;
function calcTime() {
    hours = Math.floor(time / 3600);
    minutes = Math.floor((time - (hours * 3600)) / 60);   // This code borrowed from Geeks For Geeks
    seconds = time - (hours * 3600) - (minutes * 60);     // https://www.geeksforgeeks.org/javascript/how-to-convert-seconds-to-time-string-format-hhmmss-using-javascript/
    timeString = minutes.toString().padStart(2, '0') + ':' + 
        seconds.toString().padStart(2, '0');
    return timeString
}

function updateTimer() {
    let TIMER = document.getElementById("timer");
    time--;
    TIMER.innerText = calcTime(time);
}

function start() {
    setInterval(updateTimer, 1000);
}

start();