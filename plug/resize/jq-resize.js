/*!
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */


/*
	TODO  
	1:kqieru 1.5以后 会出现自动冒泡现象 程序员应防止这一点.  如想彻底杜绝 按照add函数中 设置
	2:设置对象 注意项  var b='fdfd';  var k={b:4}; console.log(k.fdfd) //  undefined  应设置为 k[b]=4;
	3:jquery  $.data  $._data()(jquery 1.5)  必须为dom元素
	4: 浏览器滚轮放大缩小页面  对 resize 影响情况:
		{
			chrome 29dev:  dom  window
			firefox 22: dom  (WIN平台: firefox:22: dom window)
			ie(ie11暂未测试): dom window
		}
	5:  resize默认只针对 window  并且window的resize 会在一次改变 触发两次resize  解决办法:
		1) settimeout:
			var resizeTimer = null;
			$(window).resize(function() {
			    if (resizeTimer) clearTimeout(resizeTimer);
			    resizeTimer = setTimeout("alert('mm')", 500);
			});
		2)  var 变量:
			var n=0;
			$(window).resize(function(){
			    if(n%2==0){
			        alert("mm");
			    }
			    n++;  // 或者判断true false
			});

    一个类似判断浏览器是否ctrl+0 滚轮放大的插件 通过判断按键的which
        ---  http://mlntn.com/2008/12/11/javascript-jquery-zoom-event-plugin/
*/
(function($, window, undefined) {
	'$:nomunge'; // Used by YUI compressor.

	var elems = $([]),
		jq_resize = $.resize = $.extend($.resize, {}),
		timeout_id,
		str_setTimeout = 'setTimeout',
		str_resize = 'resize',
		str_data = str_resize + '-special-event',
		str_delay = 'delay',
		str_throttle = 'throttleWindow';

	jq_resize[str_delay] = 250;
	jq_resize[str_throttle] = true;

	$.event.special[str_resize] = {

		setup: function() {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}
			var elem = $(this);
			elems = elems.add(elem);
			$.data(this, str_data, {
				w: elem.width(),
				h: elem.height()
			});
			(elems.length === 1)&&(loopy());
		},
		teardown: function() {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}
			var elem = $(this);
			elems = elems.not(elem);
			elem.removeData(str_data);
			if (!elems.length) {
				clearTimeout(timeout_id);
			}
		},
		add: function(handleObj) {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}
			var old_handler;
			function new_handler(e, w, h) {
				var elem = $(this),
					data = $.data(this, str_data);
				data.w = w !== undefined ? w : elem.width();
				data.h = h !== undefined ? h : elem.height();
				old_handler.apply(this, arguments);
				//e.stopPropagation();		// jquery 1.5 以后会出现冒泡
			};
			if ($.isFunction(handleObj)) {
				old_handler = handleObj;
				return new_handler;
			} else {
				old_handler = handleObj.handler;
				handleObj.handler = new_handler;
			}
		}

	};

	function loopy() {
		timeout_id = window[str_setTimeout](function() {
			elems.each(function() {
				var elem = $(this),
					width = elem.width(),
					height = elem.height(),
					data = $.data(this, str_data);
				if (width !== data.w || height !== data.h) {
					elem.trigger(str_resize, [data.w = width, data.h = height]);
				}
			});
			loopy();
		}, jq_resize[str_delay]);
	};
})(jQuery, this);
