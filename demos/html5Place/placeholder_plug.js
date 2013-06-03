(function($) {
    $.fn.placeholder = function(options) {
        return this.each(function(index, element) {
            var self = this;
            var options = {
                isFF: true,
                className: 'placeholder',
                placeholder: false
            }

            var isPlaceHolder = function() {
                if (options.placeholder) {
                    return 'placeholder' in document.createElement('input');
                } else {
                    return false;
                }

            };

            if (!jQuery.isFunction(window.placeHolder)) {
                window._placeHolder = function(obj) {
                    if (!obj) {
                        return;
                    }
                    this.input = obj;
                    this.label = document.createElement('label');
                    this.label.innerHTML = obj.getAttributeNode('placejQ') && (obj.getAttributeNode('placejQ').value);
                    this.label.className = options.className;
                    if (obj.value) {
                        this.label.style.display = 'none';
                    }
                    this.init();
                };
                _placeHolder.prototype = {
                    getxy: function(obj) {
                        var cl, ct, l, sl, st, t, documentElement = document.documentElement,
                        _body = document.body;

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
                            lineHeight: wh.h,
                            left: wy.left,
                            top: wy.top
                        });
                        document.body.appendChild(this.label);

                        if (options.isFF) {
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
            new _placeHolder(self);
        });
    };
})(jQuery);