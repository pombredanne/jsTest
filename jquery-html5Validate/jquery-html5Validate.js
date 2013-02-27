/*! jquery-html5Validate.js 基于HTML5表单验证的jQuery插件
 * 支持type="email", type="number", type="tel", type="url", type="zipcode", 以及多type, 如type="email|tel". 支持 step, min, max, required, pattern, multiple
 * 有4个自定义扩展属性 data-key, data-target, data-min, data-max
 * 文档：http://www.zhangxinxu.com/wordpress/?p=2857
 * 如果您有任何问题，可以邮件至zhangxinxu@zhangxinxu.com
 * create by zhangxinxu 2012-12-05   
 * v1.0 beta
 		on 2012-12-05 创建
 		on 2012-12-06 兼容性调试
		on 2012-12-14 增加对multiple属性支持
		              testRemind方法的最大宽度限制
		on 2012-12-17 增加submitEnabled参数
		on 2012-12-19 暴露testRemind方法的CSS参数
		on 2012-12-20 testRemind尖角设置overflow: hidden for IE6
	v1.0 publish on 2012-12-20
	v1.2 on 2012-12-21 尖角实际高度可能覆盖单复选框的问题，做了高度限制处理
**/
(function($, undefined) {

	var DBC2SBC = function(str) {   // 全角半角转换
		var result = '', i, code,length;
		for (i=0 ,length=str.length; i<length; i++) {
			code = str.charCodeAt(i);
			if (code >= 65281 && code <= 65373) {
				result += String.fromCharCode(str.charCodeAt(i) - 65248);
			} else if (code === 12288) {
				result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
			} else {
				result += str.charAt(i);
			}
		}
		return result;
	};
	
	// 自定义提示隐藏、绑定事件以及解绑事件
	$.testRemind = (function() {
		var winWidth = $(window).width();
		var fnMouseDown = function(e) {
			if (!e || !e.target) return;
			if (e.target.id !== $.testRemind.id && $(e.target).parents("#" + $.testRemind.id).length === 0) {
				$.testRemind.hide();
			}	
		}, fnKeyDown = function(e) {
			if (!e || !e.target) return;
			if (e.target.tagName.toLowerCase() !== "body") {
				$.testRemind.hide();
			}
		}, funResize = function() {
			if (!$.testRemind.display) return;
			var nowWinWidth = $(window).width();
			if (Math.abs(winWidth - nowWinWidth) > 20) {
				$.testRemind.hide();
				winWidth = nowWinWidth;
			}
		};
		return {
			id: "validateRemind",
			display: false,
			css: {},
			hide: function() {
				$("#" + this.id).remove();
				this.display = false;
				$(document).unbind({
					mousedown: 	fnMouseDown,
					keydown: fnKeyDown
				});
				$(window).unbind("resize", funResize);
			},
			bind: function() {
				$(document).bind({
					mousedown: 	fnMouseDown,
					keydown: fnKeyDown
				});
				$(window).bind("resize", funResize);
			}
		};		
	})();
	
	// 全局对象，可扩展
	OBJREG = {
		EMAIL:"^[a-z0-9._%-]+@([a-z0-9-]+\\.)+[a-z]{2,4}$",
		NUMBER: "^\\-?\\d+(\\.\\d+)?$",
		URL:"^(http|https|ftp)\\:\\/\\/[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$",
		TEL:"^1\\d{10}$",
		ZIPCODE:"^\\d{6}$",
		"prompt": {
			radio: "请选择一个选项",
			checkbox: "如果要继续，请选中此框",
			"select": "请选择列表中的一项",
			email: "请输入电子邮件地址",
			url: "请输入网站地址",
			tel: "请输入手机号码",
			number: "请输入数值",
			date: "请输入日期",
			pattern: "内容格式不符合要求",
			empty: "请填写此字段",
			multiple: "多条数据使用逗号分隔"
		}	
	};
	
	$.html5Attr = function(ele, attr) {	//获取html5专属的一些属性 主要指type
	    if(!ele || !attr){
	    		return undefined
	    } 
         return ele.getAttribute(attr);
	};

	$.html5Validate = (function() {	
		return {
			isSupport: (function() {		//是否支持html5专属标签
				return $('<input type="email">').attr("type") === "email";	
			})(),
			isEmpty: function(ele, value) {	//是否为空?
				value = value || $.html5Attr(ele, "placeholder");
				var trimValue = ele.value;
				(ele.type !== "password") && (trimValue = $.trim(trimValue));
				if (trimValue === "" || trimValue === value){return true;}
				return false;	
			},
			isRegex: function(ele, regex, params) {	//是否为
				// 原始值和处理值
				var inputValue = ele.value,
                      dealValue = inputValue, 
                      type = ele.getAttribute("type") + "";

				type = type.replace(/\W+$/, "");
				
				if (type !== "password") {
					dealValue = DBC2SBC($.trim(inputValue));
					(dealValue !== inputValue) && (ele.value=dealValue);
				}
		
				// 获取正则表达式，pattern属性获取优先，然后通过type类型匹配。注意，不处理为空的情况
				regex=regex || $.html5Attr(ele, "pattern")||(function() {
					// 文本框类型处理，可能有管道符——多类型重叠，如手机或邮箱
					return type && $.map(type.split("|"), function(typeSplit) {
						var matchRegex = OBJREG[typeSplit.toUpperCase()];
						if (matchRegex){return matchRegex;}
					}).join("|");	
				})();
				
				if (dealValue === "" || !regex){return true};
				
				// multiple多数据的处理
				var isMultiple = $(ele).hasProp("multiple"), newRegExp = new RegExp(regex, params || 'i');
				// number类型下multiple是无效的
				if (isMultiple && !/^number|range$/i.test(type)) {
					var isAllPass = true;
					$.each(dealValue.split(","), function(i, partValue) {
						partValue = $.trim(partValue);
						if (isAllPass && !newRegExp.test(partValue)) {
							isAllPass = false;
						}
					});
					return isAllPass;
				} else {
					return newRegExp.test(dealValue);	
				}
				return true;
			},
			isOverflow: function(ele) {
				if (!ele){return false;}
				//  大小限制
				var attrMin = $(ele).attr("min"), 
				    attrMax = $(ele).attr("max"),
				    attrStep,
				    attrDataMin, 
				    attrDataMax,
				    value = ele.value;
					
				if (!attrMin && !attrMax) {
					attrDataMin = $(ele).attr("data-min"), attrDataMax = $(ele).attr("data-max");
					if (attrDataMin && value.length < attrDataMin) {
						$(ele).testRemind("至少输入" + attrDataMin + "个字符");
						ele.focus();
					} else if (attrDataMax && value.length > attrDataMax) {
						$(ele).testRemind("最多输入" + attrDataMax + "个字符");
						$(ele).selectRange(attrDataMax, value.length);
					} else {
						return false;	
					}
				} else {
					// 数值大小限制
					value -=0;
					attrStep = ($(ele).attr("step"))-0 || 1;
					if (attrMin && value < attrMin) {
						$(ele).testRemind("值必须大于或等于" + attrMin);	
					} else if (attrMax && value > attrMax) {
						$(ele).testRemind("值必须小于或等于" + attrMax);	
					} else if (attrStep && !/^\d+$/.test(Math.abs((value - attrMin || 0)) / attrStep)) {
						$(ele).testRemind("值无效");	
					} else {
						return false;	
					}
					ele.focus();
					ele.select();
				}
				return true;
			},
			isAllpass: function(elements, options) {
				if (!elements){return true};
				var defaults = {
					// 优先label标签作为提示文字
					labelDrive: true
				};
				params = $.extend({}, defaults, options || {});
				var isFrom=elements[0].tagName.toLowerCase()||elements.tagName.toLowerCase();
				if ( isFrom === "form") {
					elements =$(elements).find(":input")||elements.find(":input");
				}

				var self = this,
					allpass = true,
					remind = function(control, type, tag) {
					var key = $(control).attr("data-key"), label = $("label[for='"+ control.id +"']"), text= '', placeholder;
					
					if (params.labelDrive) {
						placeholder = $.html5Attr(control, "placeholder");
						//label.each(function() {
							var txtLabel = label.text();
							if (txtLabel !== placeholder) {
								text += txtLabel.replace(/\*|:|：/g, "");
							}
						//});
					}
					
					// 如果元素完全显示
					if ($(control).isVisible()) {
						if (type == "radio" || type == "checkbox") {
							$(control).testRemind(OBJREG.prompt[type], {
								align: "left"	
							});
							control.focus();
						} else if (tag == "select" || tag == "empty") {
							// 下拉值为空或文本框文本域等为空
							$(control).testRemind((tag == "empty" && text)? "您尚未输入"+ text : OBJREG.prompt[tag]);
							control.focus();
						} else if (/^range|number$/i.test(type) && Number(control.value)) {
							// 整数值与数值的特殊提示
							$(control).testRemind("值无效");
							control.focus();
							control.select();
						} else {
							// 文本框文本域格式不准确
							// 提示文字的获取	
							var finalText = OBJREG.prompt[type] || OBJREG.prompt["pattern"];
							if (text) {
								finalText = "您输入的"+ text +"格式不准确";
							}
							if (type != "number" && $(control).hasProp("multiple")) {
								finalText += "，" + OBJREG.prompt["multiple"];
							}
							
							$(control).testRemind(finalText);
							control.focus();
							control.select();	
						}			
					} else {
						// 元素隐藏，寻找关联提示元素, 并走label提示流(radio, checkbox除外)
						var selector = $(control).attr("data-target");
						var target = $("#" + selector);
						if (target.size() == 0) {
							target = $("." + selector);
						}
						var customTxt = "您尚未" + (key || (tag == "empty"? "输入": "选择")) + ((!/^radio|checkbox$/i.test(type) && text) || "该项内容");
						if (target.size()) {
							target.testRemind(customTxt);
						} else {
							alert(customTxt);	
						}
					}
					return false;
				};
				
				elements.each(function(){
					var el = this, type = el.getAttribute("type"), tag = el.tagName.toLowerCase(), isRequired = $(this).hasProp("required");
					// type类型
					if (type) {
						var typeReplace = type.replace(/\W+$/, "");	
						if (!params.hasTypeNormally && $.html5Validate.isSupport && type != typeReplace) {
							// 如果表单元素默认type类型保留，去除某位空格或管道符
							try { el.type = typeReplace; } catch(e) {}
						}
						type = typeReplace;
					}
					
					if (allpass == false || el.disabled || type == 'submit' || type == 'reset' || type == 'file' || type == 'image') return;
					// 需要验证的有
					// input文本框, type, required, pattern, max, min以及自定义个数限制data-min, data-max
					// radio, checkbox
					// select
					// textarea
					// 先从特殊的下手，如单复选框	
					if (type == "radio" && isRequired) {
						// 单选框，只需验证是否必选，同一name单选组只有要一个设置required即可
						var eleRadios = el.name? $("input[type='radio'][name='"+ el.name +"']"): $(el)
							, radiopass = false;
							
						eleRadios.each(function() {
							if (radiopass == false && $(this).attr("checked")) {
								radiopass = true;
							}
						});
						
						if (radiopass == false) {
							allpass = remind(eleRadios.get(0), type, tag);
						}
					} else if (type == "checkbox" && isRequired && !$(el).attr("checked")) {
						// 复选框是，只有要required就验证，木有就不管
						allpass = remind(el, type, tag);
					} else if (tag == "select" && isRequired && !el.value) {
						// 下拉框只要关心值
						allpass = remind(el, type, tag);
					} else if ((isRequired && self.isEmpty(el)) || !(allpass = self.isRegex(el))) {
						// 各种类型文本框以及文本域
						// allpass为true表示是为空，为false表示验证不通过
						allpass? remind(el, type, "empty"): remind(el, type, tag);
						allpass = false;
					} else if (self.isOverflow(el)) {
						// 最大值最小值, 个数是否超出的验证
						allpass = false;
					}
				});
				
				return allpass;
			}
		};
	})();
	
	$.fn.extend({
		isVisible: function() {	
			return $(this).attr("type") !== "hidden" && $(this).css("display") !== "none" && $(this).css("visibility") !== "hidden";
		},
		hasProp: function(prop) {
			if (typeof prop !== "string"){return undefined;}
			var hasProp = false;
			if (document.querySelector) {
				var attrProp = $(this).attr(prop);
				if (attrProp !== undefined && attrProp !== false) {
					hasProp = true;
				}
			} else {
				// IE6, IE7
				var outer = $(this)[0].outerHTML, part = outer.slice(0, outer.search(/\/?['"]?>(?![^<]*<['"])/));
				hasProp = new RegExp("\\s" + prop + "\\b", "i").test(part);
			}
			return hasProp;
		},
		selectRange: function(start, end) {
			if (document.all) {
				var range = this.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			} else {
				this.focus();
				this.setSelectionRange(start, end);
			}
			return this;
		},
		testRemind: function(content, options) {
			var defaults = {
				size: 6,	// 三角的尺寸
				align: "center",	//三角的位置，默认居中
				css: {
					maxWidth: 280,
					backgroundColor: "#FFFFE0",
					borderColor: "#F7CE39",
					color: "#333",
					fontSize: "12px",
					padding: "5px 10px",
					zIndex: 202
				}
			};
			
			options = options || {};
			options.css = $.extend({}, defaults.css, options.css || $.testRemind.css);
			
			var params = $.extend({}, defaults, options || {});
			
			// 如果元素不可见，不处理
			if (!content || !$(this).isVisible()) return;
			
			var objAlign = {
				"center": "50%",
				"left": "15%",
				"right": "85%"	
			}, align = objAlign[params.align] || "50%";
			
			params.css.position = "absolute";
			params.css.top = "-99px";
			params.css.border = "1px solid " + params.css.borderColor;
			
			if ($("#" + $.testRemind.id).size()) $.testRemind.hide();
			
			this.remind = $('<div id="'+ $.testRemind.id +'">'+ content +'</div>').css(params.css);
			$(document.body).append(this.remind);
			
			// IE6 max-width的处理
			var maxWidth;
			if (!window.XMLHttpRequest && (maxWidth = parseInt(params.css.maxWidth)) && this.remind.width() > maxWidth) {
				 this.remind.width(maxWidth);	
			}
			
			// 当前元素的位置，提示框的方向
			var offset = $(this).offset(), direction = "top";
			if (!offset) return $(this);
			var remindTop = offset.top - this.remind.outerHeight() - params.size;
			if (remindTop < $(document).scrollTop()) {
				direction = "bottom";
				remindTop = offset.top + $(this).outerHeight() + params.size;
			}	
			
			// 创建三角
			var fnCreateCorner = function(beforeOrAfter) {
				// CSS名称值与变量，主要用来mini后节约文件大小
				var transparent = "transparent", dashed = "dashed", solid = "solid";
				
				// CSS样式对象们
				var cssWithDirection = {}, cssWithoutDirection = {
					// 与方向无关的CSS
					//left: align,
					width: 0,
					height: 0,
					overflow: "hidden",
					//marginLeft: (-1 * params.size) + "px",
					borderWidth: params.size + "px",
					position: "absolute"
				}, cssFinalUsed = {};
				
				// before颜色为边框色
				// after为背景色
				// 方向由direction决定
				if (beforeOrAfter === "before") {
					cssWithDirection = {
						"top": {
							borderColor: [params.css.borderColor, transparent, transparent, transparent].join(" "),
							borderStyle: [solid, dashed, dashed, dashed].join(" "),
							top: 0
						},
						"bottom": {
							borderColor: [transparent, transparent, params.css.borderColor, ""].join(" "),
							borderStyle: [dashed, dashed, solid, dashed].join(" "),
							bottom: 0
						}	
					};	
				} else if (beforeOrAfter === "after") {
					cssWithDirection = {
						"top": {
							borderColor: params.css.backgroundColor + ["", transparent, transparent, transparent].join(" "),
							borderStyle: [solid, dashed, dashed, dashed].join(" "),
							top: -1
						},
						"bottom": {
							borderColor: [transparent, transparent, params.css.backgroundColor, ""].join(" "),
							borderStyle: [dashed, dashed, solid, dashed].join(" "),
							bottom: -1
						}	
					};	
				} else {
					cssWithDirection = null;
					cssWithoutDirection = null;
					cssFinalUsed = null;
					return null;	
				}
				
				cssFinalUsed = $.extend({}, cssWithDirection[direction], cssWithoutDirection);
				
				return $('<'+ beforeOrAfter +'></'+ beforeOrAfter +'>').css(cssFinalUsed);
			};
			
			// 限高
			var cssOuterLimit = {
				width: 2 * params.size,
				left: align,
				marginLeft: (-1 * params.size) + "px",
				height: params.size,
				textIndent: 0,
				overflow: "hidden",
				position: "absolute"
			};
			if (direction == "top") {
				cssOuterLimit["bottom"] = -1 * params.size;
			} else {
				cssOuterLimit["top"] = -1 * params.size;
			}
			
			this.remind.css({
				left: offset.left,
				top: remindTop, 
				// marginLeft: ($(this).outerWidth() - this.remind.outerWidth()) * 0.5 + /*因为三角位置造成的偏移*/ this.remind.outerWidth() * (50 - parseInt(align)) / 100		
				// 等于下面这个：
				marginLeft: $(this).outerWidth() * 0.5 - this.remind.outerWidth() * parseInt(align) / 100
			}).prepend($('<div></div>').css(cssOuterLimit).append(fnCreateCorner("before")).append(fnCreateCorner("after")));
			
			$.testRemind.display = true;
			
			// 绑定消除事件
			$.testRemind.bind();
			
			return $(this);
		},
		html5Validate: function(options,callback) {
			var defaults = {
				// 取消浏览器默认的HTML验证
				novalidate: true,
				// 禁用submit按钮可用
				submitEnabled: false,
				submitBtn:'submit'
			};
			var params = $.extend({}, defaults, options || {});
			var elements = $(this).find(":input");
			if ($.html5Validate.isSupport) {
				if (params.novalidate) {
					$(this).attr("novalidate", "novalidate");
				} else {
					elements.each(function() {
						var type = this.getAttribute("type") + "", 
                               typeReplaced = type.replace(/\W+$/, "");
					
                    		if (type != typeReplaced) {
							try { this.type = typeReplaced; } catch(e) {}
						}
					});	
					params.hasTypeNormally = true;
				}
			}
		
			if (params.submitEnabled) {
				$(params.submitBtn).attr('disabled',true);
				elements.blur(function(){
					if ($.html5Validate.isAllpass(elements, params)) {
						$(params.submitBtn).removeAttr('disabled');
					}
				});
			}
			
			$(this).bind("submit", function() {
				if ($.html5Validate.isAllpass(elements, params)) {
					$.isFunction(callback) && callback.call(this);	
				}
				return false;	
			});
			
			return $(this);
		}
	});
})(jQuery);
