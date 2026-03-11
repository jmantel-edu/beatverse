let time = 1800;
function calcTime() {
    hours = Math.floor(time / 3600);
    minutes = Math.floor((time - (hours * 3600)) / 60);   // This code borrowed from Geeks For Geeks & modified
    seconds = time - (hours * 3600) - (minutes * 60);     // https://www.geeksforgeeks.org/javascript/how-to-convert-seconds-to-time-string-format-hhmmss-using-javascript/
    timeString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    return timeString;
}

function updateTimer() {
    const TIMER = document.getElementById("timer");
    time--;
    TIMER.innerText = calcTime(time);
    if (time < 300) {
        TIMER.style.color = "red";
    } else if (time < 900) {
        TIMER.style.color = "yellow";
    }
}

function start() {
    setInterval(updateTimer, 1000);
}

start();

function loadStory(scene) {
    // This section of code (for loading the JSONs) borrowed from Geeks For Geeks
    // https://www.geeksforgeeks.org/javascript/read-json-file-using-javascript/
    fetch("./story/" + scene + ".json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Could not retrieve story file due to an error: ${response.status}`);
        }
        return response.json();
    }) .then(data => console.log(data))
    .catch(error => console.error("Failed to fetch data:", error));

    // Apply story content to the page
    let IMAGE = document.getElementById("image"); 
    let MAINTEXT = document.getElementById("text");
    let RECOMMEND = document.getElementById("recommendation"); // Provides a hint, e.g. when the puzzle of an area is solved, display a hint saying that there's nothing left to do here
    let CHOICES = document.getElementById("choices");
}

loadStory("central")