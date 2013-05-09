
(function() {
	var pro = ['setTransform', 'setAlpha', 'setCompositeOperation', 'setLineWidth', 'setLineCap', 'setLineJoin', 'setMiterLimit', 'setLineDash', 'setShadow', 'setStrokeColor', 'setFillColor', "fillStyle", "strokeStyle", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "createLinearGradient", "createPattern", "createRadialGradient", "addColorStop", "lineCap", "lineJoin", "lineWidth", "miterLimit", "rect", "fillRect", "strokeRect", "clearRect", "fill", "stroke", "beginPath", "moveTo", "closePath", "lineTo", "clip", "quadraticCurveTo", "bezierCurveTo", "arc", "arcTo", "isPointInPath", "scale", "rotate", "translate", "transform", "setTransform", "transform", "font", "textAlign", "textBaseline", "fillText", "strokeText", "measureText", "drawImage", "width", "height", "data", "createImageData", "getImageData", "putImageData", "globalAlpha", "globalCompositeOperation"];
	//bak = ['setTransform','setAlpha', 'setCompositeOperation', 'setLineWidth', 'setLineCap', 'setLineJoin', 'setMiterLimit', 'setLineDash','setShadow','setStrokeColor','setFillColor'];

	function XtendCanvas(canvas) {
		var ctx = canvas.getContext('2d'),
			fn = function() {},
			fnP = fn.prototype;
		for (var j = 0, p = pro[0]; p; p = pro[j++]) {
			if (ctx[p]) {
				fn.prototype[p] = function(p) {
					return function() {
						var args = Array.prototype.slice.call(arguments);
						// console.log(args);
						if (typeof ctx[p] == 'function') {
							ctx[p].apply(ctx, args);
						} else {
							ctx[p] = args + '';
						}
						return fnP;
					};
				}(p);
			}
		}
		return new fn;
	};
	window.XtendCanvas = XtendCanvas;
})();

/*
	使用:
	var canvas=document.getElementById('canvas'),
		content=XtendCanvas(canvas);
	content.moveTo(500,0).lineTo(500,500).strokeStyle('#f00').stroke();
*/