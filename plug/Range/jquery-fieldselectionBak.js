/*
 https://github.com/localhost
 http://rangy.googlecode.com/svn/trunk/demos/textrange.html     --一个selection插件
 主要用于:
 input textarea 可編輯div  的光标位置 以及选取内容
 getSelection  針對div 是強制使用trim  input 則可以進行調節
  iframe  仅能操作replaceSelection
 */

(function() {

    "use strict";

    var fieldSelection = {

        getSelection: function(opts) {
            opts = opts || {};
            var dom = this.jquery ? this[0] : this,
            isDiv = dom.tagName.toUpperCase() === 'DIV' && dom.contentEditable === "true",
            getFirstStr = function(dom) {
                var first = 0,
                firstDom = dom.firstChild || {
                    data: dom.value
                };
                if (firstDom.data.search(/\s/) > - 1) { //为了防止eg:<TextNode textContent="\n   this is a test\n   ">]  nodeType=3   <div>  nodeType=1  注释：8
                    //dom.firstChild.textContent=dom.firstChild.textContent.trimLeft();
                    return firstDom.textContent.search($.trim(firstDom.textContent).slice(0, 1)) || 0; //TODO 让得出结果减去它即可
                }
            };

            return (('selectionStart' in dom && function() { // dom 3.0
                var length = dom.selectionEnd - dom.selectionStart,
                    first = opts.trim ? getFirstStr(dom): 0;
                return {
                    start: dom.selectionStart - first,
                    end: dom.selectionEnd - first,
                    length: length,
                    text: dom.value.substr(dom.selectionStart, length)
                };
            }) || (isDiv && function() { //获取div的信息
                var first = getFirstStr(dom),
                    eleText = dom.textContent ? dom.textContent: dom.innerText; //TODO chrome 支持innerText 并且效果=== dom.textContent.trim();
                if (window.getSelection) { //非IE浏览器||>ie8
                    var getSel = window.getSelection(),
                    start,
                    result = {
                        value: function() {
                            try {
                                return getSel.toString ? getSel.toString() : document.selection.createRange().text;
                            } catch(e) {
                                return ''
                            }
                        },
                        length: function() {
                            return this.value();
                        },
                        end: function(start) {
                            return this.value() ? start + this.length() : start;
                        }
                    };

                    if (getSel.anchorNode.textContent === eleText) {
                        start = getSel.anchorOffset;
                        return {
                            start: start - (first - 0),
                            end: result.end(start),
                            value: result.value(),
                            length: result.length(),
                            trim: first
                        };
                    } else {
                        var currentIndex = getSel.anchorOffset,
                        txt = "",
                        txtoo = getSel.anchorNode.previousSibling;
                        while (txtoo != null) {
                            txt += txtoo.textContent;
                            txtoo = txtoo.previousSibling;
                        }
                        start = txt.trim().length + currentIndex;
                        return {
                            start: start,
                            end: result.end(start),
                            value: result.value(),
                            length: result.length(),
                            trim: first
                        };
                    }
                } else { //<ie9的
                    dom.focus();
                    var Sel = document.selection.createRange(),
                    Sel2 = Sel.duplicate(),
                    CaretPos = - 1;

                    Sel2.moveToElementText(dom);
                    while (Sel2.inRange(Sel)) {
                        Sel2.moveStart('character');
                        CaretPos++;
                    }
                    var text = Sel.text,
                    end = text.length ? CaretPos - first + text.length: start;
                    return {
                        start: CaretPos - first,
                        end: end,
                        value: text,
                        length: text.length,
                        trim: first
                    };
                }
            }) || (document.selection && function() { //针对<ie9
                dom.focus();
                var r = document.selection.createRange();
                    first = opts.trim ? getFirstStr(dom) : 0;

                if (r == null) {
                    return {
                        start: 0,
                        end: dom.value.length - first,
                        text: '',
                        length: 0
                    }
                }

                var re = dom.createTextRange(),
                rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);

                return {
                    start: rc.text.length - start,
                    end: rc.text.length + r.text.length - first,
                    length: r.text.length,
                    text: r.text
                };
            }) || function() { //browser not supported
                return {
                    start: 0,
                    end: dom.value.length,
                    length: 0
                };
            })();
        },

        replaceSelection: function(text) {

            var dom = this.jquery ? this[0] : this,
            isIframe = (function(dom) {
                if(dom.tagName.toUpperCase() === 'IFRAME'){
                    var doc = dom.contentDocument || dom.contentWindow.document;
                    return doc.contentEditable === true && doc.designMode === 'on';  // 他的contentEditable 为 bool true
                }
                return false;
            })(dom),
            isDiv = dom.tagName.toUpperCase() === 'DIV' && dom.contentEditable === "true";

            text = text || '';

            return (

            /* mozilla / dom 3.0 */
            ('selectionStart' in dom && function() {
                dom.value = dom.value.substr(0, dom.selectionStart) + text + dom.value.substr(dom.selectionEnd, dom.value.length);
                return this;
            }) ||

            /* exploder */
            ('selection' in document && function() {
                dom.focus();
                document.selection.createRange().text = text;
                return this;
            }) ||

            /*div的取值*/
            ((isDiv || isIframe) && function() {
                var win = isDiv ? window: dom.contentWindow,
                selection = win.getSelection ? win.getSelection() : win.document.selection,
                range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);

                if (win.getSelection) { //W3C
                    try {
                        dom.focus();
                    } catch(e) {
                        // $(dom).focus();
                    }
                    range.collapse(false); //将插入点移动到当前范围的开始或结尾。
                    var hasR = range.createContextualFragment(text);
                    var hasR_lastChild = hasR.lastChild;
                    while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() === "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() === "br") {
                        dom = hasR_lastChild;
                        hasR_lastChild = hasR_lastChild.previousSibling;
                        hasR.removeChild(dom);
                    }
                    range.insertNode(hasR);
                    if (hasR_lastChild) {
                        range.setEndAfter(hasR_lastChild);
                        range.setStartAfter(hasR_lastChild);
                    }
                } else {
                    dom.focus();
                    range.pasteHTML(text);
                    range.collapse(false);
                    range.select();
                }
                selection.removeAllRanges();
                selection.addRange(range);
                range.detach && range.detach();
                range = null;
            }) ||

            /* browser not supported */
            function() {
                dom.value += text;
                return this;
            }

            )();
        },
        setCursorPosition: function(pos, end, start) {
            pos = (pos - 0) || 0;
            var dom = this.jquery ? this[0] : this,
            isDiv = dom.tagName === 'DIV' && dom.contentEditable === "true";
            end && (pos = dom.value.length);
            if (dom.setSelectionRange) {
                dom.focus();
                dom.setSelectionRange(pos, pos);
                //dom.selectionStart=pos
            } else if (dom.createTextRange) {
                var range = dom.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            } else if (isDiv && window.getSelection) {
                var first, _first;
                dom.innerHTML=dom.innerHTML.trim().replace(/[\s]{2,}/ig," ");
                /*
                    测试:
                    <div>111222</div>
                    <div> 111222</div>
                    在firfox chrome 表现一样  ie暂未测试 估计也是一样  因为不需要考虑首空格
                    正则见    ---http://elick.blog.51cto.com/475186/599283
                 */
                if (start || end) {
                    first = end ? dom.lastChild: dom.firstChild;
                    _first = end ? dom.lastChild.nodeType === 3 ? dom.lastChild.length: 1: 0;
                } else {
                    var parents = dom.parentNode,
                    text = '',
                    length2 = 0,
                    innerText = $.trim(dom.textContent || dom.innerText),
                    childs = parents.childNodes;

                    first = dom.firstChild;
                    _first = 0;
                    var getFirstNode = function(first) {        // 处理 &nbsp;人为的空格
                        if (first.nodeType === 3 && ! first.data.trim()) {
                            var length = 0,
                            getLen = function(dom) {
                                for (var i = 0, len = dom.childNodes.length; i < len; i++) {
                                    var cache = dom.childNodes[i];
                                    var data = $.trim(cache.data || (cache.firstChild.data ? cache.firstChild.data: cache.firstChild.textContent));
                                    var t = 0;
                                    if (cache.childNodes.length) {
                                        var caLen = cache.childNodes.length;
                                        while (true) {
                                            var Ccache = cache.childNodes[t],
                                                data = $.trim(Ccache.data || (Ccache.firstChild.data ? Ccache.firstChild.data: Ccache.firstChild.textContent));
                                            length = length + data.length;
                                            if (length > pos) {
                                                break;
                                            }
                                            length2 = length;
                                            t++;
                                        }
                                    } else {
                                        length = length + data.length;
                                    }

                                    if (length > pos) {
                                        return t > 0 ? cache.childNodes[t] : cache;
                                    }
                                    length2 = length;
                                }
                            };
                            var cache = getLen(dom);
                            if (cache.nodeType !== 3 && ! cache.data) {
                                return cache.firstChild;
                            }
                        } else {
                            return first;
                        }
                    };

                    first = getFirstNode(first);
                    if ((first.data.search(/\n/) > - 1 || first.data.search(' ') > - 1)) {
                        text = first.textContent;
                        _first = text.search(jQuery.trim(text).slice(0, 1));
                    }
                    _first = length2 < pos ? pos - length2: (_first + pos);
                }
                var sel = window.getSelection(),
                tempRange = document.createRange();
                tempRange.setStart(first, _first);
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }
        }
    };

    jQuery.each(fieldSelection, function(i) {
        jQuery.fn[i] = this;
    });
})();

