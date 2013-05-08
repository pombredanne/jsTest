
/*

 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2012 Mika Tuupola
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 * http://www.appelsiini.net/projects/lazyload
 *
 * Version: 1.8.1
 *
 */
 
 /*
        http://www.admin10000.com/document/1011.html
       html code:
           <div id="container">
             <div id="inner_container">
                   <img width="765" height="574" alt="BMW M3 GT" data-original="img/bmw_m3_gt.jpg" src="img/bmw_m3_gt.jpg" style="display: block;">
                   <img width="765" height="574" alt="BMW M3 GT" data-original="img/bmw_m3_gt.jpg" src="img/bmw_m3_gt.jpg" style="display: block;">
                   <img width="765" height="574" alt="BMW M3 GT" data-original="img/bmw_m3_gt.jpg" src="img/bmw_m3_gt.jpg" style="display: block;">
                   <img width="765" height="574" alt="BMW M3 GT" data-original="img/bmw_m3_gt.jpg" src="img/bmw_m3_gt.jpg" style="display: block;">
             </div>
           </div>
           
      style code:
        #container {
            overflow: scroll;
            width: 800px;
        }
       #inner_container {
            width: 4750px;
        }
        
      js code:
         $("img.lazy").lazyload();
         $("img.lazy").lazyload({ threshold : 200 });//提前200px加载
         $("img.lazy").lazyload({ event : "click" });//自定义触发事件
         $("img.lazy").lazyload({ effect : "fadeIn" });//显示效果
         $("img.lazy").lazyload({ skipInvisible : false });//加载不可见的 默认:不可见img 不load
         $("img.lazy").lazyload({        
                 container: $("#container")
           });

         
 */

 // TODO 增加缓存设置
(function($, window){
    var $window = $(window);
    $.fn.lazyload = function(options){
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            event: "scroll",
            effect: "show",
            container: window,
            dataAttribute: "original",
            skipInvisible: true,
            appear: null,
            load: null
        };

        function update(){
            var container=settings.container,
                threshold=settings.threshold,
                counter = 0;
                

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
                    }else {
                        return false;
                    }
                }
            });
        }

        options&&($.extend(settings, options))
        
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

                    //$("<img />").bind("load", function(event){
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
                    //}).attr("src", $self.data(settings.dataAttribute));
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
            fold = $(window).height() + $(window).scrollTop();
        }else {
            fold = $(container).offset().top + $(container).height();
        }
        return fold <= $(element).offset().top - threshold;
    };
    $.rightoffold = function(element, container,threshold){
        var fold;
        if (!container || container === window || container === "window") {
            fold = $(window).width() + $(window).scrollLeft();
        }
        else {
            fold = $(container).offset().left + $(container).width();
        }
        return fold <= $(element).offset().left - threshold;
    };
    $.abovethetop = function(element, container,threshold){
        var fold;
        if (!container || container === window || container === "window") {
            fold = $(window).scrollTop();
        }
        else {
            fold = $(container).offset().top;
        }
        return fold >= $(element).offset().top + threshold + $(element).height();
    };
    $.leftofbegin = function(element, container,threshold){
        var fold;
        if (!container || container === window || container === "window") {
            fold = $(window).scrollLeft();
        }
        else {
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
