(function($) {
    $.fn.placeholder = function(options) {
        return this.each(function(index, element) {
            var self = this,
                placejQ=self.getAttributeNode('placejQ');
            var defaultOpt = {
                isFF: true,
                className: 'placeholder',
                normal:false,
                textarea:20,   //因为默认的行高 都是Dom元素的 一半 因此 对于textarea 进行设置
                fn:false
            }

            options= $.extend(defaultOpt,options);

            var isPlaceHolder = function() {
                    return 'placeholder' in document.createElement('input');
            };

            if (!jQuery.isFunction(window.placeHolder)) {
                window._placeHolder = function(obj) {
                    if (!obj) {
                        return;
                    }
                    this.input = obj;
                    this.label = document.createElement('label');
                    this.label.innerHTML = placejQ&&(placejQ.value);
                    this.label.className = options.className;
                    if (obj.value) {
                        this.label.style.display = 'none';
                    }
                    this.init();
                    if($.isFunction(options.fn)){
                        fn.call(self,options);
                    }
                };
                _placeHolder.prototype = {
                    //http://www.cnblogs.com/qieqing/archive/2008/10/06/1304399.html
                    getxy: function(obj) {
                        var cl, ct, l, sl, st, t, documentElement = document.documentElement,_body = document.body;

                        if (documentElement.getBoundingClientRect) {
                            st = documentElement.scrollTop || _body.scrollTop;
                            sl = documentElement.scrollLeft || _body.scrollLeft;
                            ct = documentElement.clientTop || _body.clientTop;
                            cl = documentElement.clientLeft || _body.clientLeft;
                            return {
                                left: obj.getBoundingClientRect().left + sl - cl,
                                top: obj.getBoundingClientRect().top + st - ct
                            };
                        } else {
                            l = t = 0;
                            while (obj) {
                                l += obj.offsetLeft;
                                t += obj.offsetTop;
                                obj = obj.offsetParent;
                            }
                            return {
                                top: t,
                                left: l
                            };
                        }
                    },
                    getwh: function(obj) {
                        return {
                            w: obj.offsetWidth,
                            h: obj.offsetHeight
                        };
                    },
                    setStyles: function(obj, styles) {
                        for (var p in styles) {
                            obj.style[p] = styles[p] + 'px';
                        }
                    },
                    init: function() {
                        var input, label, wh, wy;

                        label = this.label;
                        input = this.input;
                        wy = this.getxy(input);
                        wh = this.getwh(input);
                        this.setStyles(label, {
                            width: wh.w,
                            height: wh.h,
                            lineHeight:options.textarea&&(self.nodeName.toUpperCase()=='TEXTAREA')?options.textarea:wh.h,
                            left: wy.left,
                            top: wy.top
                        });
                        document.body.appendChild(this.label);

                        if (options.isFF){
                            label.onclick = function() {
                                input.focus();
                            };
                            $(input).bind('keyup',
                            function(e) {
                                if (this.value === '') {
                                    label.style.display = "";
                                } else {
                                    label.style.display = "none";
                                }
                            });
                        } else {
                            label.onclick = function() {
                                this.style.display = "none";
                                return input.focus();
                            };
                            input.onfocus = function() {
                                return label.style.display = "none";
                            };
                            input.onblur = function() {
                                if (this.value === "") {
                                    return label.style.display = "";
                                }
                            };
                        }
                    }
                };
            }

            if(options.normal && isPlaceHolder() && placejQ){  //正常 并且 该浏览器支持placeholder  正常显示
                $(self).attr('placeholder',placejQ.value);
            }else if(placejQ){
                options.normal && (options.isFF=false); //如果 正常模式 但是该浏览器不支持 placeholder 让其支持ie10模式
                new _placeHolder(self);
            }
            
        });
    };
})(jQuery);