(function(window,undefined){ //http://jackeysion.iteye.com/blog/513774
    "use strict";

    var regObj={
        yyyy : "([0-9]{4})",
        yy : "([0-9]{2})",
        MM : "(0[1-9]|1[0-2])",
        M : "([1-9]|1[0-2])",
        dd : "(0[1-9]|[1-2][0-9]|30|31)",
        d : "([1-9]|[1-2][0-9]|30|31)",
        HH : "([0-1][0-9]|20|21|22|23)",
        H : "([0-9]|1[0-9]|20|21|22|23)",
        mm : "([0-5][0-9])",
        m : "([0-9]|[1-5][0-9])",
        ss : "([0-5][0-9])",
        s : "([0-9]|[1-5][0-9])"
    },
    regexp;
    //isTimeReg=/^([0-9]{4})|([0-9]{2})|(0[1-9]|1[0-2])|([1-9]|1[0-2])|(0[1-9]|[1-2][0-9]|30|31)|([1-9]|[1-2][0-9]|30|31)|([0-1][0-9]|20|21|22|23)|([0-9]|1[0-9]|20|21|22|23)|([0-5][0-9])|([0-9]|[1-5][0-9])|([0-5][0-9])|([0-9]|[1-5][0-9])$/;

    var trim=function(str){
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        validateDate=function(dateString, formatString){
            dateString = trim(dateString);
            if (dateString === "") {
                return false;
            }
            formatString=formatString.replace(/yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s/g,function(type){
                return regObj[type];
            });
            formatString = new RegExp("^" + formatString + "$");
            regexp = formatString;
            return formatString.test(dateString);
        },
        validateIndex=function(formatString){
            var obj=['yyyy','MM','dd','HH','mm','ss'],
                type, i=0, format,reg1,
                length=obj.length, ia2=[];
            while(i<length){
                format=obj[i];
                reg1=format.substr(format.length/2);
                ((type = formatString.search(format)) < 0) &&(type = formatString.search(reg1));
                (type >= 0)&&(ia2.push(i));
                i=i+1;
            }
            return ia2;
        };

    Date.prototype._format = function(format){
        var o = {
            "M+" : this.getMonth()+1,
            "d+" : this.getDate(),
            "h+" : this.getHours(),
            "m+" : this.getMinutes(),
            "s+" : this.getSeconds(),
            "q+" : Math.floor((this.getMonth()+3)/3),
            "S" :  this.getMilliseconds()
        }
        if(/(y+)/.test(format)){
            format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(format)){
                format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    };

    String.prototype._strToDate=function(formatString){
        //TODO 为了 严谨  禁止 使用 23-4-5 类似这样的日期格式  [0-9]{2,4}  以及取消自动给month+1
        var day=trim(this.split(formatString)[2]).substr(0,2)-0;
        formatString=trim(formatString);
        if(formatString && new RegExp('^[0-9]{4}'+formatString+'(0[1-9]|[1-9]|1[1-2])'+formatString+'(0[1-9]|[1-9]|1[0-9]|2[0-9]|3[0-1])(\s*([01]\d|2[0-3])(:([0-5]?\d)){1,2})*').test(trim(this))){
             formatString=new Date(this.replace(new RegExp("\\"+formatString,'g'),'/'));  // 浏览器都默认为 /
             //formatString.setMonth(formatString.getMonth()+1);
            if(formatString.getDate() ===day) {
                return formatString;
            }else{
                throw '哥们 前后月份不对哦'
            }
        }else{
             throw '请检查日期格式是否正确？';
        }


        if(validateDate(this, formatString)) {
            var now = new Date(),
                vals = regexp.exec(this),
                index = validateIndex(formatString),
                year = index[0] >= 0 ? vals[index[0] + 1] : now.getFullYear(),
                month = index[1] >= 0 ? (vals[index[1] + 1] - 1) : now.getMonth(),
                day = index[2] >= 0 ? vals[index[2] + 1] : now.getDate(),
                hour = index[3] >= 0 ? vals[index[3] + 1] : "",
                minute = index[4] >= 0 ? vals[index[4] + 1] : "",
                second = index[5] >= 0 ? vals[index[5] + 1] : "",
                validate=hour=== ""?new Date(year, month, day):new Date(year, month, day, hour, minute, second);
            if(validate.getDate() === (day-0)) {
                return validate;
            }
        }else{
            throw 'wrong date';
        }
    };

})(window,undefined);