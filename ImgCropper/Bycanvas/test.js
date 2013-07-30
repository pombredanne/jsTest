var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    ctx1=cacheCanvas.getContext('2d'),
    image = new Image(),
    imageData,
    mousedown = {},
    range = {},
    dragging = false,
    windowToCanvas=function(canvas,x,y){
        var canvasRectangle = canvas.getBoundingClientRect();
        return {
            x: x - canvasRectangle.left,
            y: y - canvasRectangle.top
        };
    },
    redrawStart=function(x,y){
        mousedown.x = x;
        mousedown.y = y;
        range.left = x;
        range.top = y;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        dragging = true;
    },
    redrawEnd=function(){
        ctx1.drawImage(canvas,
            range.left + ctx.lineWidth * 2,
            range.top + ctx.lineWidth * 2,
            range.width - 4 * ctx.lineWidth,
            range.height - 4 * ctx.lineWidth,
            0, 0, canvas.width, canvas.height);

        var src = $('#cacheCanvas')[0].toDataURL("image/png");
        $('#test').attr('src', src);
        dragging = false;
        imageData = undefined;
    },
    getImageData=function(){
        imageData = ctx.getImageData(range.left,range.top,range.width,range.height);
    },
    setRange=function(x,y){
        range.left = Math.min(x, mousedown.x);
        range.top = Math.min(y, mousedown.y);
        range.width = Math.abs(x - mousedown.x),
        range.height = Math.abs(y - mousedown.y);
    },
    drawRubberband=function(){
        ctx.strokeRect(range.left + ctx.lineWidth,range.top + ctx.lineWidth,range.width - 2 * ctx.lineWidth,range.height - 2 * ctx.lineWidth);
    },
    putImageData=function(){
        var deviceWidthOverCSSPixels = imageData.width / range.width,
            deviceHeightOverCSSPixels = imageData.height / range.height;

        ctx.putImageData(imageData,range.left * deviceWidthOverCSSPixels,range.top * deviceHeightOverCSSPixels);
    },
    rubberbandStretch=function(x,y){
        var _range=function(){
            return range.width > 2 * ctx.lineWidth &&range.height > 2 * ctx.lineWidth;
        };
        (_range() && imageData !== undefined) && putImageData();
        setRange(x, y);
        (_range()) && updateRubberband();
    },
    updateRubberband=function(){
        getImageData();
        drawRubberband();
    };

canvas.onmousedown = function(e) {
    e=e||window.event;
    var loc = windowToCanvas(canvas, e.clientX, e.clientY);
    e.preventDefault?(e.preventDefault()):(window.event.returnValue = false);
    redrawStart(loc.x, loc.y);
};

canvas.onmousemove = function(e) {
    if (dragging) {
        e=e||window.event;
        var loc;
        loc = windowToCanvas(canvas, e.clientX, e.clientY);
        rubberbandStretch(loc.x, loc.y);
    }
}

canvas.onmouseup = function(e) {
    redrawEnd();
};

image.src = 'test.jpg';
image.onload = function() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};
ctx.strokeStyle = 'yellow';
ctx.lineWidth = 2.0;