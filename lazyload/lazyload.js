
(function($, window){
    var $window = $(window);
    $.fn.lazyload = function(options){
        var elements = this,
            $last=$(elements).last(),
            $container,
            settings = {
                threshold: 0,
                event: "scroll",
                effect: "show",
                container: window,
                dataAttribute: "original",
                skipInvisible: true,
                effectspeed:'normal',
                failureLimit:0, // TODO 参数:failurelimit,值为数字.lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况,failurelimit意在加载N张可见区域外的图片,以避免出现这个问题.  主要应付 html DOM元素顺序错乱问题 还未发现该问题
                appear: null,
                load: null,
                cacheEffect:true
            };

        options&&($.extend(settings, options));

        if(settings.cacheEffect){
            var isCache=function(url){
                var img=new Image();
                img.src=url;
                if(img.complete||img.width||img.naturalWidth) { // http://www.jacklmoore.com/notes/naturalwidth-and-naturalheight-in-ie/
                    return true;
                }
                return false;
            }

            if(isCache($last.data(settings.dataAttribute))){
                    elements.each(function(i,v){
                        var self=this;
                        $(self).attr("src", $(self).data(settings.dataAttribute));
                    });
                    return false;
            }
        }

        function update(){
            var container=settings.container,
                threshold=settings.threshold,
                sortCount=0;

            elements.each(function(){
                var $this = $(this);

                if (settings.skipInvisible && !$this.is(":visible")) {
                    return;
                }

                if ($.abovethetop(this, container,threshold) ||$.leftofbegin(this, container,threshold)){   //已经翻过去的 未翻过去
                    /* Nothing. */
                }else{
                    if (!$.belowthefold(this, container,threshold) && !$.rightoffold(this, container,threshold)) {
                        $this.trigger("appear");
                    }else if(++sortCount>settings.failureLimit){
                        return false;   
                    }
                }
            });
        }



        $container = (settings.container === undefined ||settings.container === window) ? $window : $(settings.container);

        if ('scroll' === settings.event) {
            $container.bind('scroll', function(event){
                return update();
            });
        }

        this.each(function(){
            var self = this,
                $self = $(self);

            self.loaded = false;

            $self.one("appear", function(event){
                if (!this.loaded) {
                     var image=new Image();  //TODO  new Image().src=""  这样生成的Image不是一个对象
                     image.src=$self.data(settings.dataAttribute);

                    if (settings.appear) {
                        settings.appear.call(self, elements.length, settings);
                    }

                    $(image).bind('load',function(event){
                          $self.hide().attr("src", $self.data(settings.dataAttribute))[settings.effect](settings.effectspeed);
                            self.loaded = true;
                            /* 从阵列中删除图像，所以它不是下一次循环。 */
                            var temp = $.grep(elements, function(element){
                                return !element.loaded;
                            });
                            elements = $(temp);
                            if (settings.load) {
                                settings.load.call(self, elements.length, settings);
                            }
                    });
                }
            });

            if ("scroll" !== settings.event) {
                $self.bind(settings.event, function(event){
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        $window.bind("resize", function(event){
            update();
        });

        $(document).ready(function(){
            update();
        });

        return this;
    };

    $.belowthefold = function(element, container,threshold){
        var fold;
        if (!container || container === window || container === "window") {
            fold = $(container).height() + $(container).scrollTop();
        }else {
            fold = $(container).offset().top + $(container).height();
        }
        return fold <= $(element).offset().top - threshold;
    };
    $.rightoffold = function(element, container,threshold){
        var fold;
        if (!container || container === window || container === "window") {
            fold = $(container).width() + $(container).scrollLeft();
        }
        else {
            fold = $(container).offset().left + $(container).width();
        }
        return fold <= $(element).offset().left - threshold;
    };
    $.abovethetop = function(element, container,threshold){
        var fold;
        if (!container || container === window || container === "window") {
            fold = $(container).scrollTop();
        }else {
            fold = $(container).offset().top;
        }
        return fold >= $(element).offset().top + threshold + $(element).height();
    };
    $.leftofbegin = function(element, container,threshold){
        var fold;
        if (!container || container === window || container === "window") {
            fold = $(container).scrollLeft();
        } else {
            fold = $(container).offset().left;
        }
        return fold >= $(element).offset().left + threshold + $(element).width();
    };
    $.inviewport = function(element, container,threshold){
        return !$.rightoffold(element, container,threshold) && !$.leftofbegin(element, container,threshold) &&
        !$.belowthefold(element, container,threshold) &&
        !$.abovethetop(element, container,threshold);
    };

    $.extend($.expr[':'], {
        "below-the-dom" : function(a) { return $.belowthefold(a,'',0); },    //[上下] 还未翻过去的
        "above-the-dom"  : function(a) { return !$.belowthefold(a,'',0); },   //[上下] 已经翻过去的
        "right-the-dom": function(a) { return $.rightoffold(a,'',0); },     //[左右] 还未翻过去的
        "left-the-dom" : function(a) { return !$.rightoffold(a,'',0); },    //[左右]  已经翻过去的
        "in-viewport"    : function(a) { return $.inviewport(a,'',0);},       //可是区域
    });
})(jQuery, window);
