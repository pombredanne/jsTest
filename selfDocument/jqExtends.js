   
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
    _removeAttr:function(value){
        var _value=this.attr(value);
        this.removeAttr(value)
        return _value        
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

   function clearCon(){
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