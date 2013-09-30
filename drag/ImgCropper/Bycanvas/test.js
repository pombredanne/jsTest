$(function(){
    /*
        TODO 不推荐使用此方法  draw操作太耗费了
     */
    "use strict";
    var canvas = document.getElementById('canvas'),
        canvas1=document.getElementById('cacheCanvas'),
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
            $('#rubberbandDiv').hide();
        },
        redrawEnd=function(){
            var left=range.left,
                top=range.top,
                width=range.width - 4 * ctx.lineWidth,
                height=range.height - 4 * ctx.lineWidth;
            ctx1.drawImage(
                canvas,
                left + ctx.lineWidth * 2,
                top + ctx.lineWidth * 2,
                width,
                height,
                0, 0, canvas.width, canvas.height
            );
            $('#rubberbandDiv').css({
                display:'block',
                left:left+canvas.offsetLeft,
                top:top+canvas.offsetTop,
                width:width,
                height:height
            });
            var src = canvas1.toDataURL("image/png");
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

    var bDrag=false,
        disX,
        disY;
    $('#rubberbandDiv').mousedown(function(event){
        bDrag = true;
        disX = event.clientX - this.offsetLeft;
        disY = event.clientY - this.offsetTop;
        this.setCapture && this.setCapture();
        window.captureEvents && window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP); //http://blog.sina.com.cn/s/blog_695bab300100v0j0.html
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        return false
    });

    $(document).mousemove(function(event){
        if (!bDrag){return;}

        var iL = event.clientX - disX,
            iT = event.clientY - disY,
            $dom=$('#rubberbandDiv'),
            maxL = document.documentElement.clientWidth - $dom[0].offsetWidth,
            maxT = document.documentElement.clientHeight - $dom[0].offsetHeight;

        //  TODO 最大范围
        iL = iL < 0 ? 0 : iL;
        iL = iL > maxL ? maxL : iL;

        iT = iT < 0 ? 0 : iT;
        iT = iT > maxT ? maxT : iT;

        $dom.offset({
            left:iL,
            top:iT
        });

        ctx1.drawImage(     // TODO 从这里看出 drawImage 操作非常耗费内存 所以 这种技术 根本没有推广的必要 放弃之
            canvas,
            iL + ctx.lineWidth * 2,
            iT + ctx.lineWidth * 2,
            $dom.width(),
            $dom.height(),
            0, 0, canvas.width, canvas.height
        );
        var src = canvas1.toDataURL("image/png");
        $('#test').attr('src', src);

        return false
    });

    var blur=function(){
        bDrag = false;
        $('#rubberbandDiv')[0].releaseCapture && $('#rubberbandDiv')[0].releaseCapture();
        window.releaseEvents && window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        return false;
    };
    $(document).mouseup(function(event){
        blur(event);
    });

    $(window).blur(function(event){
        blur(event);
    });

    $('#rubberbandDiv').bind('losecapture',function(event){
        blur(event.originalEvent);
    });

});
