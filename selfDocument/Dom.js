									/****************事件******************/

/*

	兼容式 事件绑定	事件解除
	IE：target.attachEvent(eventType,lister);	target.detachEvent(eventType,listenter);
	FF:target.addEventLister(eventType,listener,useCapture); 
	   target.removeEventListener(eventType,listener,useCapture)
	   
	@elementId:事件ID；
	@eventType：事件类型；
	@listener：事件；
	
	use:addEventListener("id","click",hello)
	
*/
var _Dom={
    addEventListener:function(element, type,handler){
            if (element.addEventListener){
                element.addEventListener(type, handler,	false);
            } else if (element.attachEvent){
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
    },
    removeEventListener:function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
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

        /*
         IE:innerText
         FF:textContent

         use:可以直接使用 innerText
         */
        if(!window.navigator.userAgent.toLowerCase().indexOf("msie") >=	1) { //firefox innerText define
            HTMLElement.prototype.__defineGetter__("innerText", function() {
                var	anyString =	"";
                var	childS = this.childNodes;
                for(var	i =	0; i < childS.length; i++) {
                    if(childS[i].nodeType	== 1) anyString	+= childS[i].tagName ==	"BR" ? '\n'	: childS[i].innerText;
                    else if(childS[i].nodeType ==	3) anyString +=	childS[i].nodeValue;
                }
                return anyString;
            });

            HTMLElement.prototype.__defineSetter__("innerText", function(sText) {
                this.textContent = sText;
            });
        }
    },
    getByClass:function getClass(tagname, className) {	//tagname指元素，className指class的值

        //判断浏览器是否支持getElementsByClassName，如果支持就直接的用
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(className);
        }else	{	 //当浏览器不支持getElementsByClassName的时候用下面的方法
            var	tagname	= document.getElementsByTagName(tagname);  //获取指定元素
            var	tagnameAll = [];   //这个数组用于存储所有符合条件的元素
            for	(var i = 0;	i <	tagname.length;	i++) {	   //遍历获得的元素
                if (tagname[i].className == className) {	 //如果获得的元素中的class的值等于指定的类名，就赋值给tagnameAll
                    tagnameAll[tagnameAll.length] =	tagname[i];
                }
            }
            return tagnameAll;
        }
    },
    getStyle: function attrStyle(elem/*Dom*/,attr/*要查找的属性*/){

        //一个讲解:http://www.zhangxinxu.com/wordpress/2012/05/getcomputedstyle-js-getpropertyvalue-currentstyle/
        /*
         elem.currentStyle:IE
         document.defaultView:正常
         */
        var getSty=elem.currentStyle?elem.currentStyle:document.defaultView;
        attr = attr.replace(/([A-Z])/g, '-$1').toLowerCase();
        return elem.attr?elem.style[attr]:getSty[attr]||getSty.getComputedStyle(elem, null).getPropertyValue(attr);
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
    getCharCode: function(event){//按键编码
        if (typeof event.charCode == "number"){
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target	|| event.srcElement;
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
            return (client.engine.opera	&& client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    },
    preventDefault:	function(event){
        if (event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue =	false;
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
     var	clipboardData =	 (event.clipboardData || window.clipboardData);
     return clipboardData.getData("text");
     },
     */
    stopPropagation: function(event){   //阻止冒泡事件
        if (event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    select:{
        checkItem: function(objSelect, objItemValue) {
            var	isExit = false;
            for(var	i =	0; i < objSelect.options.length; i++) {
                if(objSelect.options[i].value == objItemValue) {
                    isExit = true;
                    break;
                }
            }
            return isExit;
        },
        addItem: function(objSelect, objItemText, objItemValue)	{
            //判断是否存在
            if(this.checkItem(objSelect, objItemValue))	{
                alert("该Item的Value值已经存在");
            } else {
                var	varItem	= new Option(objItemText, objItemValue);
                objSelect.options.add(varItem);
                alert("成功加入");
            }
        },
        removeItem:	function(objSelect,	objItemValue) {
            //判断是否存在
            if(this.checkItem(objSelect, objItemValue))	{
                for(var	i =	0; i < objSelect.options.length; i++) {
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
        removeSelectedItem:	function(objSelect)	{
            var	length = objSelect.options.length -	1;
            for(var	i =	length;	i >= 0;	i--) {
                if(objSelect[i].selected ==	true) {
                    objSelect.options[i] = null;
                }
            }
        },
        updateItem:	function(objSelect,	objItemText, objItemValue) {
            //判断是否存在
            if(this.checkItem(objSelect, objItemValue))	{
                for(var	i =	0; i < objSelect.options.length; i++) {
                    if(objSelect.options[i].value == objItemValue) {
                        objSelect.options[i].text =	objItemText;
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
            if(this.checkItem(objSelect, objItemValue))	{
                var	isExit = false;
                for(var	i =	0; i < objSelect.options.length; i++) {
                    if(objSelect.options[i].text ==	objItemText) {
                        objSelect.options[i].selected =	true;
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
            if(this.checkItem(objSelect, objItemValue))	{
                document.all.objSelect.value = objItemValue;
            }
        },
        selectValue: function(objSelect) {
            var b =	document.all.objSelect.value;
            return b;
        },
        selectText:	function(objSelect)	{
            var k =	objSelect.options[objSelect.selectedIndex].text;
            return k
        },
        selectInde:	function(objSelect)	{
            var	k =	objSelect.selectedIndex;
            return k
        },
        clear: function(objSelect) {
            var	k =	objSelect.options.length = 0
            return k
        }
    }
}

									/*********************DOM*************************/

var load = {
  load: function(type, src, code) {
    type==="js"?this.loadscript(src,code):this.loadstyle(src,code);
  },
  loadscript: function(src, code) {
    if(src || code) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      if(src) {
        script.src = src;
      } else if(code) {
        try {
          script.appendChild(document.createTextNode(code));
        } catch(ex) {
          script.text = code;
        }
      }
    }else{
      alert("please check script")
    }
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(script);
  },
  loadstyle: function(href, code) {
    if(href || code) {
      if(href) {
        var style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = href;
      } else if(code) {
        var style = document.createElement("style");
        style.type = "text/css";
        try {
          style.appendChild(document.creatTextNode(code));
        } catch(e) {
          style.styleSheet.cssText = code;
        }
      }
      var head = document.getElementsByTagName("head")[0];
      head.appendChild(style);
    } else {
      throw new Error('argument "path" is required !');
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

var brower={
    iE:function(){
       return !-[1,]&&!!window.ActiveXObject;
    },
    iE6:function(){
        return !-[1,]&&!window.XMLHttpRequest;
    },
    ie7:function(){
        return navigator.userAgent.indexOf('MSIE') > 0 && navigator.userAgent.indexOf('7') > 0;
    },
    ie8:function(){
        return isIE&&!!document.documentMode;
    },
    isOpera: function(){
        return navigator.userAgent.indexOf('Opera') > -1;
    },
    isChrome: function(){
        return navigator.userAgent.indexOf('Chromium') > -1;
    },
    isSafari: function(){
        return navigator.userAgent.indexOf('Safari') > -1;
    },
    isMoz: function(){
        return navigator.userAgent.indexOf('Mozilla/5.') > -1;
    }
}
