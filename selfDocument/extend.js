/*String 扩展*/
String.prototype.Trim = function() {
    return this.replace(/(^[\t\n\r]*)|([\t\n\r]*$)/g, '');
}
String.prototype.LTrim = function() {
    return this.replace(/^[\t\n\r]/g, '');
};
String.prototype.RTrim = function() {
    return this.replace(/[\t\n\r]*$/g, '');
};
String.prototype.mm = function(){
    return this.replace(/\s/g,'');
}
String.prototype.ChineseLength = function() {
    return this.replace(/[^\x00-\xff]/g, "**").length;
};
//去除字符串中的标签  直接替换 不影响光标
String.prototype.stripHTML = function() {
    //var reTag = /<(?:.|\s)*?>/g;  // 这种会把<>这种也给去掉
    var reTag=/<[^>].*?>/g;
    return this.replace(reTag, "");
}

/*Array 扩展*/
Array.prototype.randomSort = function() { //数组元素随机排列  Note 里进行比较
    return this.sort(function(){Math.random() >0.5});
};

Array.prototype.isIn = function(value) {
    return RegExp(value).test(this);
};

Array.prototype.Max = function() {
    return Math.max.apply(Math, this);
};
//深度克隆
Array.prototype.myClone = function() {
    var arrayTemp = [];
    for (var key in this) {
        arrayTemp[key] = typeof(this[key] === 'object') ? this[key].myClone() : this[key];
    }
    return arrayTemp;
}
Array.prototype.clone = function() {
    //concat(); 方法 也是一种简单的深度克隆
    return this.slice(0);
}


var _Dom={
    trigger:function(){         //事件触发  http://stylechen.com/trigger.html   http://www.zhangxinxu.com/wordpress/?p=2330
        if (document.createEventObject){
          // IE浏览器支持fireEvent方法
          var evt = document.createEventObject();
          return element.fireEvent('on'+event,evt);
       }else{
          // 其他标准浏览器使用dispatchEvent方法
          var evt = document.createEvent( 'HTMLEvents' );
          // initEvent接受3个参数：
          // 事件类型，是否冒泡，是否阻止浏览器的默认行为
          evt.initEvent(event, true, true);
          return !element.dispatchEvent(evt);
       }
    },
    innerText:function(){
            HTMLElement.prototype.__defineGetter__("innerText", function() {
                var anyString = "";
                var childS = this.childNodes;
                for(var i = 0; i < childS.length; i++) {
                    if(childS[i].nodeType   == 1) anyString += childS[i].tagName == "BR" ? '\n' : childS[i].innerText;
                    else if(childS[i].nodeType ==   3) anyString += childS[i].nodeValue;
                }
                return anyString;
            });

            HTMLElement.prototype.__defineSetter__("innerText", function(sText) {
                this.textContent = sText;
            });
        }
    },
    getButton: function(event){
        if (document.implementation.hasFeature("MouseEvents", "2.0")){  //FF
            return event.button;
        } else {
            //TODO
            switch(event.button){
                case 0:
                //表示没有按下按钮
                case 1:
                //主
                case 3:
                //主+次
                case 5:
                //主+滚轮
                case 7:
                    //主+滚轮+次
                    return 0;//主鼠标按钮
                case 2:
                //次
                case 6:
                    //滚轮+次键
                    return 2;//次鼠标按钮
                case 4:
                    //管轮
                    return 1;//鼠标滚轮
            }
        }
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    getRelatedTarget: function(event){
        //对于 mouseover 事件来说，该属性是鼠标指针移到目标节点上时所离开的那个节点。
        //对于 mouseout 事件来说，该属性是离开目标时，鼠标指针进入的节点。
        if (event.relatedTarget){   //FF
            return event.relatedTarget;
        } else if (event.toElement){   //IE进入
            return event.toElement;
        } else if (event.fromElement){  //IE出去
            return event.fromElement;
        }
        return null;
    },
    getWheelDelta: function(event){
        /*
        *   FF:DOMMouseScroll
        *   other:mousewheel
        */
        //滚轮操作
        if (event.wheelDelta){
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    },
    /*
     setClipboardText: function(event, value){  //只使用ie 兼容请选择插件
     //剪贴板
     if (event.clipboardData){  //剪贴板放入数据
     event.clipboardData.setData("text/plain", value);
     } else if (window.clipboardData){
     window.clipboardData.setData("text", value);
     }
     },
     getClipboardText: function(event){ //获取剪贴板数据
     var    clipboardData =  (event.clipboardData || window.clipboardData);
     return clipboardData.getData("text");
     },
     */
    contains:function(a,b,itself){  // http://www.cnblogs.com/rubylouvre/archive/2011/05/30/1583523.html
         if (itself && a == b) {
            return true
         }
         if (a.contains) {
             if (a.nodeType === 9){// document
                 return true;
             }
             return a.contains(b);
         } else if (a.compareDocumentPosition) {
             return !!(a.compareDocumentPosition(b) & 16);
         }
         while ((b = b.parentNode)){
             if (a === b) return true;
         }
         return false;

         return $(a).closest(b).length>0;  //jquery
    },
    select:{
        checkItem: function(objSelect, objItemValue) {
            var isExit = false;
            for(var i = 0; i < objSelect.options.length; i++) {
                if(objSelect.options[i].value == objItemValue) {
                    isExit = true;
                    break;
                }
            }
            return isExit;
        },
        addItem: function(objSelect, objItemText, objItemValue) {
            //判断是否存在
            if(this.checkItem(objSelect, objItemValue)) {
                alert("该Item的Value值已经存在");
            } else {
                var varItem = new Option(objItemText, objItemValue);
                objSelect.options.add(varItem);
                alert("成功加入");
            }
        },
        removeItem: function(objSelect, objItemValue) {
            //判断是否存在
            if(this.checkItem(objSelect, objItemValue)) {
                for(var i = 0; i < objSelect.options.length; i++) {
                    if(objSelect.options[i].value == objItemValue) {
                        objSelect.options.remove(i);
                        break;
                    }
                }
                alert("成功删除");
            } else {
                alert("该select中 不存在该项");
            }
        },
        removeSelectedItem: function(objSelect) {
            var length = objSelect.options.length - 1;
            for(var i = length; i >= 0; i--) {
                if(objSelect[i].selected == true) {
                    objSelect.options[i] = null;
                }
            }
        },
        updateItem: function(objSelect, objItemText, objItemValue) {
            //判断是否存在
            if(this.checkItem(objSelect, objItemValue)) {
                for(var i = 0; i < objSelect.options.length; i++) {
                    if(objSelect.options[i].value == objItemValue) {
                        objSelect.options[i].text = objItemText;
                        break;
                    }
                }
                alert("成功修改");
            } else {
                alert("该select中 不存在该项");
            }
        },
        selectItemByText: function(objSelect, objItemText) {
            //判断是否存在
            if(this.checkItem(objSelect, objItemValue)) {
                var isExit = false;
                for(var i = 0; i < objSelect.options.length; i++) {
                    if(objSelect.options[i].text == objItemText) {
                        objSelect.options[i].selected = true;
                        isExit = true;
                        break;
                    }
                }
                //Show出结果
                if(isExit) {
                    alert("成功选中");
                } else {
                    alert("该select中 不存在该项");
                }
            }
        },
        selectItemByValue: function(objSelect, objItemValue) {
            if(this.checkItem(objSelect, objItemValue)) {
                document.all.objSelect.value = objItemValue;
            }
        },
        selectValue: function(objSelect) {
            var b = document.all.objSelect.value;
            return b;
        },
        selectText:function(objSelect)  {
            var k =objSelect.options[objSelect.selectedIndex].text;
            return k
        },
        selectInde: function(objSelect) {
            var k =objSelect.selectedIndex;
            return k
        },
        clear: function(objSelect) {
            var k = objSelect.options.length = 0
            return k
        }
    }
}

//判断object是否相等
Object.prototype.equals = function(obj) {
    if(this == obj){return true;}
    if(typeof(obj) == "undefined" || obj == null || typeof(obj) != "object"){return false;}
    var length = 0;
    var length1 = 0;
    for(var ele in this) {length++;}

    for(var ele in obj) {length1++;}

    if(length != length1)return false;

    if(obj.constructor == this.constructor) {
        for(var ele in this) {
            if(typeof(this[ele]) == "object") {
                if(!this[ele].equals(obj[ele]))
                    return false;
            } else if(typeof(this[ele]) == "function") {
                if(!this[ele].toString().equals(obj[ele].toString()))
                    return false;
            } else if(this[ele] != obj[ele])
                return false;
        }
        return true;
    }
    return false;
};

// Object.toSource
Object.prototype.toSource=(function(){
    if('toSource' in Object.prototype){
        return Object.prototype.toSource;
      /*
        return function(){
            return Object.protype.toSouce(this);
        };*/
    }else if(JSON && 'stringify' in JSON){
        return function(){
            return JSON.stringify(this);
        };
    }else if(jQuery){
       return  function(){
            return jQuery.parseJSON(this);
       };
   }else{
       return function(){   // http://www.phpernote.com/javascript-function/261.html  http://stackoverflow.com/questions/171407/implementing-mozillas-tosource-method-in-internet-explorer
                var r=[],
                     o=this.toString();
                if(typeof o=="string"){
                    return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
                }
                if(typeof o=="object"){
                    var i;
                    if(!o.sort){
                        for(i in o){
                            r.push(i+":"+obj2string(o[i]));
                        }
                        if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
                            r.push("toString:"+o.toString.toString());
                        }
                        r="{"+r.join()+"}";
                    }else{
                        for(i=0;i<o.length;i++){
                            r.push(obj2string(o[i]));
                        }
                        r="["+r.join()+"]";
                    } 
                    return r;
                } 
                return o.toString();
       } ;
   }
})();


// jquery bind live degate on 方法不同点  http://www.alfajango.com/blog/the-difference-between-jquerys-bind-live-and-delegate/
var addEventListener = (function() {
    if (HTMLElement.prototype.addEventListener) {       // removeEventListener
        return function(element, type, handler) {
            element.addEventListener(type, handler, false);
            elements['Listener_' + type] = handler;
        }
    } else if (HTMLElement.prototype.attachEvent) {     // detachEvent
        return function(element, type, handler) {
            element.attachEvent("on" + type, handler);
            elements['Listener_' + type] = handler; // use remove or check
        }
    } else {
        return function() {
            element["on" + type] = handler;
        }
    }
})(),
    getDomEvent = function(dom) {
        var usejq = jQuery.fn.jquery ? jQuery.fn.jquery : false,
            domEles = {},
            cache = '',
            elements = ["blur", "focus", "focusin", "focusout", "load", "resize", "scroll", "unload", "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "change", "select", "submit", "keydown", "keypress", "keyup", "error", "contextmenu"];
        dom = usejq ? dom[0] : dom;

        for (var i = -1, val; val = elements[i++];) {
            cache = dom['on' + val[i]] || dom["Listener_" + val[i]] || dom.getAttribute('on' + val[i])
            if (cache) {
                var type = (dom['on' + val[i]] ? 'on_' : 'Listener_') + val[i];
                domEles[type] = cache;
            };
        }

        if (usejq) {
            var fnType = usejq > '1.8' ? '_data' : 'data';
            cache = jQuery[fnType](dom, 'events');
            for (prop in canche) {
                domEles['jQ_' + prop] = cache[prop][0].handle
            }
        }
    };

/* 
on: 只能调用一次  但 可以获取的到
addEventListener||attachEvent:  多次调用 但 几乎不可使用正常js来获取.   解决方法: chrome F12 -- Event Listeners  or Visual Event(1.0) 
*/
