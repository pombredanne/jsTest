var isFocus=false; //是否为焦点
var cal;
function SelectDate(obj){
    var date = new Date();
    var by = date.getFullYear()-10; //最小值 → 10 年前
    var ey = date.getFullYear()+10; //最大值 → 10 年后
    console.log(cal)
    cal = !!cal ?  cal :new Calendar(by, ey, 0);    //初始化为中文版，1为英文版
    cal.show(obj);
}

/**//* 返回日期 */
String.prototype.toDate = function(style){
    var years = (this.substring(style.indexOf('y'),style.lastIndexOf('y')+1))- 0,
        months = (this.substring(style.indexOf('M'),style.lastIndexOf('M')+1))- 0,
        days = (this.substring(style.indexOf('d'),style.lastIndexOf('d')+1))-0;

    var date=new Date(years,(months-1),days)
    return date;
}
/**//* 格式化日期 */
Date.prototype.format = function(style){
    var o = {
        "M+" : this.getMonth() + 1, //month
        "d+" : this.getDate(),      //day
        "h+" : this.getHours(),     //hour
        "m+" : this.getMinutes(),   //minute
        "s+" : this.getSeconds(),   //second
        "w+" : "天一二三四五六".charAt(this.getDay()),   //week
        "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(style)){
        style = style.replace(RegExp.$1,(this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for(var k in o){
        if(new RegExp("("+ k +")").test(style)){
            style = style.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return style;
};

/**//*
 * 日历类
 * @param   beginYear 1990
 * @param   endYear   2010
 * @param   lang      0(中文)|1(英语) 可自由扩充
 * @param   dateFormatStyle "yyyy-MM-dd";
 */
function Calendar(beginYear, endYear, lang, dateFormatStyle){
    this.beginYear = beginYear||1990;
    this.endYear = endYear||2013;
    this.lang = lang||0;            //0(中文) | 1(英文)
    this.dateFormatStyle =dateFormatStyle|| "yyyy-MM-dd";

    this.dateControl = null;
    this.panel = this.$Id("calendarPanel"); //日期总div
    this.container = this.$Id("ContainerPanel");//日期的div
    this.form = null;

    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();


    this.colors = {
        "cur_word"      : "#FFFFFF", //当日日期文字颜色
        "cur_bg"        : "#83A6F4", //当日日期单元格背影色
        "sel_bg"        : "#FFCCCC", //已被选择的日期单元格背影色
        "sun_word"      : "#FF0000", //星期天文字颜色
        "sat_word"      : "#0000FF", //星期六文字颜色
        "td_word_light" : "#333333", //单元格文字颜色
        "td_word_dark" : "#CCCCCC", //单元格文字暗色
        "td_bg_out"     : "#EFEFEF", //单元格背影色
        "td_bg_over"    : "#FFCC00", //单元格背影色
        "tr_word"       : "#FFFFFF", //日历头文字颜色
        "tr_bg"         : "#666666", //日历头背影色
        "input_border" : "#CCCCCC", //input控件的边框颜色
        "input_bg"      : "#EFEFEF"   //input控件的背影色
    }
    this.draw();
    this.bindYear();
    this.bindMonth();
    this.changeSelect();
    this.bindData();
}

/*
 * 日历类属性（语言包，可自由扩展）
 */
Calendar.language ={
    "year"   : [[""], [""]],
    "months" : [["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]],
    "weeks" : [["日","一","二","三","四","五","六"],["SUN","MON","TUR","WED","THU","FRI","SAT"]],
    "clear" : [["清空"], ["CLS"]],
    "today" : [["今天"], ["TODAY"]],
    "close" : [["关闭"], ["CLOSE"]]
}

Calendar.prototype.draw = function(){
    var calendar = this;
    var str = '';
    str+= ' <div name="calendarForm" style="margin: 0px;">';
    str+= '    <table width="100%" border="0" cellpadding="0" cellspacing="1">';
    str+= '      <tr>';
    str+= '        <th align="left" width="1%"><input style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:16px;height:20px;" name="prevMonth" type="button" id="prevMonth" value="&lt;" /></th>';
    str+= '        <th align="center" width="98%" nowrap="nowrap"><select name="calendarYear" id="calendarYear" style="font-size:12px;"></select><select name="calendarMonth" id="calendarMonth" style="font-size:12px;"></select></th>';
    str+= '        <th align="right" width="1%"><input style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:16px;height:20px;" name="nextMonth" type="button" id="nextMonth" value="&gt;" /></th>';
    str+= '      </tr>';
    str+= '    </table>';
    str+= '    <table id="calendarTable" width="100%" style="border:0px solid #CCCCCC;background-color:#FFFFFF" border="0" cellpadding="3" cellspacing="1">';
    str+= '      <tr>';
    for(var i = 0; i < 7; i++){
        str+= '  <th style="font-weight:normal;background-color:' + calendar.colors["tr_bg"] + ';color:' + calendar.colors["tr_word"] + ';">' + Calendar.language["weeks"][this.lang][i] + '</th>';
    }
    str+= '      </tr>';
    for(var i = 0; i < 6;i++){
        str+= '    <tr align="center">';
        for(var j = 0; j < 7; j++){
            if (j === 0){   //周日
                str+= ' <td style="cursor:pointer;color:' + calendar.colors["sun_word"] + ';"></td>';
            } else if(j === 6){ //周六
                str+= ' <td style="cursor:pointer;color:' + calendar.colors["sat_word"] + ';"></td>';
            } else{
                str+= ' <td style="cursor:pointer;"></td>';
            }
        }
        str+= '    </tr>';
    }
    str+= '      <tr style="background-color:' + calendar.colors["input_bg"] + ';">';
    str+= '        <th colspan="2"><input name="calendarClear" type="button" id="calendarClear" value="' + Calendar.language["clear"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:20px;font-size:12px;"/></th>';
    str+= '        <th colspan="3"><input name="calendarToday" type="button" id="calendarToday" value="' + Calendar.language["today"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:20px;font-size:12px;"/></th>';
    str+= '        <th colspan="2"><input name="calendarClose" type="button" id="calendarClose" value="' + Calendar.language["close"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:20px;font-size:12px;"/></th>';
    str+= '      </tr>';
    str+= '    </table>';
    str+= ' </div>';
    this.panel.innerHTML = str;//日期架子完毕

    //上一月
    var obj = this.$Id("prevMonth");
    obj.onclick = function (){calendar.goPrevMonth(calendar);}
    obj.onblur = function (){calendar.onblur();}
    this.prevMonth= obj;

    //下一月
    obj = this.$Id("nextMonth");
    obj.onclick = function (){calendar.goNextMonth(calendar);}
    obj.onblur = function (){calendar.onblur();}
    this.nextMonth= obj;

    //清空
    obj = this.$Id("calendarClear");
    obj.onclick = function (){calendar.dateControl.value = "";calendar.hide();}
    this.calendarClear = obj;

    //关闭
    obj = this.$Id("calendarClose");
    obj.onclick = function (){calendar.hide();}
    this.calendarClose = obj;

    //修改年
    obj = this.$Id("calendarYear");
    obj.onchange = function (){calendar.update(calendar);}
    obj.onblur = function (){calendar.onblur();}
    this.calendarYear = obj;

    //修改月
    obj = this.$Id("calendarMonth");
    obj.onchange = function (){calendar.update(calendar);}
    obj.onblur = function (){calendar.onblur();}
    this.calendarMonth = obj;

    //修改天
    obj = this.$Id("calendarToday");
    obj.onclick = function (){
        var today = new Date(),
            cal=calendar;
        cal.date = today;
        cal.year = today.getFullYear();
        cal.month = today.getMonth();
        cal.changeSelect();
        cal.bindData();
        cal.dateControl.value = today.format(cal.dateFormatStyle);
        cal.hide();
    }
    this.calendarToday = obj;
}

//年份下拉框绑定数据
Calendar.prototype.bindYear = function(){
    var cy = this.calendarYear;

    for (var i = this.beginYear; i <= this.endYear; i++){
        cy.options[cy.length] = new Option(i , i);
    }
}

//月份下拉框绑定数据
Calendar.prototype.bindMonth = function(){
    var cm = this.calendarMonth,
        moth=Calendar.language["months"][this.lang];

    for (var i = 0; i < 12; i++){
        cm.options[cm.length] = new Option(moth[i], i);
    }
}

//向前一月
Calendar.prototype.goPrevMonth = function(e){
    if (this.year == this.beginYear && this.month == 0){return;}
    this.month--;
    if (this.month == -1){
        this.year--;
        this.month = 11;
    }
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
}

//向后一月
Calendar.prototype.goNextMonth = function(e){
    if (this.year == this.endYear && this.month == 11){return;}
    this.month++;
    if (this.month == 12){
        this.year++;
        this.month = 0;
    }
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
}

//改变SELECT选中状态
Calendar.prototype.changeSelect = function(){
    var cy = this.calendarYear,
        cm = this.calendarMonth;

    for (var i= 0; i < cy.length; i++){
        if (cy.options[i].value === ''+this.date.getFullYear()){
            cy[i].selected = true;
            break;
        }
    }

    for (i= 0; i < 12; i++){
        if (cm.options[i].value === ''+this.date.getMonth()){
            cm[i].selected = true;
            break;
        }
    }
}

//更新年、月
Calendar.prototype.update = function (element){
    var sy=element.calendarYear,
        sm=element.calendarMonth;
    this.year = sy.options[sy.selectedIndex].value;
    this.month = sm.options[sm.selectedIndex].value;
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
}

//给当前月份中的td绑定事件
Calendar.prototype.bindData = function (){
    var calendar = this;
    var dateArray = this.getMonthViewArray(this.date.getFullYear(), this.date.getMonth());
    var tds = this.$Id("calendarTable").getElementsByTagName("td");
    for(var i = 0; i < 42; i++){

        tds[i].style.backgroundColor = calendar.colors["td_bg_out"];//制定方格
        tds[i].innerHTML = dateArray[i];
        if (dateArray[i] !== '&nbsp;'){
            var _date=calendar.date,
                _newDate=function(days){
                    days=days||dateArray[i];
                    return new Date(_date.getFullYear(),_date.getMonth(),days).format(calendar.dateFormatStyle);
                }

            tds[i].onclick = function () {
                if(calendar.dateControl){
                    calendar.dateControl.value= _newDate(this.innerHTML);
                }
                calendar.hide();
            }
            tds[i].onmouseover = function () {
                this.style.backgroundColor = calendar.colors["td_bg_over"];
            }
            tds[i].onmouseout = function () {
                this.style.backgroundColor = calendar.colors["td_bg_out"];
            }

            var styleBac=function(style){
                style=style||'cur_bg';
                var t=function(element){
                    return element.style.backgroundColor = calendar.colors[style];
                }
                t(tds[i]);
                tds[i].onmouseout = function () {
                    t(this);
                }
            }
            //判断今天的
            if (new Date().format(calendar.dateFormatStyle) ===_newDate()) {
                styleBac();
            }

            //设置已被选择的日期单元格背影色
            if (calendar.dateControl&&calendar.dateControl.value === _newDate()) {
                styleBac('sel_bg');
            }
        }else{
            tds[i].style.cursor='default';
        }
    }
}

//得出当前月的 日期安排
Calendar.prototype.getMonthViewArray = function (y, m) {
    var mvArray = [],
        dayOfFirstDay = new Date(y, m, 1).getDay(),
        daysOfMonth = new Date(y, m + 1, 0).getDate();

    for (var i = 0; i < 42; i++) {
        mvArray[i]='&nbsp;';
    }

    for (i = 0; i < daysOfMonth; i++){
        mvArray[i + dayOfFirstDay] = i + 1;
    }
    return mvArray;
}

//扩展 document.$Id(id) 多浏览器兼容性 from meizz tree source
Calendar.prototype.$Id = function(id){
    if(id){
        return document.getElementById.apply(document, arguments);
    }
    return '';
}

//扩展 object.$Tag(tagName)
Calendar.prototype.$Tag = function(tagName){
    if(tagName){
        return document.getElementsByTagName.apply(document,arguments);
    }
    return '';
}
//取得HTML控件绝对位置
Calendar.prototype.getAbsPoint = function (e){
    var x = e.offsetLeft;
    var y = e.offsetTop;
    while(e = e.offsetParent){
        x += e.offsetLeft;
        y += e.offsetTop;
    }
    return {"x": x, "y": y};
}

//显示日历
Calendar.prototype.show = function (dateObj, popControl) {
    var calendar=this;
    if (dateObj == null){
        throw new Error("arguments[0] is necessary")
    }
    this.dateControl = dateObj;

    this.date = (dateObj.value.length > 0) ? new Date(dateObj.value.toDate(this.dateFormatStyle)) : new Date() ;//若为空则显示当前月份
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.changeSelect();
    this.bindData();
    if (popControl == null){
        popControl = dateObj;
    }
    var xy = this.getAbsPoint(popControl);
    this.panel.style.left = xy.x -25 + "px";
    this.panel.style.top = (xy.y + dateObj.offsetHeight) + "px";

    this.panel.style.display = "";
    this.container.style.display = "";

    dateObj.onblur = function(){calendar.onblur();}
    this.container.onmouseover = function(){isFocus=true;}
    this.container.onmouseout = function(){isFocus=false;}
}

//隐藏日历
Calendar.prototype.hide = function() {
    this.panel.style.display = "none";
    this.container.style.display = "none";
    isFocus=false;
}

//焦点转移时隐藏日历
Calendar.prototype.onblur = function() {
    if(!isFocus){this.hide();}
}
document.write('<div id="ContainerPanel" style="display:none;"><div id="calendarPanel" style="position: absolute;display: none;z-index: 9999;');
document.write('background-color: #FFFFFF;border: 1px solid #CCCCCC;width:175px;font-size:12px;margin-left:25px;"></div>');
if(document.all){
    document.write('<iframe style="position:absolute;z-index:2000;width:expression(this.previousSibling.offsetWidth);');
    document.write('height:expression(this.previousSibling.offsetHeight);');
    document.write('left:expression(this.previousSibling.offsetLeft);top:expression(this.previousSibling.offsetTop);');
    document.write('display:expression(this.previousSibling.style.display);" scrolling="no" frameborder="no"></iframe>');
}
document.write('</div>');
