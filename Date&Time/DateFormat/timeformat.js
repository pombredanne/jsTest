(function(window,undefined){
    //----http://jackeysion.iteye.com/blog/513774
    var _y4 = "([0-9]{4})",                     // yyyy
        _y2 = "([0-9]{2})",                     //yy
        _M2 = "(0[1-9]|1[0-2])",                //MM
        _M1 = "([1-9]|1[0-2])",                 //M
        _d2 = "(0[1-9]|[1-2][0-9]|30|31)",      //dd
        _d1 = "([1-9]|[1-2][0-9]|30|31)",       //d
        _H2 = "([0-1][0-9]|20|21|22|23)",       //HH
        _H1 = "([0-9]|1[0-9]|20|21|22|23)",     //H
        _m2 = "([0-5][0-9])",                   //mm
        _m1 = "([0-9]|[1-5][0-9])",             //m
        _s2 = "([0-5][0-9])",                   //ss
        _s1 = "([0-9]|[1-5][0-9])";             //s

    var _yi=-1,     //  var _yi=_Mi=-1  只因为不这么写 _Mi会被当成全局变量来看待
        _Mi=-1,
        _di=-1,
        _Hi=-1,
        _mi=-1,
        _si = -1;

    var regexp;

    var trim=function(str){
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        validateDate=function(dateString, formatString){
            var dateString = trim(dateString);
            if (dateString === "") {
                return;
            }
            var reg = formatString;
            reg = reg.replace(/yyyy/, _y4).replace(/yy/, _y2).replace(/MM/, _M2).replace(/M/, _M1).replace(/dd/, _d2).replace(/d/, _d1).replace(/HH/, _H2).replace(/H/, _H1).replace(/mm/, _m2).replace(/m/, _m1).replace(/ss/, _s2).replace(/s/, _s1);
            reg = new RegExp("^" + reg + "$");
            regexp = reg;
            return reg.test(dateString);
        },
        validateIndex=function(formatString){
            var ia = new Array(),
                i = 0;

            ((_yi = formatString.search(/yyyy/)) < 0) &&(_yi = formatString.search(/yy/));
            if (_yi >= 0) {
                ia[i] = _yi;
                i++;
            }

            ((_Mi = formatString.search(/MM/))<0)&&(_Mi = formatString.search(/M/));
            if (_Mi >= 0) {
                ia[i] = _Mi;
                i++;
            }

            ((_di = formatString.search(/dd/))<0)&&(_di = formatString.search(/d/));
            if (_di >= 0) {
                ia[i] = _di;
                i++;
            }

            ((_Hi = formatString.search(/HH/))<0)&&(_Hi = formatString.search(/H/));
            if (_Hi >= 0) {
                ia[i] = _Hi;
                i++;
            }

            ((_mi = formatString.search(/mm/))<0)&&(_mi = formatString.search(/m/));
            if (_mi >= 0) {
                ia[i] = _mi;
                i++;
            }

            ((_si = formatString.search(/ss/))<0)&&(_si = formatString.search(/s/));
            if (_si >= 0) {
                ia[i] = _si;
                i++;
            }

            var ia2 = new Array(_yi, _Mi, _di, _Hi, _mi, _si);
            for (i = 0; i < ia.length - 1; i++) {
                for (j = 0; j < ia.length - 1 - i; j++) {
                    if (ia[j] > ia[j + 1]) {
                        temp = ia[j];
                        ia[j] = ia[j + 1];
                        ia[j + 1] = temp;
                    }
                }
            }
            for (i = 0; i < ia.length; i++) {
                for (j = 0; j < 6/*ia2.length*/; j++) {
                    if (ia[i] == ia2[j]) {
                        ia2[j] = i;
                    }
                }
            }
            return ia2;
        };

    Date.prototype._format = function(format){
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(),//day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
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

    String.prototype._strToDate=function(dateString, formatString){
        if (validateDate(dateString, formatString)) {
            var now = new Date(),
                vals = regexp.exec(dateString),
                index = validateIndex(formatString),
                year = index[0] >= 0 ? vals[index[0] + 1] : now.getFullYear(),
                month = index[1] >= 0 ? (vals[index[1] + 1] - 1) : now.getMonth(),
                day = index[2] >= 0 ? vals[index[2] + 1] : now.getDate(),
                hour = index[3] >= 0 ? vals[index[3] + 1] : "",
                minute = index[4] >= 0 ? vals[index[4] + 1] : "",
                second = index[5] >= 0 ? vals[index[5] + 1] : "",
                validate=hour=== ""?new Date(year, month, day):new Date(year, month, day, hour, minute, second);
            if (validate.getDate() == day) {
                return validate;
            }
        }
        alert("wrong date");
    };

})(window,undefined);
