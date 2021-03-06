(function($){
    var insertFaceRange;
    //编辑器基本插件
    $.fn.CommentEditor = function(settings) {
        options = $.extend($.fn.CommentEditor.defaults, settings);
        return this.each(function(){
            var editorTargetId=$(this).attr("id");
            var $editor=$(this).find(".xf-editor-editarea");
            $editor.attr("contentEditable", "true");
            var _oninput = options.onInput;//绑定键盘输入事件
            $editor.bind("keyup", function(event) {
                updateInsertFaceRange();
                if ($.isFunction(_oninput)) {
                    var _txt=$editor[0].innerHTML;
                    var _txtLen = getCommentContentLen(_txt);
                    _oninput.call(this, event, {
                        txtLen : _txtLen,
                        txt:_txt
                    });
                }
            });
            $editor.bind("focus", function(event) {
                $editor.addClass("edit-focus");
            });
            $editor.bind("blur", function(event) {
                $editor.removeClass("edit-focus");
            });
            $editor.bind("mouseup", function(event) {
                updateInsertFaceRange();
            });
            $editor.bind("keydown",function(event){     //当有焦点的时候,里面默认的<br>就取消了  没有焦点的时候 里面会自带一个<br>
                if (event.keyCode == 13) {      // ie8回车 是<p></p>  因此强制添加<br> 
                    if (document.selection) {
                        var sel;
                        if (insertFaceRange) {
                            sel = insertFaceRange;
                        } else {
                            sel = document.selection.createRange();
                        }
                        sel.pasteHTML('<br/>');
                        sel.collapse(false);
                        sel.select();
                        sel = null;
                        return false;
                    }
                }
            });
            updateInsertFaceRange=function(){
                $editor.focus();
                $editor.trigger('dblclick')
                if (document.selection) {
                    insertFaceRange = document.selection.createRange();
                } else {
                    insertFaceRange = window.getSelection().getRangeAt(0);
                }
            };
            getCommentContentLen = function(s) {
                var str = s.replace(/<img(\s*\w*?\s*=\s*".*?")*(\s*?>)/gi, "*").replace(/<br(\s*\w*?\s*=\s*".*?")*(\s*?>)/gi, ""),
                    len = str.replace(/[^\x00-\xff]/g, "aa").length;
                len = Math.round(len / 2);
                return len;
            };
            var $floatWin=$(this).find(".xf-editor-overlay");
            $(this).find(".smiley").click(function(){
                if($floatWin.find('.overlay-content')[0].innerHTML==''){
                    var fmileyUrl='smiley.html?tid=';//+editorTargetId;
                    $floatWin.find('.overlay-content').append('<iframe width="100%" scrolling="no" height="100%" frameborder="0" src="'+fmileyUrl+'"></iframe>');
                    $floatWin.find(".close").click(function(){
                        closeFloatWin();
                    });
                    $floatWin.css("width","395px");
                    $floatWin.css("width","220px");
                }
                var top=$(this).outerHeight()+15;
                $floatWin.css("top",top+"px");
                $floatWin.css("left","20px");
                $floatWin.show();
            });
            closeFloatWin=function(){
                $floatWin.attr("style","");
                $floatWin.hide();
                $floatWin.find('.overlay-content')[0].innerHTML='';
            };
            $(this).bind("insertface", function (event, url) {
               $editor.insertFace('',url);
               closeFloatWin();
            });
        });
    };
    $.fn.CommentEditor.defaults = {
        onInput : null
    };

    //编辑器表情
    $.fn.extend( {
        insertFace : function(title, value) {
            $(this).focus();
            if (document.selection) {
                var sel;
                if (insertFaceRange) {
                    sel = insertFaceRange;
                } else {
                    sel = document.selection.createRange();
                }
                sel.collapse(false);
                var imgHTML='<img id="editor-tmp-img" class="imgface" src="' + value + '" title="'+title+'" alt="' + title+ '"/>';
                sel.pasteHTML(imgHTML);
                var h = document.getElementById("editor-tmp-img");
                h.removeAttribute("id");
                if (h.parentNode.lastChild === h&&isIE8()) {
                    sel.pasteHTML('<br>');
                    sel.moveEnd("character",-1); 
                }
                sel.select();
                sel = null;
            } else {
                var r;
                if (insertFaceRange) {
                    r=insertFaceRange;
                }else{
                    r = window.getSelection().getRangeAt(0);
                }
                var img = document.createElement("img");
                img.src = value;
                img.alt = title;
                img.title = title;
                img.className="imgface";
                //r.deleteContents();
                r.insertNode(img);
                r.setEndAfter(img);
                r.collapse(false);
                window.getSelection().removeAllRanges();//清除range
                window.getSelection().addRange(r);//设置range 
            }
        }
    })
    function isIE8(){
        return !!window.ActiveXObject&&(document.documentMode===8);
    }
})(jQuery);
function parentInsertFace(tarid,t){
    $("#"+tarid).trigger("insertface", [t]);    
}
