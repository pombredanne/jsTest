/*String 扩展*/
// 去掉字符两端的空白字符 
String.prototype.Trim = function(){

    return this.replace(/(^[\t\n\r]*)|([\t\n\r]*$)/g, '');
    
}

// 去掉字符左边的空白字符
String.prototype.LTrim = function(){

    return this.replace(/^[\t\n\r]/g, '');
    
};

// 去掉字符右边的空白字符      
String.prototype.RTrim = function(){

    return this.replace(/[\t\n\r]*$/g, '');
    
};

// 返回字符的长度，一个中文算2个      
String.prototype.ChineseLength = function(){

    return this.replace(/[^\x00-\xff]/g, "**").length;
    
};

// 判断字符串是否以指定的字符串结束      
//A:str B是否忽略大小写
String.prototype.EndsWith = function(str, i){

    var length = this.length;
    
    var aimLength = str.length;
    
    if (aimLength > length) 
        return false;
    
    if (i) {
    
        var E = new RegExp(str + '$', 'i');
        return E.test(this);
        
    }
    else {
        return (Date.prototype == 0 || this.substr(C - Date.prototype, Date.prototype) == str);
    }
    
    
};

// 判断字符串是否以指定的字符串开始      
String.prototype.StartsWith = function(str){

    return this.substr(0, str.length) == str;
    
};

//批量替换，比如：str.ReplaceAll([/a/g,/b/g,/c/g],["aaa","bbb","ccc"])     
String.prototype.ReplaceAll = function(A, B){
    var C = this;
    for (var i = 0; i < A.length; i++) {
        C = C.replace(A[i], B[i]);
    };
    return C;
};

//将字符串转成字符数组
String.prototype.toArray = function(){
    return this.split('');
};

String.prototype.toNum=function(){
    return this-0;
}

//删除字符
String.prototype.strDelStr = function(strDel){
    if (this.length >= 0) {
        return this.replace(new RegExp(strDel, "g"), "");
    }
    return false;
};

// 删除字符串中从start-end区间的字符串      
String.prototype.Remove = function(start, end){

    var str = '';
    
    if (start > 0) {
        str = this.substring(0, start);
    }
    if (start + end < this.length) {
        str += this.substring(start + end, this.length);
    }
    return str;
    
};

//字符串转变为数组
String.prototype.StringToArray=function(substr) {
	var arrTmp = new Array();
	if(substr == "") {
		arrTmp.push(this);
		return arrTmp;
	}
	var i = 0,
		j = 0,
		k = str.length;
	while(i < k) {
		j = this.indexOf(substr, i);
		if(j != -1) {
			if(this.substring(i, j) != "") {
				arrTmp.push(this.substring(i, j));
			}
			i = j + 1;
		} else {
			if(this.substring(i, k) != "") {
				arrTmp.push(this.substring(i, k));
			}
			i = k;
		}
	}
	return arrTmp;
}

//去除字符串中的标签  直接替换 不影响光标
String.prototype.stripHTML = function() {
    var reTag = /<(?:.|\s)*?>/g;
    return this.replace(reTag,"");
}

/*Array 扩展*/
Array.prototype.remove = function(index, count){ //移除index 开始的指定个数，默认个数为1
    if (count) {
        if (isNaN(index) || index > this.length) 
            return false
        this.splice(index, count);
        return this;
    }else {
        return this.Remove(index, 1);
    }
};

Array.prototype.removeByKey = function(key){ //按指定key 移除
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value || this[i] == value) 
            return this.Remove(i);
    }
    return this;
};

Array.prototype.indexOf = function(value){ //计算 value 在数组的 index
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value || this[i] == value) 
            return i
    }
    return NaN;
};

Array.prototype.randomSort = function(){    //数组元素随机排列
    //TODO 目前确认sort(Math.random()>.5 ? -1:1); 效率最高 切不会出现重复 
    return this.sort(Math.random() > .5 ? -1 : 1);
};

Array.prototype.isIn = function(value){

    if (this.length >= 1) {
        for (var i = 0, val; val = this[i++];) {// 鲜为人知的是用中括号[]存取时，JS引擎内部隐式的将数字转成了字符串。 而作为[]存取时属性可以不遵循JS标识符规则（纯数字不能作为变量命名）。
            if (value === val) {
                return true;
            }
        }
    }
    return false;
};
//深度克隆
Array.prototype.myClone = function(){
    var arrayTemp = [];
    for(var key in this){
     arrayTemp[key]=typeof(this[key]==='object')?this[key].myClone():this[key];
    }
    return arrayTemp;
}
Array.prototype.clone = function () {
    //arr.concat();  也是一种简单的深度克隆方法
    return this.slice(0);
}

/*Number 扩展*/
Number.prototype.pad = function(length){ //前补0直到符合指定长度，用于数字补0
    if (!length) 
        length = 2;
    var str = '' + this;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
};

Number.prototype.toStr=function(){
    var str=this+'';
    return str
}

Number.prototype.tofix=function(num){   //截留数字小数点
    var str=this;
    if (str.tofixed){   //检测浏览器是否支持toFixed
        str = this.tofixed(num)
    }else{
        var div = Math.pow(10,num);
        str = Math.round(str * div) / div;
    }
}

/*Date 扩展*/
/*
Date.prototype.dateFromNow = function(n){ //获取当前的+ N小时的日期
    var cur = new Date();
    cur.setHours(cur.getHours() + n);
    return cur;
};
*/
Date.prototype.toTimeSpan = function(){ //转换成时间戳
    return Math.floor(+this / 1000);
};
Date.prototype.toSpanDate = function(){ //转成时间轴格式
    var t = Co.Dates.Now() - this.TimeSpan();
    if (t < 60) 
        return t + '秒前';
    if (t < 3600) 
        return Co.Round(t / 60, 0) + '分钟前';
    if (t < 86400) 
        return Co.Round(t / 3600, 0) + '小时前';
    return "{0}月{1}日 {2}:{3}".Format(this.getMonth() + 1, this.getDate(), this.getHours().Pad(2), this.getMinutes().Pad(2));
};
Date.prototype.format = function(format){
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
Date.prototype.adds = function(y,m,d,h,min,s,ms){
	if(y||m||d||h||min||s||ms){
		if(ms){
	    	this.setMilliseconds(this.getMilliseconds() + value);	
		}
		if(s){
		    this.setSeconds(this.getSeconds() + value);		
		}
		if(min){
		    this.setMinutes(this.getMinutes() + value);		
		}
		if(h){
		    this.setHours(this.getHours() + value);		
		}
		if(d){
		    this.setDate(this.getDate() + value);		
		}
		if(m){
		    this.setMonth(this.getMonth() + value);		
		}
		if(y){
		    this.setFullYear(this.getFullYear() + value);		
		}	
		return this;	
	}else{
		alert("刷我是不?填个数啊")
		return false;
	}    
};
//TODO date的格式化 详细见jquery插件即可