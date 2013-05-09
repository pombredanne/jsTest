(function() {
    "use strict";

    var pro = ['setTransform', 'setAlpha', 'setCompositeOperation', 'setLineWidth', 'setLineCap', 'setLineJoin', 'setMiterLimit', 'setLineDash', 'setShadow', 'setStrokeColor', 'setFillColor', "fillStyle", "strokeStyle", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "createLinearGradient", "createPattern", "createRadialGradient", "addColorStop", "lineCap", "lineJoin", "lineWidth", "miterLimit", "rect", "fillRect", "strokeRect", "clearRect", "fill", "stroke", "beginPath", "moveTo", "closePath", "lineTo", "clip", "quadraticCurveTo", "bezierCurveTo", "arc", "arcTo", "isPointInPath", "scale", "rotate", "translate", "transform", "setTransform", "transform", "font", "textAlign", "textBaseline", "fillText", "strokeText", "measureText", "drawImage", "width", "height", "data", "createImageData", "getImageData", "putImageData", "globalAlpha", "globalCompositeOperation"];

    function XtendCanvas(canvas) {
        var ctx = canvas.getContext('2d'),
            fn = function() {},
            fnP = fn.prototype;
        for (var j = 0, p = pro[0]; p; p = pro[j++]) {
            if (ctx[p]!==undefined){
                fn.prototype[p] = function(p) {
                    return function() {
                        var args = Array.prototype.slice.call(arguments);
                        // console.log(args);
                        if (typeof ctx[p] == 'function') {
                            ctx[p].apply(ctx, args);
                        } else {
                            ctx[p] = args+'';
                        }
                        return fnP;
                    };
                }(p);
            }
        }
        return new fn;
    }

    window.ctvChain = XtendCanvas;
})();

(function($){
    function _canvas(canvas){
        this.ctx=new ctvChain(canvas);
    }
    _canvas.prototype.Rect=function(){           // 矩形

    }

    _canvas.prototype.Arc=function(){             //圆形

    }

    _canvas.prototype.clear=function(){           //橡皮擦

    }

    _canvas.prototype.line=function(){             //线条

    }

    _canvas.prototype.save=function(){              //保存图像

    }

    _canvas.prototype.restore=function(){           //回复保存图像

    }

    _canvas.prototype.imgclip=function(){           //图片剪切

    }

    _canvas.prototype.text=function(){              //文字操作

    }

})(jQuery)

