let time = 1800;
let hasWestItem = false;
let hasEastItem = false;
let hasSouthItem = false;

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
    return fetch("./story/" + scene + ".json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Could not retrieve story file due to an error: ${response.status}`);
        }
        return response.json();
    }) .then(data => {console.log(data); return(data)})
    .catch(error => console.error("Failed to fetch data:", error));
    
}

function applyStoryContent(story) {
    console.log(story);
    storyData = story;
    // Apply story content to the page
    const IMAGE = document.getElementById("image"); 
    const MAINTEXT = document.getElementById("text");
    const RECOMMEND = document.getElementById("recommendation"); // Provides a hint, e.g. when the puzzle of an area is solved, display a hint saying that there's nothing left to do here
    const CHOICES = document.getElementById("choices");

    IMAGE.src = storyData.image;
    MAINTEXT.innerText = storyData.bodyText;
    if ("recommend" in storyData) {
        RECOMMEND.innerText = storyData.recommend;
    }
    CHOICES.innerHTML = "<ul>";
    console.log(storyData.choices.length);
    for (let i = 0; i < storyData.choices.length; i++) {
        CHOICES.innerHTML += "<li>";
        CHOICES.innerHTML += "<button onclick = 'applyStoryContent(loadStory(" + storyData.choices.keys[i] + "))'></li>"; 
        console.log("<button onclick = 'applyStoryContent(loadStory(" + storyData.choices.keys[i] + "))'></li>");
    }
}

loadStory("central").then(data => applyStoryContent(data));