/*!
 * Pikaday
 * Copyright © 2012 David Bushell | BSD & MIT license | http://dbushell.com/
 */

function formatDate(date,style){        //此方法在FF中会将数据缓存 因此 平均时间大约在0.5ms  chrome不缓存数据,但平均速度老大 ie你懂得  相比moment速度相当
    style=style||'YYYY-MM-DD';
    var o = {
        "M+" : date.getMonth() + 1, //month
        "D+" : date.getDate(),      //day
        "H+" : date.getHours(),     //hour
        "m+" : date.getMinutes(),   //minute
        "S+" : date.getSeconds(),   //second
        "W+" : "天一二三四五六".charAt(date.getDay()),   //week
        "Q+" : Math.floor((date.getMonth() + 3) / 3), //quarter
        "S" : date.getMilliseconds() //millisecond
    }
    if(/(Y+)/.test(style)){
        style = style.replace(RegExp.$1,(date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for(var k in o){
        if(new RegExp("("+ k +")").test(style)){
            style = style.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return style;
}


(function(window, document, undefined){

    'use strict';

    var hasMoment = typeof window.moment === 'function',

        hasEventListeners = !!window.addEventListener,

        sto = window.setTimeout,
        addEvent = (function(){
            if (window.addEventListener) {
                return function(el, sType, fn, capture) {
                    el.addEventListener(sType, function(e) {
                        fn.call(el, e);
                    }, (capture));
                };
            } else if (window.attachEvent) {
                return function(el, sType, fn, capture) {
                    el.attachEvent("on" + sType, function(e) {
                        fn.call(el, e);
                    });
                };
            }
        })(),

        removeEvent = function(el, e, callback, capture){
            if (hasEventListeners) {
                el.removeEventListener(e, callback, !!capture);
            } else {
                el.detachEvent('on' + e, callback);
            }
        },
        getText=(function(){
            if (document.all) {
                return function(element) {
                    return element.innerText;
                };
            } else{
                return function(element) {
                    return element.textContent
                };
            }
        })(),
        fireEvent = function(el, eventName, data){  //触发事件
            var ev;

            if (document.createEvent) {
                ev = document.createEvent('HTMLEvents');
                ev.initEvent(eventName, true, false);
                ev = extend(ev, data);
                el.dispatchEvent(ev);
            } else if (document.createEventObject) {
                ev = document.createEventObject();
                ev = extend(ev, data);
                el.fireEvent('on' + eventName, ev);
            }
        },

        trim = function(str){
            return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
        },

        hasClass = function(el, cn){
            return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
        },

        addClass = function(el, cn){
            if (!hasClass(el, cn)) {
                el.className = (el.className === '') ? cn : el.className + ' ' + cn;
            }
        },

        removeClass = function(el, cn){
            el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
        },

        isArray = function(obj){
            return (/Array/).test(Object.prototype.toString.call(obj));
        },

        isDate = function(obj){
            return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
        },

        isLeapYear = function(year){    // 润年
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        },

        getDaysInMonth = function(year, month){
            return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        compareDates = function(a,b){
            return a.getTime() === b.getTime();
        },

        extend = function(to, from, overwrite){
            var prop, hasProp;
            for (prop in from) {
                hasProp = to[prop] !== undefined;
                if (hasProp && typeof from[prop] === 'object' && from[prop].nodeName === undefined) {
                    if (isDate(from[prop])) {
                        if (overwrite) {
                            to[prop] = new Date(from[prop].getTime());
                        }
                    }
                    else if (isArray(from[prop])) {
                        if (overwrite) {
                            to[prop] = from[prop].slice(0);
                        }
                    } else {
                        to[prop] = extend({}, from[prop], overwrite);
                    }
                } else if (overwrite || !hasProp) {
                    to[prop] = from[prop];
                }
            }
            return to;
        },

        formatDate=function(date,style){        //此方法在FF中会将数据缓存 因此 平均时间大约在0.5ms  chrome不缓存数据,但平均速度老大 ie你懂得  相比moment速度相当
          return  window.formatDate(date,style);
        },
        push=function(array,str){
            array[array.length]=str;
        },

        /**
         * defaults and localisation
         */
        defaults = {

            // 绑定到表单
            field: null,

            // 是否自动获取焦点显示?
            bound: true,

            // 格式化时间   需要moment.js的帮助
            format: 'YYYY-MM-DD',

            //设置默认时间
            defaultDate: null,
            setDefaultDate: false,

            // 规定周日 周一的安排
            firstDay: 0,

            // 设定最大时间大小
            minDate: new Date(1990,0,1),
            maxDate: new Date(2080,0,1),
            //阿拉伯日历
            isRTL: false,

            isInput:true,

            i18n: {
                    previousMonth : '上一月',
                    nextMonth     : '下一月',
                    months        : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                    //monthsShort   : ['Jan_Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    weekdays      : ['周日','周一','周二','周三','周四','周五','周六'],
                    weekdaysShort : ['日','一','二','三','四','五','六']
            },

            // 回调函数
            onSelect: null,
            onOpen: null,
            onClose: null,
            onDraw: null
        },

        renderDayName = function(opts, day, abbr){  //week名称
            day += opts.firstDay;
            while (day >= 7) {
                day -= 7;
            }
            return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
        },
        //组装日历 -- 天  行 内容
        renderDay = function(i, isSelected, isToday, isDisabled, isEmpty){
            if (isEmpty) {
                return '<td class="is-empty"></td>';
            }
            var arr = [];

            isDisabled && push(arr,'is-disabled');
            isToday && push(arr,'is-today');
            isSelected && push(arr,'is-selected');

            return '<td data-day="' + i + '" class="' + arr.join(' ') + '"><button class="pika-button" type="button">' + i + '</button>' + '</td>';
        },
        renderRow = function(days, isRTL){
            return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
        },
        renderBody = function(rows){
            return '<tbody>' + rows.join('') + '</tbody>';
        },
        renderHead = function(opts){
            var i, arr = [];
            for (i = 0; i < 7; i++) {
                arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
            }
            return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
        },
        renderTitle = function(instance){   //绘制头部 包括上月 下月
            var i, j, arr,
                opts = instance._o,
                month = instance._m,
                year  = instance._y,
                selectYearMin=opts.selectYear===opts.minYear,
                selectYearMax=opts.selectYear===opts.maxYear-1,
                html = '<div class="pika-title">',
                prev = true,
                next = true;

            for (arr = [], i = 0; i < 12; i++) {
                var disabled=((selectYearMin && i < opts.minMonth) || (selectYearMax && i > opts.maxMonth) ? 'disabled' : '');
                push(arr,'<option value="' + i + '"' +(i === month ? ' selected': '') + disabled+ '>' +opts.i18n.months[i] + '</option>');
            }
            html += '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month">' + arr.join('') + '</select></div>';

            i=opts.minYear;
            j=opts.maxYear;

            for (arr = []; i < j && i <= opts.maxYear; i++) {
                if (i >= opts.minYear) {
                    push(arr,'<option value="' + i + '"' + (i === year ? ' selected': '') + '>' + (i) + '</option>')
                }
            }
            html += '<div class="pika-label">' + year + '<select class="pika-select pika-select-year">' + arr.join('') + '</select></div>';

            if (selectYearMin && (month === 0 || opts.minMonth >= month)) {
                prev = false;
            }
            if (selectYearMax && (month === 11 || opts.maxMonth <= month)) {
                next = false;
            }

            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';

            return html += '</div>';
        },

        renderTable = function(opts, data)
        {
            return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
        };


    /**
     * Pikaday constructor
     */
    window.Pikaday = function(options){

        var self = this,
            opts = self.config(options);

        if(opts.field.tagName.toUpperCase()!=='INPUT'){
            opts.fieldInp=opts.valTex;
            opts.isInput=false;
        }else{
            opts.fieldInp=opts.field;
        }

        self._onMouseDown = function(e){

            if (!self._v) {
                return;
            }

            e = e || window.event;

            var target = e.target || e.srcElement,
                 id=target.id;

            if (!target) {
                return;
            }

            if (!hasClass(target, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty')) {
                    self.setDate(new Date(self._y, self._m, parseInt(target.innerHTML, 10)));
                    if (opts.bound) {
                        sto(function() {
                            self.hide();
                        }, 100);
                    }
                    return;
                }
                else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                }
                else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                }
            }

            if(id){

                if(id==='clear'){
                    if(self._o.isInput){
                        self._o.fieldInp.value='';
                    }else{
                        self._o.fieldInp.innerHTML='';
                    }
                }
                id==='today' && (self.setDate(new Date(),true));
                self.hide();
            }

            if (!hasClass(target, 'pika-select')) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    return e.returnValue = false;
                }
            } else {
                self._c = true;
            }

        };

        self._onChange = function(e){
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onInputChange = function(e){
            var date;

            if (e.firedBy === self) {
                return;
            }
            if (hasMoment) {
                if(opts.isInput){
                    date = window.moment(opts.fieldInp.value, opts.format);
                }else{
                    date = window.moment(getText(opts.fieldInp), opts.format);
                }
                date = date ? date.toDate() : null;
            }else {
                if(opts.isInput){
                    date = new Date(Date.parse(opts.field.value));
                }else{
                    date = new Date(trim(Date.parse(getText(opts.fieldInp))));
                }
            }
            self.setDate(isDate(date) ? date : null);
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function(e){
            self.show();
        };

        self._onInputClick = function(e){
            self.show();
        };

        self._onInputBlur = function(e){
            if (!self._c) {
               self._b=self.hide();
            }
            self._c = false;
        };

        self._onClick = function(e){
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.field) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '');

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);

        if (opts.field) {
            if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                var _value;
                if(opts.isInput){
                    _value=opts.field.value;
                }else{
                   // _value=trim(getText(opts.fieldInp));TODO 查询这里为什么不需要trim
                    _value=getText(opts.fieldInp);
                }
                if (hasMoment && _value) {
                    opts.defaultDate = window.moment(_value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(_value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.gotoDate(defDate);
            } else {
                self.setDate(defDate, true);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.field, 'click', self._onInputClick);
            addEvent(opts.field, 'focus', self._onInputFocus);
            addEvent(opts.field, 'blur', self._onInputBlur);
        } else {
            this.show();
        }

    };


    /**
     * public Pikaday API
     */
    window.Pikaday.prototype = {


        /**
         * configure functionality
         */
        config: function(options){
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true),
                minDate=opts.minDate,
                maxDate=opts.maxDate;

            opts.minYear=function(){
                return minDate.getFullYear();
            }()
            opts.maxYear=function(){
                return maxDate.getFullYear()+1;
            }()
            opts.maxMonth=function(){
                return maxDate.getMonth();
            }()
            opts.minMonth=function(){
                return minDate.getMonth();
            }()
            opts.selectYear=new Date().getFullYear();
            return opts;
        },
        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function(format){
            var self=this,
                date=self._d;
            format=format||self._o.format;
            //return !isDate(this._d) ? '' : hasMoment ? window.moment(this._d).format(format || this._o.format) : this._d.toDateString();

            return !isDate(date)?'':hasMoment?window.moment(date).format(format):formatDate(date,format);

        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function()
        {
            return hasMoment ? window.moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function(date)
        {
            if (hasMoment && window.moment.isMoment(date)) {
                this.setDate(date.toDate());
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function()
        {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set the current selection
         */
        setDate: function(date, preventOnSelect)
        {
            if (!date) {
                this._d = null;
                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (isDate(min) && date < min) {
                date = min;
            } else if (isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());
            this._d.setHours(0,0,0,0);
            this.gotoDate(this._d);

            if (this._o.field) {
                if(this._o.isInput){
                    this._o.field.value = this.toString();
                }else{
                    this._o.fieldInp.innerHTML = this.toString();
                }

                fireEvent(this._o.field, "change", { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function(date)
        {
            if (!isDate(date)) {
                return;
            }
            this._y = date.getFullYear();
            this._m = date.getMonth();
            this.draw();
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function(month)
        {
            if (!isNaN( (month = parseInt(month, 10)) )) {
                this._m = month < 0 ? 0 : month > 11 ? 11 : month;
                this.draw();
            }
        },

        nextMonth: function()
        {
            if (++this._m > 11) {
                this._m = 0;
                this._y++;
            }
            this.draw();
        },

        prevMonth: function()
        {
            if (--this._m < 0) {
                this._m = 11;
                this._y--;
            }
            this.draw();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function(year){
            if (!isNaN(year)) {
                this._y = parseInt(year, 10);
                this._o.selectYear=this._y;
                this.draw();
            }
        },

        /**
         * refresh the HTML
         */
        draw: function(force)
        {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth;

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            this.el.innerHTML = renderTitle(this) + this.render(this._y, this._m);

            if (opts.bound) {
                var pEl  = opts.field,
                    left = pEl.offsetLeft,
                    top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
                this.el.style.cssText = 'position:absolute;left:' + left + 'px;top:' + top + 'px;';
                sto(function() {
                    opts.field.focus();
                }, 1);
            }

            if (typeof this._o.onDraw === 'function') {
                var self = this;
                sto(function() {
                    self._o.onDraw.call(self);
                }, 0);
            }
        },

        /**
         * render HTML for a particular month
         */
        render: function(year, month)
        {
            var opts   = this._o,
                now    = new Date(),
                days   = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data   = [],
                row    = [];
            now.setHours(0,0,0,0);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var cells = days + before,
                after = cells;
            while(after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            for (var i = 0, r = 0; i < cells; i++)
            {
                var day = new Date(year, month, 1 + (i - before)),
                    isDisabled = (opts.minDate && day < opts.minDate) || (opts.maxDate && day > opts.maxDate),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    isEmpty = i < before || i >= (days + before);

                push(row,renderDay(1 + (i - before), isSelected, isToday, isDisabled, isEmpty))
                // row.push(renderDay(1 + (i - before), isSelected, isToday, isDisabled, isEmpty));
                if (++r === 7) {
                    data.push(renderRow(row, opts.isRTL))
;                    row = [];
                    r = 0;
                }
            }
            data.push('<tr><th scope="col" colspan="2"><abbr id="clear">清空</abbr></th><th scope="col" colspan="3"><abbr id="today">今天</abbr></th><th scope="col" colspan="2"><abbr id="close">关闭</abbr></th></tr>')
            return renderTable(opts, data);
        },

        isVisible: function()
        {
            return this._v;
        },

        show: function()
        {
            if (!this._v) {
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                }
                removeClass(this.el, 'is-hidden');
                this._v = true;
                this.draw();
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function()
        {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.cssText = '';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function()
        {
            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (this._o.field) {
                removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    removeEvent(this._o.field, 'click', this._onInputClick);
                    removeEvent(this._o.field, 'focus', this._onInputFocus);
                    removeEvent(this._o.field, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    var dynamicLoading = {
        css: function(path){
        if(!path || path.length === 0){
                throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        }
    }
    dynamicLoading.css('/static/js/date/dateStyle.css')

})(window, window.document);




