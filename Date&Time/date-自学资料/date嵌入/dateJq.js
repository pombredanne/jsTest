var cal;
function SelectDate(obj,param){
    param=param||{};
    cal = !!cal ?  cal :new Calendar(param),Calendar=null;
    cal.show(obj);
}

/* 返回日期 */
String.prototype.toDate = function(style){
    var years = this.substring(style.indexOf('y'),style.lastIndexOf('y')+1),
        months = this.substring(style.indexOf('M'),style.lastIndexOf('M')+1),
        days = this.substring(style.indexOf('d'),style.lastIndexOf('d')+1);

    var date=new Date(years,(months-1),days)
    return date;
}

/* 格式化日期 */
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

/*
 * 日历类
 * @param   beginYear 1990
 * @param   endYear   2010
 * @param   lang      0(中文)|1(英语) 可自由扩充
 * @param   dateFormatStyle "yyyy-MM-dd";
 */
function Calendar(param){
    this.beginYear = param.beginYear||2010;
    this.endYear = param.endYear||2020;
    this.lang = param.lang||0;            //0(中文) | 1(英文)
    this.dateFormatStyle =param.dateFormatStyle|| "yyyy-MM-dd";

    this.dateControl = null;
    this.panel = $("#calendarPanel"); //日期总div
    this.container = $("#ContainerPanel");//日期的div
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
$.extend(Calendar.prototype,{
    draw:function(){
        var calendar = this;
        var str = '';
        str+= ' <div name="calendarForm" style="margin: 0px;">';
        str+= '    <table width="100%" border="0" cellpadding="0" cellspacing="1">';
        str+= '      <tr>';
        str+= '        <th align="left" width="1%"><input style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:16px;height:20px;" name="prevMonth" type="button" id="prevMonth" class="Calendar" value="<" /></th>';
        str+= '        <th align="center" width="98%" nowrap="nowrap"><select class="Calendar" name="" id="calendarYear" style="font-size:12px;"></select><select class="Calendar" name="calendarMonth" id="calendarMonth" style="font-size:12px;"></select></th>';
        str+= '        <th align="right" width="1%"><input style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:16px;height:20px;" name="nextMonth" type="button" id="nextMonth" class="Calendar" value=">" /></th>';
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
                    str+= ' <td class="Calendar" style="cursor:pointer;color:' + calendar.colors["sun_word"] + ';"></td>';
                } else if(j === 6){ //周六
                    str+= ' <td class="Calendar" style="cursor:pointer;color:' + calendar.colors["sat_word"] + ';"></td>';
                } else{
                    str+= ' <td class="Calendar" style="cursor:pointer;"></td>';
                }
            }
            str+= '    </tr>';
        }
        str+= '      <tr style="background-color:' + calendar.colors["input_bg"] + ';">';
        str+= '        <th colspan="2"><input class="Calendar" name="calendarClear" type="button" id="calendarClear" value="' + Calendar.language["clear"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:20px;font-size:12px;"/></th>';
        str+= '        <th colspan="3"><input  name="calendarToday" type="button" id="calendarToday" value="' + Calendar.language["today"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:20px;font-size:12px;"/></th>';
        str+= '        <th colspan="2"><input class="Calendar" name="calendarClose" type="button" id="calendarClose" value="' + Calendar.language["close"][this.lang] + '" style="border: 1px solid ' + calendar.colors["input_border"] + ';background-color:' + calendar.colors["input_bg"] + ';width:100%;height:20px;font-size:12px;"/></th>';
        str+= '      </tr>';
        str+= '    </table>';
        str+= ' </div>';
        this.panel.html(str);//日期架子完毕

        //TODO 放弃blur事件
        //上一月
        this.prevMonth =$("#prevMonth");
        this.prevMonth.click(function(){calendar.goPrevMonth(calendar);});

        //下一月
        this.nextMonth = $("#nextMonth");
        this.nextMonth.click(function(){calendar.goNextMonth(calendar);});

        //清空
        this.calendarClear = $("#calendarClear");
        this.calendarClear.click(function(){
            calendar.dateControl.value='';
            calendar.hide();
        })

        //关闭
        this.calendarClose=$("#calendarClose");
        this.calendarClose.click(function(){
            calendar.hide();
        })

        //修改年
        this.calendarYear = $("#calendarYear");
        this.calendarYear.change(function(){calendar.update(calendar);});

        //修改月
        this.calendarMonth = $("#calendarMonth");
        this.calendarMonth.change(function(){calendar.update(calendar);});

        //修改今天
        this.calendarToday = $("#calendarToday");
        this.calendarToday.click(function(){
            var today = new Date(),
                cal=calendar;
            cal.date = today;
            cal.year = today.getFullYear();
            cal.month = today.getMonth();
            cal.changeSelect();
            cal.bindData();
            cal.dateControl.value = today.format(cal.dateFormatStyle);
        });
    },
    bindYear:function(){
        var cy = this.calendarYear[0];

        for (var i = this.beginYear; i <= this.endYear; i++){   
            cy.options[cy.length] = new Option(i , i);
        }
    },
    bindMonth:function(){
        var cm = this.calendarMonth[0],
            moth=Calendar.language["months"][this.lang];

        for (var i = 0; i < 12; i++){
            cm.options[cm.length] = new Option(moth[i], i);
        }
    },
    goPrevMonth:function(){
        if (this.year == this.beginYear && this.month == 0){return;}
        this.month--;
        if (this.month === -1){
            this.year--;
            this.month = 11;
        }
        this.date = new Date(this.year, this.month, 1);
        this.changeSelect();
        this.bindData();
    },
    goNextMonth:function(){
        if (this.year == this.endYear && this.month == 11){return;}
        this.month++;
        if (this.month == 12){
            this.year++;
            this.month = 0;
        }
        this.date = new Date(this.year, this.month, 1);
        this.changeSelect();
        this.bindData();
    },
    changeSelect:function(){
        this.calendarYear.val(this.date.getFullYear())
        this.calendarMonth.val(this.date.getMonth())
    },
    update:function(element){
        var sy=element.calendarYear,
            sm=element.calendarMonth;
        this.year = sy.val();
        this.month = sm.val();
        this.date = new Date(this.year, this.month, 1);
        this.changeSelect();
        this.bindData();
    },
    bindData:function(){
        var calendar = this;
        var dateArray = this.getMonthViewArray(this.date.getFullYear(), this.date.getMonth());
        var tds =$("#calendarTable td");
        for(var i = 0; i < 42; i++){

            tds[i].style.backgroundColor = calendar.colors["td_bg_out"];//制定方格
            tds[i].innerHTML = dateArray[i];
            if (dateArray[i] !== '&nbsp;'){
                var _date=calendar.date,
                    _newDate=function(days){
                        days=days||dateArray[i];
                        return new Date(_date.getFullYear(),_date.getMonth(),days).format(calendar.dateFormatStyle);
                    }

                var $tds=$(tds[i]);
                $tds.click(function(event){
                    event.stopPropagation();
                    if(calendar.dateControl){
                        calendar.dateControl.value= _newDate(this.innerHTML);
                    }
                    calendar.hide();                    
                })

                $tds.hover(function(){
                    this.style.backgroundColor = calendar.colors["td_bg_over"];
                },function(){
                    this.style.backgroundColor = calendar.colors["td_bg_out"];
                });

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
    },
    getMonthViewArray:function(y,m){
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
    },
    getAbsPoint:function(e){
        var x = e.offsetLeft;
        var y = e.offsetTop;
        while(e = e.offsetParent){
            x += e.offsetLeft;
            y += e.offsetTop;
        }
        return {"x": x, "y": y};
    },
    show:function(dateObj,popControl){
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
        this.panel.css({
            left:xy.x-25+'px',
            top:(xy.y+dateObj.offsetHeight)+'px'
        })

        $('#ContainerPanel').show();
    },
    hide:function(){
        $('#ContainerPanel').hide();
    }
});

document.write('<div id="ContainerPanel" style="display:none;"><div id="calendarPanel" style="position: absolute;z-index: 9999;');
document.write('background-color: #FFFFFF;border: 1px solid #CCCCCC;width:175px;font-size:12px;margin-left:25px;"></div>');
//if(document.all){
//    document.write('<iframe style="position:absolute;z-index:2000;width:expression(this.previousSibling.offsetWidth);');
//    document.write('height:expression(this.previousSibling.offsetHeight);');
//    document.write('left:expression(this.previousSibling.offsetLeft);top:expression(this.previousSibling.offsetTop);');
//    document.write('display:expression(this.previousSibling.style.display);" scrolling="no" frameborder="no"></iframe>');
//}
document.write('</div>');

$(document).click(function(event){
    if(event.target.className.toLowerCase()==='calendar'){
        return
    }
    $('#ContainerPanel').hide();    
});
(function(){
    $('#calendarYear option,#calendarMonth option').live('click',function(event){
        event.stopPropagation();
    })
})()

