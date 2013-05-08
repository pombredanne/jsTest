
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
            //failure_limit:'',  TODO 没有搞明白用处 暂时去除
            appear: null,
            load: null
        };

        options&&($.extend(settings, options));

        if($.cookie('imgCache')==='true'){  //TODO 考虑是否增加缓存措施
            elements.each(function(i,v){
                var self=this;
                $(self).hide().attr("src", $(self).data(settings.dataAttribute))[settings.effect](settings.effectspeed);
            });
            return
        }

        function update(){
            var container=settings.container,
                threshold=settings.threshold;

            elements.each(function(){
                var $this = $(this);

                if (settings.skipInvisible && !$this.is(":visible")) {
                    return;
                }

                if ($.abovethetop(this, container,threshold) ||$.leftofbegin(this, container,threshold)){   //已经翻过去的 未翻过去
                    /* Nothing. */
                }else{
                    if (!$.belowthefold(this, container,threshold) && !$.rightoffold(this, container,threshold)) {
                        if($last[0]===$(this)[0]){
                            $.cookie('imgCache', 'true');
                        }
                        $this.trigger("appear");
                    }else {
                        return false;
                    }
                }
            });
        }



        $container = (settings.container === undefined ||settings.container === window) ? $window : $(settings.container);

        if ('scroll' === settings.event) {
            $container.bind(settings.event, function(event){
                return update();
            });
        }

        this.each(function(){
            var self = this,
                $self = $(self);

            self.loaded = false;
            /* When appear is triggered load original image. */
            $self.one("appear", function(){
                if (!this.loaded) {
                    if (settings.appear) {
                        settings.appear.call(self, elements.length, settings);
                    }
                    $("<img />").bind("load", function(event){
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
                    }).attr("src", $self.data(settings.dataAttribute));
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
        /* Check if something appears when window is resized. */
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
