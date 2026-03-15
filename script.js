let time = 1800;
let hasWestItem = false;
let hasEastItem = false;
let hasSouthItem = false;
let currentScene = "central";

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
    if (time == 0) {
        TIMER.innerText = "Time's Up";
        timesUp();
    } if (time < 0) {
        restart();
    }
}

var timerID = setInterval(updateTimer, 1000);

function loadStory(scene) {
    // This section of code (for loading the JSONs) borrowed from Geeks For Geeks
    // https://www.geeksforgeeks.org/javascript/read-json-file-using-javascript/

    return fetch("./story/" + scene + ".json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Could not retrieve story file due to an error: ${response.status}`);
        }
        currentScene = scene;
        return response.json();
    }) .then(data => {console.log(data); return(data)})
    .catch(error => console.error("Failed to fetch data:", error));
}

function applyStoryContent(story) {
    console.log(currentScene)
    console.log(story);
    storyData = story;
    // Apply story content to the page
    const IMAGE = document.getElementById("image"); 
    const MAINTEXT = document.getElementById("text");
    const RECOMMEND = document.getElementById("recommendation"); // Provides a hint when necessary
    const CHOICES = document.getElementById("choices");

    IMAGE.src = storyData.image;
    MAINTEXT.innerText = storyData.bodyText;
    RECOMMEND.innerText = storyData.recommend;
    CHOICES.innerHTML = "<ul>";
    for (let i = 0; i < Object.keys(storyData.choices).length; i++) {
        console.log(Object.keys(storyData.choices)[i] == "exit");
        // Don't render buttons for already-solved rooms
        if (Object.keys(storyData.choices)[i] == "west" && hasWestItem) {
            CHOICES.innerHTML += "<li style='color: green;'>West Room Solved.</li>";
            continue;
        }
        if (Object.keys(storyData.choices)[i] == "east" && hasEastItem) {
            CHOICES.innerHTML += "<li style='color: green;'>East Room Solved.</li>";
            continue;
        }
        if (Object.keys(storyData.choices)[i] == "south" && hasSouthItem) {
            CHOICES.innerHTML += "<li style='color: green;'>South Room Solved.</li>";
            continue;
        }
        // Skip over rendering certain buttons if conditions are not met
        if (Object.keys(storyData.choices)[i] == "code") {
            continue;
        }
        if (Object.keys(storyData.choices)[i] == "exit" && !(hasEastItem && hasWestItem && hasSouthItem)) {
            RECOMMEND.innerText += "\nYou don't have all the keys to open the door right now. Let's try again after getting all the keys!";
            continue
        }

        CHOICES.innerHTML += `<li><button onclick="loadStory('` + Object.keys(storyData.choices)[i] 
        + `').then(data => applyStoryContent(data)); currentScene ='` 
        + Object.keys(storyData.choices)[i] + `';">` 
        + Object.values(storyData.choices)[i] + `</button></li>`;
    }
    if ("code" in storyData) {
        CHOICES.innerHTML += `<li><button onclick="loadStory('` + currentScene + `').then(data => tryCode(data));">Try Code</button></li>`;
    }
    if (currentScene == "central") {
        // TODO: Multiple acceptable codes in Central room only to accept codes from rhythm game section
    }
    if (currentScene == "west_item") { // Award items upon reaching the corresponding scenes
        hasWestItem = true;
    } else if (currentScene == "east_item") {
        hasEastItem = true;
    } else if (currentScene == "south_item") {
        hasSouthItem = true;
    }

    if (currentScene == "exit") {
        clearTimeout(timerID);
    }
    CHOICES.innerHTML += "</ul>";
}


loadStory("central").then(data => applyStoryContent(data));

function timesUp() {
    let audio = new Audio("./media/timesup.mp3");
    audio.play();
    restart(true);
}

function restart(fail) {
    if (!fail) { // Manual restart
        if (window.confirm("Are you sure you want to restart? The timer will be reset and your progress will be erased.") == true) {
            loadStory("central").then(data => applyStoryContent(data));
            hasEastItem = false;
            hasWestItem = false;
            hasSouthItem = false;
            time = 1800;
        }
    } else { // Failure-initated restart
        loadStory("bad1").then(data => applyStoryContent(data));
        CHOICES.innerHTML += "<li><button onclick='loadStory('central').then(data => applyStoryContent(data)); hasEastItem = false; hasWestItem = false; hasSouthItem = false; time = 1800>Restart</button>"
    }
}

function tryCode(scene) {
    const ERROR = document.getElementById("error");
    const EXPECTED = scene.code;
    const SUCCESS = scene.success;
    const CODEENTRY = document.getElementById("code");
    console.log(CODEENTRY.value.toLowerCase());
    console.log(!CODEENTRY.value.toLowerCase() == EXPECTED);
    
    if (CODEENTRY.value.toLowerCase() != EXPECTED) {
        ERROR.innerText = "Incorrect code! Try again.";
    } else {
        loadStory(SUCCESS).then(data => applyStoryContent(data));
        ERROR.innerText = "";
        CODEENTRY.value = "";
    }
}