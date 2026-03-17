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

function prepare() { // Prepare to start the game
    console.log("Ready to start");
    window.removeEventListener("keydown", prepare); // Remove the event listener to avoid prepare()-ing multiple times
    setInterval(gameLoop, 20);
    let AUDIO = new Audio("../media/audio.mp3");
    AUDIO.play();
}

let eventListenerAdded = false;

function gameLoop() { // 50FPS game loop
    if (!eventListenerAdded) {
        window.addEventListener("keydown", judgement(event));
        let perfect = 0;
        let great = 0;
        let ok = 0;
        let miss = 0;
        eventListenerAdded = true;
    }

    CTX.fillStyle = "black";
    CTX.fillRect(0, 0, canvas.width, canvas.height);
    CTX.fillStyle = "white";
    gameTime += 20;
    let score = 0;

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
                notes.shift();
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
        console.log(event)
        var key = event.key;
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
        for (var note = 0; note < notes.length; note++) {
            var rt = gameTime - notes[note].time;
            if (rt < -200) { // Negative RT is early, Positive RT is late
                break;
            } else if (notes[note].lane != lane) { // Prevent keypress from affecting a different lane
                continue;
            } else if (rt <= 60 && rt >= -60) {
                perfect += 1;
                score += (1_000_000 / notes.length) * 1;
                break
            } else if (rt <= 120 && rt >= -120) {
                great += 1;
                score += (1_000_000 / notes.length) * 0.8;
                break
            } else if (rt <= 180 && rt >= -180) {
                ok += 1
                score += (1_000_000 / notes.length) * 0.5;
                break
            } else if (rt <= 240 && rt >= -240) {
                miss += 1
                break
            }
        }
    }
    
    renderNotes(chart)
    drawText("30px Courier", gameTime/1000, 50, 50, "white");
    document.getElementById("score").innerText = Math.round(score);
}

function preStartLoop() {
    let ready = false;
    drawText("30px Courier", "Press Enter", 50, 50, "white");
    let preStartListener = window.addEventListener("keydown", prepare); 
}

window.addEventListener("load", function () {
    preStartLoop(); // Automatically start the pre-start loop (wait for user to press enter) upon load
})
