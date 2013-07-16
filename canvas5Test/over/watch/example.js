
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    startStopButton = document.getElementById('startStopButton'),
    secondsInput = document.getElementById('seconds'),

    CENTROID_RADIUS = 10,
    CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)',
    CENTROID_FILL_STYLE ='rgba(80, 190, 240, 0.6)',

    DEGREE_DIAL_MARGIN = 55,
    TRACKING_DIAL_MARGIN = 80,
    DEGREE_ANNOTATIONS_FILL_STYLE = 'rgba(0, 0, 230, 0.9)',
    GUIDEWIRE_FILL_STYLE = 'rgba(85, 190, 240, 0.8)',
    DEGREE_ANNOTATIONS_TEXT_SIZE = 18,
    DEGREE_OUTER_DIAL_MARGIN = DEGREE_DIAL_MARGIN,

    TICK_WIDTH = 15,
    TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, 0.9)',
    TICK_SHORT_STROKE_STYLE = 'rgba(100, 140, 230, 0.7)',

    TEXT_MARGIN = 135,

    TRACKING_DIAL_STROKING_STYLE = 'rgba(100, 140, 230, 0.5)',

    GUIDEWIRE_STROKE_STYLE = 'goldenrod',
    GUIDEWIRE_FILL_STYLE = 'rgba(0, 0, 230, 0.9)',
    circle = { x: canvas.width/2,
        y: canvas.height/2,
        radius: 150
    },

    timerSetting = 0,
    stopwatch = new Stopwatch();

function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left * (canvas.width  / bbox.width),
        y: y - bbox.top  * (canvas.height / bbox.height)
    };
}

function drawGrid(color, stepx, stepy) {
    ctx.save()

    ctx.shadowColor = undefined;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.strokeStyle = color;
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = stepx + 0.5; i < ctx.canvas.width; i += stepx) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, ctx.canvas.height);
        ctx.stroke();
    }

    for (var i = stepy + 0.5; i < ctx.canvas.height; i += stepy) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
    }

    ctx.restore();
}


function drawCentroid() {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = CENTROID_STROKE_STYLE;
    ctx.fillStyle = CENTROID_FILL_STYLE;
    ctx.arc(circle.x, circle.y, CENTROID_RADIUS, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

function drawHand(loc) {
    var initialAngle = -Math.PI/2 + (Math.PI / 180) * (timerSetting / 60 * 360),
        angle = initialAngle,
        stopwatchElapsed = stopwatch.getElapsedTime(),
        seconds,
        radius,
        endpt,
        rag=angle;

    if (stopwatchElapsed) {
        //rag = -Math.PI/2 + (Math.PI / 180) * ((timerSetting - stopwatchElapsed/1000) / 60 * 360),       //TODO 倒计时模式
            //seconds = parseFloat(timerSetting - stopwatchElapsed/1000).toFixed(2);
        rag = -Math.PI/2 + (Math.PI / 180) * ((-timerSetting*1000 + stopwatchElapsed/1000) / 60 * 360),
            seconds = parseFloat(timerSetting - stopwatchElapsed/1000).toFixed(2);
        if (seconds > 0) {
            secondsInput.value = seconds;
        }
    }
    radius = circle.radius + TRACKING_DIAL_MARGIN;

    if (loc.x >= circle.x) {
        endpt = { x: circle.x + radius * Math.cos(rag),
            y: circle.y + radius * Math.sin(rag)
        };
    }
    else {
        endpt = { x: circle.x - radius * Math.cos(rag),
            y: circle.y - radius * Math.sin(rag)
        };
    }
    ctx.save();

    ctx.strokeStyle = GUIDEWIRE_STROKE_STYLE;
    ctx.fillStyle = GUIDEWIRE_FILL_STYLE;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(circle.x, circle.y);
    ctx.lineTo(endpt.x, endpt.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(endpt.x, endpt.y, 7, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.fill();

    ctx.restore();
}

function drawDegreeAnnotations() {
    var radius = circle.radius + TEXT_MARGIN;

    ctx.save();
    ctx.fillStyle = DEGREE_ANNOTATIONS_FILL_STYLE;
    ctx.font = DEGREE_ANNOTATIONS_TEXT_SIZE + 'px Arial';

    for (var angle=Math.PI/2, i=0; i < 60; angle += Math.PI/6, i+=5) {
        ctx.beginPath();
        ctx.fillText(i,circle.x + Math.cos(angle-Math.PI) * (radius - TICK_WIDTH*2),circle.y + Math.sin(angle-Math.PI) * (radius - TICK_WIDTH*2));
    }
    ctx.restore();
}

function drawDegreeDialTicks() {
    var radius = circle.radius + DEGREE_DIAL_MARGIN,
        ANGLE_MAX = 2*Math.PI,
        ANGLE_DELTA = Math.PI/64;

    ctx.save();

    for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, ++cnt) {
        ctx.beginPath();

        if (cnt % 4 === 0) {
            ctx.moveTo(circle.x + Math.cos(angle) * (radius - TICK_WIDTH),circle.y + Math.sin(angle) * (radius - TICK_WIDTH));
            ctx.lineTo(circle.x + Math.cos(angle) * (radius),circle.y + Math.sin(angle) * (radius));
            ctx.strokeStyle = TICK_LONG_STROKE_STYLE;
            ctx.stroke();
        }else {
            ctx.moveTo(circle.x + Math.cos(angle) * (radius - TICK_WIDTH/2),circle.y + Math.sin(angle) * (radius - TICK_WIDTH/2));
            ctx.lineTo(circle.x + Math.cos(angle) * (radius),circle.y + Math.sin(angle) * (radius));
            ctx.strokeStyle = TICK_SHORT_STROKE_STYLE;
            ctx.stroke();
        }

        ctx.restore();
    }
}


function drawDial() {
    var loc = {x: circle.x, y: circle.y};

    drawCentroid();

    //内环
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowOffsetX = 3,
    ctx.shadowOffsetY = 3,
    ctx.shadowBlur = 6,
    ctx.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius +TRACKING_DIAL_MARGIN, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.arc(circle.x, circle.y,circle.radius + DEGREE_OUTER_DIAL_MARGIN,0, Math.PI*2, false);
    ctx.stroke();
    ctx.fillStyle = 'rgba(218, 165, 35, 0.2)';
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.arc(circle.x, circle.y,circle.radius + DEGREE_DIAL_MARGIN - TICK_WIDTH, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.restore();

   drawDegreeDialTicks();
   drawDegreeAnnotations();
   drawHand(loc);
}

drawGrid('lightgray', 10, 10);

if (navigator.userAgent.indexOf('Opera') === -1){
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
}


ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
ctx.shadowBlur = 4;

ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

drawDial();

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid('lightgray', 10, 10);
    drawDial();
}


function animate() {
    if (stopwatch.isRunning() &&stopwatch.getElapsedTime() > timerSetting*1000) { // animation is over
        stopwatch.stop();
        startStopButton.value = 'Start';
        secondsInput.disabled = false;
        secondsInput.value = 0;
    }
    else if (stopwatch.isRunning()) { // animation is running
        redraw();
        requestNextAnimationFrame(animate);
    }
}

startStopButton.onclick = function (e) {
    var value = startStopButton.value;
    if (value === 'Start') {
        stopwatch.start();
        startStopButton.value = 'Stop';
        requestNextAnimationFrame(animate);
        secondsInput.disabled = true;
    }else {
        stopwatch.stop();
        timerSetting = parseFloat(secondsInput.value);
        startStopButton.value = 'Start';
        secondsInput.disabled = false;
    }
    stopwatch.reset();
};

secondsInput.onchange = function (e) {
    timerSetting = parseFloat(secondsInput.value);
    redraw();
};
