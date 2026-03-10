let chart = [];
let gameTime = 0;
const CANVAS = document.getElementById("canvas")
function Note(time, lane, speed = 1) {
    this.time = time; // Time in ms when the note should be hit
    this.lane = lane; // The lane in which the note appears
    this.speed = speed; // (Optional) An extra multiplier on top of the default speed
}

function loadChart(chartID, bpm) {

}
function drawText(font, content, x, y, color) {
    // Note: Font should be "Sizepx FontName". Ex.: "30px Arial" "15px Verdana"
    const C = document.getElementById("canvas");
    const CTX = C.getContext("2d");
    CTX.font = font;
    CTX.fillStyle = color;
    CTX.fillText(content, x, y);
    CTX.fillStyle = "white";
}

function gameLoop() {
    const C = document.getElementById("canvas");
    const CTX = C.getContext("2d");
    function renderUI() {
        
    }

    function renderNotes(notes) {
        // Canvas is 675*1200
        // Render note functions depending on lane (let rt be the automatically calculated time ahead of the note):
        // Ln.1: CTX.rect(50, 1100+rt, 50, 25)
        // Ln.2: CTX.rect(120, 1100+rt, 50, 25)
        // Ln.3: CTX.rect(190, 1100+rt, 50, 25)
        // Ln.4: CTX.rect(260, 1100+rt, 50, 25)
        // Notes move down as their Y increases
        for (let i = 0; i < notes.length; i++) {
            let rt = notes[i].time - gameTime;
            if (notes[i].time + 1500 > gameTime) {
                break;
            } else if (notes[i].lane = 1) {
                CTX.rect(50, 1100+rt, 50, 25);
            } else if (notes[i].lane = 2) {
                CTX.rect(120, 1100+rt, 50, 25);
            } else if (notes[i].lane = 3) {
                CTX.rect(190, 1100+rt, 50, 25);
            } else if (notes[i].lane = 4) {
                CTX.rect(260, 1100+rt, 50, 25);
            }
        }
    }

}

function preStartLoop() {

    drawText("30px Courier", "Press Enter", 50, 50, "black")
}

window.addEventListener("load", function () {
    preStartLoop()
})
