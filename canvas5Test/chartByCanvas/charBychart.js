/*
    canvas:无法给隐藏的选项 进行绘制  可以考虑加上该选项  是否允许给hidden元素 添加
*/

"use strict";
(function() {

    var pro = ['setTransform', 'setAlpha', 'setCompositeOperation', 'setLineWidth', 'setLineCap', 'setLineJoin', 'setMiterLimit', 'setLineDash', 'setShadow', 'setStrokeColor', 'setFillColor', "fillStyle", "strokeStyle", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "createLinearGradient", "createPattern", "createRadialGradient", "addColorStop", "lineCap", "lineJoin", "lineWidth", "miterLimit", "rect", "fillRect", "strokeRect", "clearRect", "fill", "stroke", "beginPath", "moveTo", "closePath", "lineTo", "clip", "quadraticCurveTo", "bezierCurveTo", "arc", "arcTo", "isPointInPath", "scale", "rotate", "translate", "transform", "setTransform", "transform", "font", "textAlign", "textBaseline", "fillText", "strokeText", "measureText", "drawImage", "width", "height", "data", "createImageData", "getImageData", "putImageData", "globalAlpha", "globalCompositeOperation"];

    function XtendCanvas(canvas) {
        if(!canvas){
           throw 'please choose canvas';
        }

        var cxt = canvas.getContext('2d'),
            fn = function() {},
            fnP = fn.prototype;
        for (var j = 0, p = pro[0]; p; p = pro[j++]) {
            fn.prototype[p] = function(p) {
                return function() {
                    if(cxt[p]!==undefined){
                        var args = Array.prototype.slice.call(arguments);
                        if (typeof cxt[p] == 'function') {
                            cxt[p].apply(cxt, args);
                        } else {
                            cxt[p] = args+'';
                        }
                    }else{
                        console.log("不支持此属性"+cxt[p]);
                    }

                    return fnP;
                };
            }(p);
        }
        return new fn;
    }

    window.ctvChain = XtendCanvas;
})();

/*
*   TODO 1：增加_canvas链式调用
*/
(function($){

    var setting={
        x:0,
        y:0,
        width:10,
        height:10,
        fillStyle:'black',
        strokeStyle:'black',
        isFill:true,
        straAngle:0,
        radius:50,
        endAngle: Math.PI * 2,
        anticlockwise:true
    }

    function canvas(canvas){
        if(!canvas){
            throw 'please choose canvas';
        }
        this.cxt=new ctvChain(canvas);
    }

    canvas.prototype={
        Rect:function(opts){                // 矩形
            var self=this,
                getRect=function(fill){
                    self.cxt[fill+'Style'](opts.fillStyle)[fill+'Rect'](opts.x,opts.y,opts.width,opts.height);
                }

            opts=$.extend({},setting,opts);

            opts.isFill?getRect('fill'):getRect('stroke');

            return this;
        },
        Arc:function(opts){                 //圆形
            var self=this;

            opts= $.extend({},setting,opts);

            this.cxt.beginPath().arc(opts.x, opts.y, opts.radius, opts.straAngle, opts.endAngle,opts.anticlockwise).closePath().fillStyle(opts.fillStyle).fill();

            return this;
        },
        clear:function(opts){               //橡皮擦
            var self=this;

            opts=$.extend({},setting,opts);

            self.cxt.clearRect(opts.x,opts.y,opts.width,opts.height);

            return this;
        },
        line:function(lineFn,color){                 //线条
            var self=this;

            this.cxt.beginPath().strokeStyle(color||'black');
            lineFn.call(self.cxt,self.cxt);
            this.cxt.stroke();

            return this;
        },
        bezier:function(cp1x,cp1y,cp2x,cp2y,x,y,strokeStyle,close){              //贝塞尔曲线   http://lblovesnow-163-com.iteye.com/blog/1447918
            var self=this,
                getBezier=function(bezier){
                    self.cxt.strokeStyle(strokeStyle||'black').beginPath()[bezier+'CurveTo'](cp1x,cp1y,cp2x,cp2y,x,y)[close?'closePath':'stroke'].stroke();
                }

            if(x&&y){
                getBezier('bezier');
            }else{
                getBezier('quadratic');
            }
            return this;
        },
        shadow:function(OffsetX ,OffsetY,Color,Blur){              //阴影 必须放在 要设置 图形 前面
            var self=this;
            this.cxt.shadowOffsetX(OffsetX).shadowOffsetY(OffsetY).shadowColor(Color).shadowBlur(Blur);
            return this;
        },
        drawImg:function(image,sx,sy,sw,sh,dx,dy,dw,dh){
               var self=this,
                   img=new Image();
               img.src=image;
                $(img).load(function(){
                    self.cxt.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
                });

                return this;
        },
        repeatImg:function(image,type){    //createPattern   因为平铺操作 通常是用作 fillStyle作为参数  因此 不做此功能

            return this;
        },
        imgclip:function(){             //图片剪切   因为图片剪切 依赖因素过多 故不考虑 1:作出裁剪形状 2:drawImg 3:执行cxt.clip();
            return this;
        },
        save:function(){                //保存图像

        },
        restore:function(){             //回复保存图像

        },
        text:function(){                //文字操作

        },
        custom:function(customFn){              //自定义复杂动画   考虑到canvas 中许多需要复杂计算 故将这类假如到 自定义中
            var self=this;
            customFn.call(sell.cxt,self.cxt);
            return this;
        }
    };

    window._canvans = function(canvasDom){
        if(!canvasDom){
            throw 'please choose canvas';
        }

        return new canvas(canvasDom);
    }


})(jQuery)

