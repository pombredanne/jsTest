//http://wlog.cn/code/jquery/jQuery-Calendar-Widget/demo.html
 
(function ($) {
 
    function calendarWidget(el, params) {
 
        var now = new Date(),
            thismonth = now.getMonth(),
            thisyear = now.getYear() + 1900,
            opts = {
                month: thismonth,
                year: thisyear
            },
            m = 0,
            table = '';
 
        $.extend(opts, params);
 
        var monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            month  = parseInt(opts.month),
            year = parseInt(opts.year);
 
        // next month
        if (month === 11) {
            var next_month = '<a href="?month=' + 1 + '&year=' + (year + 1) + '" title="' + monthNames[0] + ' ' + (
                year + 1) + '">' + monthNames[0] + ' ' + (year + 1) + '</a>';
        } else {
            var next_month = '<a href="?month=' + (month + 2) + '&year=' + (year) + '" title="' + monthNames[month +
                1] + ' ' + (year) + '">' + monthNames[month + 1] + ' ' + (year) + '</a>';
        }
 
        // previous month
        if (month === 0) {
            var prev_month = '<a href="?month=' + 12 + '&year=' + (year - 1) + '" title="' + monthNames[11] + ' ' +
                (year - 1) + '">' + monthNames[11] + ' ' + (year - 1) + '</a>';
        } else {
            var prev_month = '<a href="?month=' + (month) + '&year=' + (year) + '" title="' + monthNames[month - 1] +
                ' ' + (year) + '">' + monthNames[month - 1] + ' ' + (year) + '</a>';
        }
 
        table += '<h3 id="current-month">' + monthNames[month] + ' ' + year + '</h3>';
        //table += ('<div class="nav-prev">'+ prev_month +'</div>');
        //table += ('<div class="nav-next">'+ next_month +'</div>'); 
        table += '<table class="calendar-month " ' + 'id="calendar-month' + i + ' " cellspacing="0"><tr>';
 
        table += '<tr>';
        for (d = 0; d < 7; d++) {
            table += '<th class="weekday">' + dayNames[d] + '</th>';
        }
        table += '</tr>';
 
        var prev_days = getDaysInMonth(month, year),
            firstDayDate = new Date(year, month, 1),
            firstDay = firstDayDate.getDay(),
            prev_m = month === 0 ? 11 : month - 1,
            prev_y = prev_m === 11 ? year - 1 : year,
            prev_days = getDaysInMonth(prev_m, prev_y);

        firstDay = (firstDay === 0 && firstDayDate) ? 7 : firstDay;
 
        var i = 0;
        for (j = 0; j < 42; j++) {
 
            if ((j < firstDay)) {
                table += ('<td class="other-month"><span class="day">' + (prev_days - firstDay + j + 1) +
                    '</span></td>');
            } else if ((j >= firstDay + getDaysInMonth(month, year))) {
                i = i + 1;
                table += ('<td class="other-month"><span class="day">' + i + '</span></td>');
            } else {
                table += ('<td class="current-month day' + (j - firstDay + 1) + '"><span class="day">' + (j - firstDay +
                    1) + '</span></td>');
            }
            if (j % 7 === 6) {
                table += ('</tr>');
            }
        }
 
        table += ('</table>');
 
        el.html(table);
    }
 
    function getDaysInMonth(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((month === 1) && (year % 4 === 0) && ((year % 100 != 0) || (year % 400 === 0))) {
            return 29;
        } else {
            return daysInMonth[month];
        }
    }
 
    $.fn.calendarWidget = function (params) {
        calendarWidget(this, params);
        return this;
    };
 
})(jQuery);
