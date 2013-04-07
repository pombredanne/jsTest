   
/*
 * jquery 常用插件
 * author: rambo
 * date:2012-9-29
 * use:$("Element").function
 */
$.fn.extend({
    swapClass: function(c1, c2){
        /*
         * 作用:搜索class为c1的Dom元素,为其赋class名称为c2.搜索class为c2的Dom元素,为其赋class名称为c1.
         */
        var c1Elements = this.filter('.' + c1);
        this.filter('.' + c2).removeClass(c2).addClass(c1);
        c1Elements.removeClass(c1).addClass(c2);
        return this;
    },
    replaceClass: function(c1, c2){//替换class
        return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
    },
    hoverClass: function(className){
        className = className || "hover";
        return this.hover(function(){
            $(this).addClass(className);
        }, function(){
            $(this).removeClass(className);
        });
    },
    toggleClass: function(className){
        className = className || "hover";
        return this.toggle(function(){
            $(this).addClass(className);
        }, function(){
            $(this).removeClass(className);
        });
    },
    parentN: function(n){
        n = n || 2;
        var t = this
        for (var i = 0; i < n; i++) {
            result = result.parent()
        }
        return result;
    },
    parent_util: function(ElementName){
        var $parentArray = this.parentsUntil(ElementName);
        var length = $parentArray.length;
        var result = $parentArray.eq(length - 1).parent();
        return result;
    },
    next_util: function(ElementName){
        var $next = this.nextUntil(ElementName);
        var result = $parentArray.next();
        return result;
    },
    removeAttrs:function(){
        for(var i=0,length=argument.length;i<length;i++){
            this.removeAttr(argument[i])
        }
        return this        
    }
    
});


   $.extend({
        escapeHtmlEntities:function (str) { //> 转换为 &gb
        var tempEle = document.createElement("textarea");
        tempText = document.createTextNode(str);
        tempEle.appendChild(tempText);
        var result = tempEle.innerHTML;
        return result;
        /*var t=$('<textarea>').html(str);
         return t.html()*/
    },
    unescapeHtmlEntities:function(str){
        var tempEle = document.createElement("div");
        tempEle.innerHTML = str;
        //return tempEle.childNodes[0].nodeValue;
        return tempEle.innerText||tempEle.textContent;//谷歌 textContent innerText都支持

        /*var t=$('<div>').html(str);
         return t.text()
         */
    }
   });

   function clearConObj(){
     //(function(){
            if(!window.console){
                window.console = {};
                var func = ['log','debug','info','warn','error','assert','dir','dirxml','trace',
                    'group','groupEnd','time','timeEnd','profile','profileEnd','count','exception','table'];
                for( var i = 0 , j = func.length ; i < j ; i++ ){
                    window.console[func[i]] = function(){}
                }
             }
       // })();
   }

   //查看鼠标从那个方向进入
   (function($,window,undefined){
        $.fn.getDir=function(opt){
            var _default={
                inFn:$.noop,
                outFn:$.noop,
                useCapture:true
            },
            w = $(this).width(),
            h = $(this).height(),
            _getDir=function(x,y){
                /*
                    (Math.atan2(y, x):  计算出弧度值;
                    1rad=(180 / Math.PI)度=57.29578度;
                    /90: 是为了获取一个比值关系 纯粹是为了给后面 取%方便 同后面的 +3 就限制啦 只能为 360/90+3--0/90+3 即 3-0之间 这样取%
                    将结果限制在 0-3 之间  (锐角,平角,炖角,周角);
                */
                var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI))) / 90) + 3) % 4;
                return ['bottom','right','top','left'][direction];
            },
            self=this[0];

            opt=$.extend({},_default,opt);

            this.mouseenter(function(event){
                if(opt.useCapture){
                    event.stopPropagation();
                }
                /*
                    x,y的设置 为了确保其在target中  TODO 这里好好再检查以下
                */
                var x = (event.pageX - self.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1),
                    y = (event.pageY - self.offsetTop - (h / 2)) * (h > w ? (w / h) : 1),
                    dir=_getDir(x,y);

                if($.isFunction(opt.inFn)){
                    opt.inFn.call(this,dir);
                }

            }).mouseleave(function(event){
                if(opt.useCapture){
                    event.stopPropagation();
                }
                // event.pageX - self.offsetLeft  局限在这个div中 这样 根据上面的公式来计算 角度 根据角度来判断 总体规律是
                /*
                      --------------------------
                      -  -                   -  -    
                      -     -     大       -     -    
                      -  大       -     -       -    
                      -          - -      小   -    
                      -         -       -      -    Y
                      -      -     小     -   -
                      -   -                    --    
                      ----------------------  ---                              
                            X
                */           
                var x = (event.pageX - self.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1),
                    y = (event.pageY - self.offsetTop - (h / 2)) * (h > w ? (w / h) : 1),
                    dir=_getDir(x,y);

                if($.isFunction(opt.outFn)){
                    opt.inFn.call(this,dir);
                }
            });
        }
    })(jQuery,window,undefined)