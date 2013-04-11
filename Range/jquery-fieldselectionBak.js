                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        /*
    主要用于:
        input textarea 的光标位置 以及选取内容
*/
(function() {

	var fieldSelection = {

		getSelection: function() {
			var e = this.jquery ? this[0] : this,
                isDiv= e.tagName.toUpperCase()==='DIV'&& e.contentEditable === "true";

			return (
				/* mozilla / dom 3.0 */
				('selectionStart' in e && function() {
					var l = e.selectionEnd - e.selectionStart;
					return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
				}) ||  /*获取div的信息*/
               (isDiv&&function(){
                   var getPositionresult = 0,
                       eleText=e.innerText?e.innerText:e.textContent;
                   if(window.getSelection) { //非IE浏览器 <ie9
                           var first=0;
                           if(e.firstChild.data.search(/\n/)>-1||e.firstChild.data.search(' ')>-1){   //搞定 原html中自己存在字符的时候 会出现前面存在空白
                               //e.firstChild.textContent=e.firstChild.textContent.trimLeft();
                               first=e.firstChild.textContent.search(e.firstChild.textContent.trim().slice(0,1));  //TODO 让得出结果减去它即可
                               //<TextNode textContent="\n            this is a test\n        ">]  nodeType=3   <div>  nodeType=1  注释：8
                           }
                           var getSel=window.getSelection(),
                                start,
                                result={
                                   value:function(){
                                       try{
                                           var t=getSel.toString()?getSel.toString():document.selection.createRange().text;
                                           return t;
                                       }catch(e){
                                           return ''
                                       }
                                   },
                                   length:function(){
                                       var t=this.value();
                                       return t?t:1;
                                   }
                                };

                               if(getSel.anchorNode.textContent === eleText) {
                                   var start=getSel.anchorOffset;
                                   return {start:start-(first-0),value:result.value(),length:result.value().length-(first-0),end:start+result.value().length-(first-0)-1};
                               } else {
                                   var currentIndex = getSel.anchorOffset,
                                        txt = "",
                                        txtoo = getSel.anchorNode.previousSibling;
                                   while(txtoo != null) {
                                       txt += txtoo.textContent;
                                       txtoo = txtoo.previousSibling;
                                   }
                                   start = txt.trim().length + currentIndex;
                                   return {start:start,value:result.value(),length:result.value().length,end:start+result.value().length-1};
                               }
                       }else{
                       e.focus();
                       var Sel = document.selection.createRange();
                       var Sel2 = Sel.duplicate();
                       Sel2.moveToElementText(e);
                       var CaretPos = -1;
                       while (Sel2.inRange(Sel)) {
                           Sel2.moveStart('character');
                           CaretPos++;
                       }
                       console.log(Sel.text)
                       console.log(CaretPos)
                       //return {start:start,value:result.value(),length:result.value().length,end:start+result.value().length-1};
                   }
               })||

                /* exploder */
				(document.selection && function() {

					e.focus();
                    var r = document.selection.createRange();
					if (r == null) {
						return { start: 0, end: e.value.length, length: 0 }
					}

					var re = e.createTextRange();
					var rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint('EndToStart', re);

					return { start: rc.text.length, end: rc.text.length + r.text.length, length: r.text.length, text: r.text };
				})||

                /* browser not supported */
				function() {
					return { start: 0, end: e.value.length, length: 0 };
				}

			)();

		},

		replaceSelection: function() {

			var e = this.jquery ? this[0] : this,
            isDiv= e.tagName.toUpperCase()==='DIV'&& e.contentEditable === "true",
            text = arguments[0] || '';

			return (

				/* mozilla / dom 3.0 */
				('selectionStart' in e && function() {
					e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
					return this;
				}) ||

				/* exploder */
				(document.selection && function() {
					e.focus();
					document.selection.createRange().text = text;
					return this;
				}) ||

                /*div的取值*/
                (isDiv&&function() {
                    var selection = window.getSelection ? window.getSelection() : document.selection;
                    var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
                    if(!window.getSelection) { //IE
                        e.focus();
                        range.pasteHTML(text);
                        range.collapse(false);
                        range.select();
                    } else {
                        try{
                            e.focus();
                        }catch(e){
                           // $(e).focus();
                        }
                        range.collapse(false); //将插入点移动到当前范围的开始或结尾。
                        var hasR = range.createContextualFragment(text);
                        var hasR_lastChild = hasR.lastChild;
                        while(hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
                            var e = hasR_lastChild;
                            hasR_lastChild = hasR_lastChild.previousSibling;
                            hasR.removeChild(e);
                        }
                        range.insertNode(hasR);
                        if(hasR_lastChild) {
                            range.setEndAfter(hasR_lastChild);
                            range.setStartAfter(hasR_lastChild);
                        }
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                })||

				/* browser not supported */
				function() {
					e.value += text;
					return this;
				}

			)();
		},
        setCursorPosition:function( pos){
            var e = this.jquery ? this[0] : this;
            var isDiv= e.tagName==='DIV'&& e.contentEditable === "true";
            if (e.setSelectionRange) {
                e.focus();
                e.setSelectionRange(pos, pos);
            }else if (e.createTextRange) {
                var range = e.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }else if(isDiv){
                //div设置光标未实现
            }
         }



	};

	jQuery.each(fieldSelection, function(i) { jQuery.fn[i] = this; });

})();
