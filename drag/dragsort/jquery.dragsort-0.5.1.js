// jQuery List DragSort v0.5.1
// Website: http://dragsort.codeplex.com/
// License: http://dragsort.codeplex.com/license

(function($) {
    
    "use strict";

    var defaults={
        itemSelector: "",
        dragSelector: "",
        dragSelectorExclude: "input, textarea",
        dragEnd: function() { },
        dragBetween: false,
        placeHolderTemplate: "",
        scrollContainer: window,
        scrollSpeed: 5,
        strictexchange:true
    }

    $.fn.dragsort = function(options) {

        if (options == "destroy") {
            $(this.selector).trigger("dragsort-uninit");
            return;
        }

        var opts = $.extend({}, defaults, options),
            lists = [],
            theDoms = null,
            lastPos = null;

        this.each(function(i, cont) {

            if ($(cont).is("table") && $(cont).children().size() == 1 && $(cont).children().is("tbody")){
                cont = $(cont).children().get(0);
            }

            var newList = {
                draggedItem: null,
                placeHolderItem: null,
                pos: null,
                offset: null,
                offsetLimit: null,
                scroll: null,
                container: cont,

                init: function() {

                    opts.tagName = $(this.container).children().size() == 0 ? "li" : $(this.container).children().get(0).tagName.toLowerCase();
                    if (opts.itemSelector == "")
                        opts.itemSelector = opts.tagName;
                    if (opts.dragSelector == "")
                        opts.dragSelector = opts.tagName;
                    if (opts.placeHolderTemplate == "")
                        opts.placeHolderTemplate = "<" + opts.tagName + ">&nbsp;</" + opts.tagName + ">";

                    $(this.container).attr("data-index", i).mousedown(this.grabItem).bind("dragsort-uninit", this.uninit);
                    this.styleDragHandlers(true);
                },

                uninit: function() {
                    var theDoms = lists[$(this).attr("data-index")];
                    $(theDoms.container).unbind("mousedown", theDoms.grabItem).unbind("dragsort-uninit");
                    theDoms.styleDragHandlers(false);
                },

                getItems: function() {
                    return $(this.container).children(opts.itemSelector);
                },

                styleDragHandlers: function(cursor) {
                    this.getItems().map(function() { return $(this).is(opts.dragSelector) ? this : $(this).find(opts.dragSelector).get(); }).css("cursor", cursor ? "pointer" : "");
                },

                grabItem: function(e) {     //获取正在拖动的那玩意
                    
                    var theDoms = lists[$(this).attr("data-index")];
                    var item = $(e.target).closest("[data-index] > " + opts.tagName).get(0);
                    var insideMoveableItem = theDoms.getItems().filter(function() { return this == item; }).size() > 0;

                    if (e.which != 1 || $(e.target).is(opts.dragSelectorExclude) || $(e.target).closest(opts.dragSelectorExclude).size() > 0 || !insideMoveableItem)
                        return;

                    e.preventDefault();

                    //change cursor to move while dragging
                    var dragHandle = e.target;
                    while (!$(dragHandle).is(opts.dragSelector)) {
                        if (dragHandle == this) return;
                        dragHandle = dragHandle.parentNode;
                    }
                    $(dragHandle).attr("data-cursor", $(dragHandle).css("cursor"));
                    $(dragHandle).css("cursor", "move");

                    //on mousedown wait for movement of mouse before triggering dragsort script (dragStart) to allow clicking of hyperlinks to work
                    var listElem = this;
                    var trigger = function() {
                        theDoms.dragStart.call(listElem, e);
                        $(theDoms.container).unbind("mousemove", trigger);
                    };
                    $(theDoms.container).mousemove(trigger).mouseup(function() { $(theDoms.container).unbind("mousemove", trigger); $(dragHandle).css("cursor", $(dragHandle).attr("data-cursor")); });
                },

                dragStart: function(e) {
                    //检查是否已经有list 有 干掉
                    if (theDoms != null && theDoms.draggedItem != null){
                        theDoms.dropItem();
                    }

                    //获取拖动对象
                    theDoms = lists[$(this).attr("data-index")];
                    theDoms.draggedItem = $(e.target).closest("[data-index] > " + opts.tagName)

                    //记录 该container下 参与拖动的 有多少个
                    theDoms.draggedItem.attr("data-nums", $(this).attr("data-index") + "-" + $(theDoms.container).children().index(theDoms.draggedItem));

                    //计算鼠标相对draggedItem偏移量
                    var mt = parseInt(theDoms.draggedItem.css("marginTop"));
                    var ml = parseInt(theDoms.draggedItem.css("marginLeft"));
                    theDoms.offset = theDoms.draggedItem.offset();
                    theDoms.offset.top = e.pageY - theDoms.offset.top + (isNaN(mt) ? 0 : mt) - 1;
                    theDoms.offset.left = e.pageX - theDoms.offset.left + (isNaN(ml) ? 0 : ml) - 1;

                    //是否有越界限制?
                    if (!opts.dragBetween) {
                        var containerHeight = $(theDoms.container).outerHeight() == 0 ? Math.max(1, Math.round(0.5 + theDoms.getItems().size() * theDoms.draggedItem.outerWidth() / $(theDoms.container).outerWidth())) * theDoms.draggedItem.outerHeight() : $(theDoms.container).outerHeight();
                        theDoms.offsetLimit = $(theDoms.container).offset();
                        theDoms.offsetLimit.right = theDoms.offsetLimit.left + $(theDoms.container).outerWidth() - theDoms.draggedItem.outerWidth();
                        theDoms.offsetLimit.bottom = theDoms.offsetLimit.top + containerHeight - theDoms.draggedItem.outerHeight();
                    }

                    //创建占位符 -- 就是那个虚线框 placeHolderItem
                    var h = theDoms.draggedItem.height();
                    var w = theDoms.draggedItem.width();
                    if (opts.tagName == "tr") {
                        theDoms.draggedItem.children().each(function() { $(this).width($(this).width()); });
                        theDoms.placeHolderItem = theDoms.draggedItem.clone().attr("data-placeholder", true);
                        theDoms.draggedItem.after(theDoms.placeHolderItem);
                        theDoms.placeHolderItem.children().each(function() { $(this).css({ borderWidth:0, width: $(this).width() + 1, height: $(this).height() + 1 }).html("&nbsp;"); });
                    } else if (opts.tagName == "td") {
                        var listTable = theDoms.draggedItem.closest("table").get(0);
                        $("<table id='" + listTable.id + "' style='border-width: 0px;' class='dragSortItem " + listTable.className + "'><tr></tr></table>").appendTo("body").children().append(theDoms.draggedItem);
                    }else {
                        theDoms.draggedItem.after(opts.placeHolderTemplate);
                        theDoms.placeHolderItem = theDoms.draggedItem.next().css({ height: h, width: w }).attr("data-placeholder", true);
                    }

                    //老样式设置
                    var oldstyle = theDoms.draggedItem.attr("style");
                    theDoms.draggedItem.attr("data-oldstyle", oldstyle ? oldstyle : "");
                    theDoms.draggedItem.css({ position: "absolute", opacity: 0.8, "z-index": 999, height: h, width: w });

                    //检查拖动是否越界 然后进行更改相应的拖动条
                    theDoms.scroll = { moveX: 0, moveY: 0, maxX: $(document).width() - $(window).width(), maxY: $(document).height() - $(window).height() };
                    theDoms.scroll.scrollY = window.setInterval(function() {
                        if (opts.scrollContainer != window) {
                            $(opts.scrollContainer).scrollTop($(opts.scrollContainer).scrollTop() + theDoms.scroll.moveY);
                            return;
                        }
                        var t = $(opts.scrollContainer).scrollTop();
                        if (theDoms.scroll.moveY > 0 && t < theDoms.scroll.maxY || theDoms.scroll.moveY < 0 && t > 0) {
                            $(opts.scrollContainer).scrollTop(t + theDoms.scroll.moveY);
                            theDoms.draggedItem.css("top", theDoms.draggedItem.offset().top + theDoms.scroll.moveY + 1);
                        }
                    }, 10);
                    theDoms.scroll.scrollX = window.setInterval(function() {
                        if (opts.scrollContainer != window) {
                            $(opts.scrollContainer).scrollLeft($(opts.scrollContainer).scrollLeft() + theDoms.scroll.moveX);
                            return;
                        }
                        var l = $(opts.scrollContainer).scrollLeft();
                        if (theDoms.scroll.moveX > 0 && l < theDoms.scroll.maxX || theDoms.scroll.moveX < 0 && l > 0) {
                            $(opts.scrollContainer).scrollLeft(l + theDoms.scroll.moveX);
                            theDoms.draggedItem.css("left", theDoms.draggedItem.offset().left + theDoms.scroll.moveX + 1);
                        }
                    }, 10);
                    if (opts.scrollContainer != window){
                        $(window).bind("DOMMouseScroll mousewheel", theDoms.wheel);
                    }

                    //document的拖动行为
                    $(document).bind("mousemove", theDoms.swapItems).bind("mouseup", theDoms.dropItem);

                    $(lists).each(function(i, l) { l.createDropTargets(); l.buildPositionTable(); });

                },

                //set position of draggedItem
                setPos: function(x, y) { 
                    //remove mouse offset so mouse cursor remains in same place on draggedItem instead of top left corner
                    var top = y - this.offset.top,
                        left = x - this.offset.left;

                    //是否需要限制拖动层 拖动位置
                    if (!opts.dragBetween) {
                        top = Math.min(this.offsetLimit.bottom, Math.max(top, this.offsetLimit.top));
                        left = Math.min(this.offsetLimit.right, Math.max(left, this.offsetLimit.left));
                    }

                    //调整到顶部父类的offset(top,left)值
                    // 知识补充: offsetParent: 取得离指定元素最近的含有定位信息的祖先元素。含有定位信息的元素指的是，CSS 的 position 属性是 relative, absolute, 或 fixed 的元素。
                    var parent = this.draggedItem.offsetParent().not("body").offset(); //offsetParent returns body even when it's static, if not static offset is only factoring margin
                    if (parent != null) {
                        top -= parent.top;
                        left -= parent.left;
                    }

                    //是否有滚动 有设置
                    if (opts.scrollContainer === window) {
                        y -= $(window).scrollTop();
                        x -= $(window).scrollLeft();
                        y = Math.max(0, y - $(window).height() + 5) + Math.min(0, y - 5);
                        x = Math.max(0, x - $(window).width() + 5) + Math.min(0, x - 5);
                    } else {
                        var cont = $(opts.scrollContainer),
                            offset = cont.offset();
                        y = Math.max(0, y - cont.height() - offset.top) + Math.min(0, y - offset.top);
                        x = Math.max(0, x - cont.width() - offset.left) + Math.min(0, x - offset.left);
                    }
                    theDoms.scroll.moveX = x == 0 ? 0 : x * opts.scrollSpeed / Math.abs(x);
                    theDoms.scroll.moveY = y == 0 ? 0 : y * opts.scrollSpeed / Math.abs(y);

                    //最后赋值了
                    this.draggedItem.css({ top: top, left: left });
                },

                //if scroll container is a div allow mouse wheel to scroll div instead of window when mouse is hovering over
                wheel: function(e) {
                    if (($.browser.safari || $.browser.mozilla) && theDoms && opts.scrollContainer != window) {
                        var cont = $(opts.scrollContainer);
                        var offset = cont.offset();
                        if (e.pageX > offset.left && e.pageX < offset.left + cont.width() && e.pageY > offset.top && e.pageY < offset.top + cont.height()) {
                            var delta = e.detail ? e.detail * 5 : e.wheelDelta / -2;
                            cont.scrollTop(cont.scrollTop() + delta);
                            e.preventDefault();
                        }
                    }
                },

                //建立一个表记录的所有位置可移动theDoms项目
                buildPositionTable: function() {
                    var pos = [];
                    this.getItems().not([theDoms.draggedItem[0], theDoms.placeHolderItem[0]]).each(function(i) {
                        var loc = $(this).offset();
                        loc.right = loc.left + $(this).outerWidth();
                        loc.bottom = loc.top + $(this).outerHeight();
                        loc.elm = this;
                        pos[i] = loc;
                    });
                    this.pos = pos;
                },

                dropItem: function() {
                    if (theDoms.draggedItem == null){
                        return;
                    }


                    //theDoms.draggedItem.attr("style", "") doesn't work on IE8 and jQuery 1.5 or lower
                    //theDoms.draggedItem.removeAttr("style") doesn't work on chrome and jQuery 1.6 (works jQuery 1.5 or lower)
                    var oldstyle = theDoms.draggedItem.attr("data-oldstyle");
                    (oldstyle)?(theDoms.draggedItem.attr("style", oldstyle)):(theDoms.draggedItem.removeAttr("style"));

                    theDoms.draggedItem.removeAttr("data-oldstyle");

                    theDoms.styleDragHandlers(true);

                    theDoms.placeHolderItem.before(theDoms.draggedItem).remove();  //这里才是真正让draggeItem 移动的地方

                    $("[data-droptarget], .dragSortItem").remove();

                    window.clearInterval(theDoms.scroll.scrollY);
                    window.clearInterval(theDoms.scroll.scrollX);

                    //回调函数处理
                    if (theDoms.draggedItem.attr("data-nums") != $(lists).index(theDoms) + "-" + $(theDoms.container).children().index(theDoms.draggedItem)){
                        if (opts.dragEnd.apply(theDoms.draggedItem) == false) { //if dragEnd returns false revert order
                            var pos = theDoms.draggedItem.attr("data-nums").split('-');
                            var nextItem = $(lists[pos[0]].container).children().not(theDoms.draggedItem).eq(pos[1]);
                            if (nextItem.size() > 0)
                                nextItem.before(theDoms.draggedItem);
                            else if (pos[1] == 0) //was the only item in theDoms
                                $(lists[pos[0]].container).prepend(theDoms.draggedItem);
                            else //was the last item in theDoms
                                $(lists[pos[0]].container).append(theDoms.draggedItem);
                        }
                    }


                    theDoms.draggedItem.removeAttr("data-nums");
                    theDoms.draggedItem = null;
                    $(document).unbind("mousemove", theDoms.swapItems).unbind("mouseup", theDoms.dropItem);
                    if (opts.scrollContainer != window){
                        $(window).unbind("DOMMouseScroll mousewheel", theDoms.wheel);
                    }

                    return false;
                },

                //swap the draggedItem (represented visually by placeholder) with the theDoms item the it has been dragged on top of
                swapItems: function(e) {
                    if (theDoms.draggedItem == null)
                        return false;

                    //拖动层跟随鼠标动
                    theDoms.setPos(e.pageX, e.pageY);

                    //判断有无重叠的dom
                    var ei = theDoms.findPos(e.pageX, e.pageY);
                    //对于可以跨界拖动的范围,在本dom范围中找不到的话,继续往另一个友好的dom中查找是否重叠
                    var nlist = theDoms;
                    for (var i = 0; ei == -1 && opts.dragBetween && i < lists.length; i++) {
                        ei = lists[i].findPos(e.pageX, e.pageY);
                        nlist = lists[i];
                    }

                    if(ei!==-1){

                        var children = function() { return $(nlist.container).children().not(nlist.draggedItem);},
                            fixed = children().not(opts.itemSelector).length?children().not(opts.itemSelector).each(function(i) { this.idx = children().index(this); }):$();

                        //判断在插入位置  如果拖动项移动到theDoms内部元素任何一个上面或者左边,就是前.否则就是后
                        if (lastPos == null || lastPos.top > theDoms.draggedItem.offset().top || lastPos.left > theDoms.draggedItem.offset().left){
                            $(nlist.pos[ei].elm).before(theDoms.placeHolderItem);
                        }else{
                            $(nlist.pos[ei].elm).after(theDoms.placeHolderItem);
                        }

                        //restore fixed items location
                        fixed.each(function() {
                            var elm = children().eq(this.idx).get(0);
                            if (this != elm && children().index(this) < this.idx)
                                $(this).insertAfter(elm);
                            else if (this != elm)
                                $(this).insertBefore(elm);
                        });

                        $(lists).each(function(i, l) { l.createDropTargets(); l.buildPositionTable(); });
                        lastPos = theDoms.draggedItem.offset();
                    }

                    return false;
                },

                findPos: function(x, y) {   // 返回与当前拖动项重叠项目的index
                    for (var i = 0; i < this.pos.length; i++) {
                        if (this.pos[i].left < x && this.pos[i].right > x && this.pos[i].top < y && this.pos[i].bottom > y){
                            return i;
                        }
                    }
                    return -1;
                },

                createDropTargets: function() {   // 当两者可以相互交换的时候,在对方哪里 也创建一个占位div
                    //opt.useful 个人感觉 不是太大必要
                    if (!opts.dragBetween||opts.strictexchange){
                        return;
                    }


                    $(lists).each(function() {
                        var ph = $(this.container).find("[data-placeholder]");
                        var dt = $(this.container).find("[data-droptarget]");
                        if (ph.size() > 0 && dt.size() > 0){
                            dt.remove();
                        }else if (ph.size() == 0 && dt.size() == 0) {
                            if (opts.tagName == "td"){
                                $(opts.placeHolderTemplate).attr("data-droptarget", true).appendTo(this.container);
                            }else{
                                //theDoms.placeHolderItem.clone().removeAttr("data-placeholder") crashes in IE7 and jquery 1.5.1 (doesn't in jquery 1.4.2 or IE8)
                                $(this.container).append(theDoms.placeHolderItem.removeAttr("data-placeholder").clone().attr("data-droptarget", true));
                            }
                            theDoms.placeHolderItem.attr("data-placeholder", true);
                        }
                    });
                }
            };

            newList.init();
            lists.push(newList);
        });

        return this;
    };

})(jQuery);