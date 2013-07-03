// jQuery List DragSort v0.5.1
// Website: http://dragsort.codeplex.com/
// License: http://dragsort.codeplex.com/license

(function($) {

    var defaults = {
        itemSelector: "",
        dragSelector: "",
        dragSelectorExclude: "input, textarea",
        dragEnd: function() { },
        dragBetween: false,
        //limits:true,
        placeHolderTemplate: "",
        scrollContainer: window,
        scrollSpeed: 5
    };

    $.fn.dragsort = function(options) {
        if (options == "destroy") {
            $(this).trigger("dragsort-uninit");
            return;
        }

        var opts = $.extend({}, defaults, options),
            lists = [],
            list,
            lastPos;

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
                    var $container=$(this.container);
                    var dragTagName = $container.children().length === 0 ? "li" : $container.children(':first').get(0).tagName.toLowerCase();
                    (!opts.itemSelector)&&(opts.itemSelector = dragTagName);
                    (!opts.dragSelector)&&(opts.dragSelector = dragTagName);
                    (!opts.placeHolderTemplate)&&(opts.placeHolderTemplate = "<" + dragTagName + ">&nbsp;</" + dragTagName + ">");

                    //$container.attr("data-listidx", i).mousedown(this.grabItem).bind("dragsort-uninit", this.uninit);  这里取消在dom结构上随便绑定 属性
                    this.index=i;
                    $container.mousedown(this.grabItem).bind("dragsort-uninit", this.uninit);
                    this.styleDragHandlers(true);
                },

                uninit: function() {
                    var _list = lists[newList.index];
                    $(_list.container).unbind("mousedown", _list.grabItem).unbind("dragsort-uninit");
                    _list.styleDragHandlers(false);
                },

                getItems: function() {
                    return $(this.container).children(opts.itemSelector);
                },

                styleDragHandlers: function(cursor) {
                    this.getItems().map(function() { return $(this).is(opts.dragSelector) ? this : $(this).find(opts.dragSelector).get(); }).css("cursor", cursor ? "pointer" : "");
                },

                grabItem: function(e) {
                    var dragHandle = e.target; 	//拖动目标
                    if (e.which !== 1 || $(dragHandle).is(opts.dragSelectorExclude) || $(dragHandle).closest(opts.dragSelectorExclude).size() > 0 || $(dragHandle).closest(opts.itemSelector).size() == 0){
                        return;
                    }

                    e.preventDefault();

                    while (!$(dragHandle).is(opts.dragSelector)) {
                        if (dragHandle == this) return;
                        dragHandle = dragHandle.parentNode;
                    }

                    var _list = lists[newList.index],
                        item = this,
                        _$container=$(_list.container), 	// 拖动范围
                        _trigger = function() {
                            _list.dragStart.call(item, e);
                            $(_list.container).unbind("mousemove", _trigger);
                        };

                    $(dragHandle).attr("data-cursor", $(dragHandle).css("cursor"));
                    $(dragHandle).css("cursor", "move");

                    _$container.mousemove(_trigger).mouseup(function() { _$container.unbind("mousemove", _trigger); $(dragHandle).css("cursor", $(dragHandle).attr("data-cursor")); });

                },

                dragStart: function(e) {
                    if (list != null && list.draggedItem != null){
                        list.dropItem();
                    }

                    list = lists[newList.index];
                    list.draggedItem = $(e.target).closest(opts.itemSelector);

                    var mt = parseInt(list.draggedItem.css("marginTop")),
                        ml = parseInt(list.draggedItem.css("marginLeft"));

                    list.offset = list.draggedItem.offset();
                    list.offset.top = e.pageY - list.offset.top + (isNaN(mt) ? 0 : mt) - 1;
                    list.offset.left = e.pageX - list.offset.left + (isNaN(ml) ? 0 : ml) - 1;

                    if (!opts.dragBetween) {
                        var containerHeight = $(list.container).outerHeight() === 0 ? Math.max(1, Math.round(0.5 + list.getItems().size() * list.draggedItem.outerWidth() / $(list.container).outerWidth())) * list.draggedItem.outerHeight() : $(list.container).outerHeight();
                        list.offsetLimit = $(list.container).offset();
                        list.offsetLimit.right = list.offsetLimit.left + $(list.container).outerWidth() - list.draggedItem.outerWidth();
                        list.offsetLimit.bottom = list.offsetLimit.top + containerHeight - list.draggedItem.outerHeight();
                    }

                    //create placeholder item
                    var h = list.draggedItem.height(),
                        w = list.draggedItem.width();
                    if (opts.itemSelector === "tr") {
                        list.draggedItem.children().each(function() { $(this).width($(this).width()); });  //table 下必须给他一个固定的width来限制他 如果没有的话,他会自定义大小
                        list.placeHolderItem = list.draggedItem.clone().attr("data-placeholder", true);
                        list.draggedItem.after(list.placeHolderItem);
                        list.placeHolderItem.children().each(function() { $(this).css({ borderWidth:0, width: $(this).width() + 1, height: $(this).height() + 1 }).html("&nbsp;"); });
                    } else if(opts.itemSelector === "td"){
                        var listTable = list.draggedItem.closest("table")[0];
                        $("<table id='" + listTable.id + "' style='border-width: 0px;' class='dragSortItem " + listTable.className + "'><tr></tr></table>").appendTo("body").children().append(list.draggedItem);
                    } else{
                        list.draggedItem.after(opts.placeHolderTemplate); // 在这里 opts.placeHolderTemplate 已经变啦 不再单纯的是dom字符串啦
                        list.placeHolderItem = list.draggedItem.next().css({ height: h, width: w }).attr("data-placeholder", true);
                    }

                    var orig = list.draggedItem.attr("style");
                    list.draggedItem.attr("data-oldstyle", orig ? orig : "");
                    list.draggedItem.css({ position: "absolute", opacity: 0.5, "z-index": 999, height: h, width: w });

                    //他这里利用 循环 来给拖动目标 赋值x y坐标
                    list.scroll = { moveX: 0, moveY: 0, maxX: $(document).width() - $(window).width(), maxY: $(document).height() - $(window).height() };
                    var $scrollContainer=$(opts.scrollContainer),
                        draggedItemXY=function(left,X){
                            var l = $scrollContainer[left](),
                                move = left === 'scrollLeft' ? list.scroll.moveX : list.scroll.moveY,
                                dir = left === 'scrollLeft' ? 'left' : 'top',
                                max = left === 'scrollLeft' ? list.scroll.maxX : list.scroll.maxY;

                            if(opts.scrollContainer != window){
                                $scrollContainer[left]($scrollContainer[left]() +move);
                                return;
                            }
                            if (move > 0 && l < max || move < 0 && l > 0) {
                                $scrollContainer[left](l + move);
                                list.draggedItem.css(dir, list.draggedItem.offset()[dir] + move + 1);
                            }
                        };
                    list.scroll.scrollY = window.setInterval(function() {
                        draggedItemXY('scrollTop');
                    }, 10);
                    list.scroll.scrollX = window.setInterval(function() {
                        draggedItemXY('scrollLeft');
                    }, 10);

                    $(lists).each(function(i, l) { 
                        l.createDropTargets(); 
                        l.buildPositionTable(); 
                    });
                    list.setPos(e.pageX, e.pageY);
                    $(document).bind("mousemove", list.swapItems).bind("mouseup", list.dropItem);
                    if (opts.scrollContainer != window){
                        $(window).bind("DOMMouseScroll mousewheel", list.wheel);
                    }

                },

                //set position of draggedItem
                setPos: function(x, y) {
                    //remove mouse offset so mouse cursor remains in same place on draggedItem instead of top left corner
                    var top = y - this.offset.top;
                    var left = x - this.offset.left;

                    //limit top, left to within box draggedItem can't be dragged outside of
                    if (!opts.dragBetween) {
                        top = Math.min(this.offsetLimit.bottom, Math.max(top, this.offsetLimit.top));
                        left = Math.min(this.offsetLimit.right, Math.max(left, this.offsetLimit.left));
                    }

                    //adjust top, left calculations to parent element instead of window if it's relative or absolute
                    this.draggedItem.parents().each(function() {
                        if ($(this).css("position") != "static" && (!$.browser.mozilla || $(this).css("display") != "table")) {
                            var offset = $(this).offset();
                            top -= offset.top;
                            left -= offset.left;
                            return false;
                        }
                    });

                    //set x or y auto-scroll amount
                    if (opts.scrollContainer == window) {
                        y -= $(window).scrollTop();
                        x -= $(window).scrollLeft();
                        y = Math.max(0, y - $(window).height() + 5) + Math.min(0, y - 5);
                        x = Math.max(0, x - $(window).width() + 5) + Math.min(0, x - 5);
                    } else {
                        var cont = $(opts.scrollContainer);
                        var offset = cont.offset();
                        y = Math.max(0, y - cont.height() - offset.top) + Math.min(0, y - offset.top);
                        x = Math.max(0, x - cont.width() - offset.left) + Math.min(0, x - offset.left);
                    }

                    list.scroll.moveX = x == 0 ? 0 : x * opts.scrollSpeed / Math.abs(x);
                    list.scroll.moveY = y == 0 ? 0 : y * opts.scrollSpeed / Math.abs(y);

                    //move draggedItem to new mouse cursor location
                    this.draggedItem.css({ top: top, left: left });
                },

                //if scroll container is a div allow mouse wheel to scroll div instead of window when mouse is hovering over
                wheel: function(e) {
                    if (($.browser.safari || $.browser.mozilla) && list && opts.scrollContainer != window) {
                        var cont = $(opts.scrollContainer);
                        var offset = cont.offset();
                        if (e.pageX > offset.left && e.pageX < offset.left + cont.width() && e.pageY > offset.top && e.pageY < offset.top + cont.height()) {
                            var delta = e.detail ? e.detail * 5 : e.wheelDelta / -2;
                            cont.scrollTop(cont.scrollTop() + delta);
                            e.preventDefault();
                        }
                    }
                },

                //build a table recording all the positions of the moveable list items
                buildPositionTable: function() {
                    var pos = [];
                    this.getItems().not([list.draggedItem[0], list.placeHolderItem[0]]).each(function(i) {
                        var loc = $(this).offset();
                        loc.right = loc.left + $(this).outerWidth();
                        loc.bottom = loc.top + $(this).outerHeight();
                        loc.elm = this;
                        pos[i] = loc;
                    });
                    this.pos = pos;
                },

                dropItem: function() {
                    if (!list.draggedItem){
                        return;
                    }

                    //list.draggedItem.attr("style", "") doesn't work on IE8 and jQuery 1.5 or lower
                    //list.draggedItem.removeAttr("style") doesn't work on chrome and jQuery 1.6 (works jQuery 1.5 or lower)
                    var orig = list.draggedItem.attr("data-oldstyle");
                    list.draggedItem.attr("style", orig);
                    if (orig == ""){
                        list.draggedItem.removeAttr("style");
                    }
                    list.draggedItem.removeAttr("data-oldstyle");

                    list.styleDragHandlers(true);

                    list.placeHolderItem.before(list.draggedItem);
                    list.placeHolderItem.remove();

                    $("[data-droptarget], .dragSortItem").remove();

                    window.clearInterval(list.scroll.scrollY);
                    window.clearInterval(list.scroll.scrollX);

                    //if position changed call dragEnd
                    if (list.draggedItem.attr("data-origpos") != $(lists).index(list) + "-" + list.getItems().index(list.draggedItem))
                        opts.dragEnd.apply(list.draggedItem);
                    list.draggedItem.removeAttr("data-origpos");

                    list.draggedItem = null;
                    $(document).unbind("mousemove", list.swapItems).unbind("mouseup", list.dropItem);
                    if (opts.scrollContainer != window)
                        $(window).unbind("DOMMouseScroll mousewheel", list.wheel);
                    return false;
                },

                swapItems: function(e) {
                    if (list.draggedItem == null){
                        return false;
                    }

                    //move draggedItem to mouse location
                    list.setPos(e.pageX, e.pageY);

                    //retrieve list and item position mouse cursor is over
                    var ei = list.findPos(e.pageX, e.pageY);
                    var nlist = list;
                    for (var i = 0; ei == -1 && opts.dragBetween && i < lists.length; i++) {
                        ei = lists[i].findPos(e.pageX, e.pageY);
                        nlist = lists[i];
                    }

                    //if not over another moveable list item return
                    if (ei == -1)
                        return false;

                    //save fixed items locations
                    var children = function() { return $(nlist.container).children().not(nlist.draggedItem); };
                    var fixed = children().not(opts.itemSelector).each(function(i) { this.idx = children().index(this); });

                    //if moving draggedItem up or left place placeHolder before list item the dragged item is hovering over otherwise place it after
                    if (lastPos == null || lastPos.top > list.draggedItem.offset().top || lastPos.left > list.draggedItem.offset().left)
                        $(nlist.pos[ei].elm).before(list.placeHolderItem);
                    else
                        $(nlist.pos[ei].elm).after(list.placeHolderItem);

                    //restore fixed items location
                    fixed.each(function() {
                        var elm = children().eq(this.idx).get(0);
                        if (this != elm && children().index(this) < this.idx)
                            $(this).insertAfter(elm);
                        else if (this != elm)
                            $(this).insertBefore(elm);
                    });

                    //misc
                    $(lists).each(function(i, l) { l.createDropTargets(); l.buildPositionTable(); });
                    lastPos = list.draggedItem.offset();
                    return false;
                },

                //returns the index of the list item the mouse is over
                findPos: function(x, y) {
                    for (var i = 0; i < this.pos.length; i++) {
                        if (this.pos[i].left < x && this.pos[i].right > x && this.pos[i].top < y && this.pos[i].bottom > y)
                            return i;
                    }
                    return -1;
                },

                createDropTargets: function() {  //创建放置目标
                    if (!opts.dragBetween){
                        return;
                    }

                    $(lists).each(function() {
                        var ph = $(this.container).find("[data-placeholder]"),
                            dt = $(this.container).find("[data-droptarget]");

                        if (ph.length > 0 && dt.length > 0){
                            dt.remove();
                        }else if (ph.length===0&&dt.length===0) {
                            if (opts.itemSelector === "td"){
                                $(opts.placeHolderTemplate).attr("data-droptarget", true).appendTo(this.container);
                            }else{
                                $(this.container).append(list.placeHolderItem.removeAttr("data-placeholder").clone().attr("data-droptarget", true));
                            }

                            list.placeHolderItem.attr("data-placeholder", true);
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
