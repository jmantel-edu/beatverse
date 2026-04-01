let gameTime = 0;
const CANVAS = document.getElementById("canvas")

const C = document.getElementById("canvas");
const CTX = C.getContext("2d");

function drawText(font, content, x, y, color) {
    // Note: Font should be "Sizepx FontName". Ex.: "30px Arial" "15px Verdana"
    CTX.font = font;
    CTX.fillStyle = color;
    CTX.fillText(content, x, y);
    CTX.fillStyle = "white";
}
let AUDIO = new Audio("../media/audio.mp3");
function prepare(event) { // Prepare to start the game
    let key = event.key;
    if (event.key == "h") {
        chart = hardChart;
        console.log("Ready to start");
        window.removeEventListener("keydown", prepare); // Remove the event listener to avoid prepare()-ing multiple times
        AUDIO.play();
        requestAnimationFrame(gameLoop);
    } else if (event.key == "Enter") {
        console.log("Ready to start");
        window.removeEventListener("keydown", prepare); // Remove the event listener to avoid prepare()-ing multiple times
        AUDIO.play();
        requestAnimationFrame(gameLoop);
    }
}

let eventListenerAdded = false;
let perfect = 0;
let great = 0;
let ok = 0;
let miss = 0;
let judgementText = "";

function gameLoop(timestamp) { // Game Loop
    
    if (!eventListenerAdded) {
        window.addEventListener("keydown", judgement);
        eventListenerAdded = true;
    }

    CTX.fillStyle = "black";
    CTX.fillRect(0, 0, canvas.width, canvas.height);
    CTX.fillStyle = "white";
    gameTime = AUDIO.currentTime*1000;
    let score = 0;
    let health = 20;

    function renderNotes(notes) {
        // Render note line
        CTX.strokeStyle = "white";
        CTX.beginPath();
        CTX.lineWidth = 7;
        CTX.moveTo(50, 1100);
        CTX.lineTo(310, 1100);
        CTX.stroke();

        // Canvas is 675*1200
        // Render note functions depending on lane (let rt be the automatically calculated time ahead of the note):
        // Ln.1: CTX.rect(50, 1100+rt, 50, 25)
        // Ln.2: CTX.rect(120, 1100+rt, 50, 25)
        // Ln.3: CTX.rect(190, 1100+rt, 50, 25)
        // Ln.4: CTX.rect(260, 1100+rt, 50, 25)
        // Notes move down as their Y increases
        
        for (var i = 0; i < notes.length; i++) {
            var rt = gameTime - notes[i].time;
            if (rt < -1500) {
                break;
            } else if (rt > 300) {
                chart.shift();
                console.log("Note dropped off of end");
                miss += 1;
                continue;
            } else if (notes[i].lane == 1) {
                CTX.fillStyle = "#FFFF00";
                CTX.fillRect(50, 1100+rt, 50, 25);
            } else if (notes[i].lane == 2) {
                CTX.fillStyle = "#FFFF00";
                CTX.fillRect(120, 1100+rt, 50, 25);
            } else if (notes[i].lane == 3) {
                CTX.fillStyle = "#FFFF00";
                CTX.fillRect(190, 1100+rt, 50, 25);
            } else if (notes[i].lane == 4) {
                CTX.fillStyle = "#FFFF00";
                CTX.fillRect(260, 1100+rt, 50, 25);
            }
        }
    }
    function judgement(event) { // Hit the notes and assign a judgement
        var key = event.key;    // Tested and working with Chords (multiple notes hit at once)
        switch (key) {
            case "a":
                var lane = 1;
                break;
            case "s":
                var lane = 2;
                break;
            case "l":
                var lane = 3;
                break;
            case ";":
                var lane = 4;
                break;
        }
        for (var note = 0; note < chart.length; note++) {
            var rt = gameTime - chart[note].time;
            if (rt < -200) { // Negative RT is early, Positive RT is late
                break;
            } else if (chart[note].lane != lane) { // Prevent keypress from affecting a different lane
                continue;
            } else if (rt <= 40 && rt >= -40) {
                perfect += 1;
                score += 3;
                health += 1
                delete chart[note];
                judgementText = rt.toFixed(0);
                break
            } else if (rt <= 80 && rt >= -80) {
                great += 1;
                score += 2;
                health += 0.5;
                judgementText = rt.toFixed(0);
                break
            } else if (rt <= 120 && rt >= -120) {
                ok += 1
                score += 1;
                judgementText = rt.toFixed(0);
                break
            } else if (rt <= 160 && rt >= -160) {
                miss += 1;
                health -= 5;
                judgementText = rt.toFixed(0);
                break
            }
            if (health > 100) {
                health = 100;
            }
        }
        chart = chart.filter(function(element) { // This code borrowed from StackOverflow
            return element !== undefined;        // https://stackoverflow.com/questions/28607451/removing-undefined-values-from-array
        });
        document.getElementById("score").innerText = score;
        document.getElementById("health").innerText = health;
    }
    
    renderNotes(chart)
    drawText("30px Courier", gameTime/1000, 50, 50, "white");
    
    
    document.getElementById("perfect").innerText = "PERFECT: " + perfect;
    document.getElementById("great").innerText = "GREAT: " + great;
    document.getElementById("ok").innerText = "OK: " + ok;
    document.getElementById("miss").innerText = "MISS: " + miss;

    if (gameTime > 250000 && health > 0) { // Game Clear
        document.getElementById("code").innerHTML = "Game finished. Enter this code in the central room.<br><br>cQ23AxtO<br><br><a href='../index.html'>Back to Central Room</a>"

    } else if (gameTime > 250000 && health < 0) { // Game Failed
        document.getElementById("code").innerText = "Game finished. Enter this code in the central room.\n\nEnZVwz2S"
    }

    drawText("30px Courier", judgementText, 20, 600, "white");
    requestAnimationFrame(gameLoop);
}

function preStartLoop() {
    let ready = false;
    drawText("30px Courier", "Press Enter for Normal Chart", 50, 50, "white");
    drawText("30px Courier", "Press H for Hard Chart", 50, 100, "white");
    let preStartListener = window.addEventListener("keydown", prepare); 
}

window.addEventListener("load", function () {
    preStartLoop(); // Automatically start the pre-start loop (wait for user to press enter) upon load
})
