/*String 扩展*/
String.prototype.Trim = function() {
    return this.replace(/(^[\t\n\r]*)|([\t\n\r]*$)/g, '');
}
String.prototype.LTrim = function() {
    return this.replace(/^[\t\n\r]/g, '');
};
String.prototype.RTrim = function() {
    return this.replace(/[\t\n\r]*$/g, '');
};
String.prototype.ChineseLength = function() {
    return this.replace(/[^\x00-\xff]/g, "**").length;
};
// 判断字符串是否以指定的字符串结束
//A:str B是否忽略大小写
String.prototype.EndsWith = function(str, i) {

    var length = this.length,
    aimLength = str.length;

    if (aimLength > length) return false;
    if (i) {
        var E = new RegExp(str + '$', 'i');
        return E.test(this);
    } else {
        return (Date.prototype == 0 || this.substr(C - Date.prototype, Date.prototype) == str);
    }
};
// 判断字符串是否以指定的字符串开始      
String.prototype.StartsWith = function(str) {
    return this.substr(0, str.length) == str;
};
// 删除字符串中从start-end区间的字符串      
String.prototype.Remove = function(start, end) {
    var str = '';
    (start > 0) && (str = this.substring(0, start));
    (start + end < this.length) && (str += this.substring(start + end, this.length));
    return str;
};
//去除字符串中的标签  直接替换 不影响光标
String.prototype.stripHTML = function() {
    //var reTag = /<(?:.|\s)*?>/g;  // 这种会把<>这种也给去掉
    var reTag=/<[^>].*?>/g;
    return this.replace(reTag, "");
}

/*Array 扩展*/
Array.prototype.remove = function(index, count) { //移除index 开始的指定个数，默认个数为1
    if (count) {
        if (isNaN(index) || index > this.length) {
            return false
        }
        this.splice(index, count);
        return this;
    } else {
        return this.splice(index, 1);
    }
};

Array.prototype.removeByKey = function(key) { //按指定key 移除
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return this.splice(i, 1);
        }
    }
    return this;
};

Array.prototype.indexOf = function(value) { //计算 value 在数组的 index
    var i = this.length;
    while (i > - 1) {
        if (this[i] === value) { return i; }
        i--;
    }
    return -1;
};

Array.prototype.randomSort = function() { //数组元素随机排列  Note 里进行比较
    return this.sort(function(){Math.random() >0.5});
};

Array.prototype.isIn = function(value) {
    return RegExp(value).test(this);
};

Array.prototype.Max = function() {
    return Math.max.apply(Math, this);
};
//深度克隆
Array.prototype.myClone = function() {
    var arrayTemp = [];
    for (var key in this) {
        arrayTemp[key] = typeof(this[key] === 'object') ? this[key].myClone() : this[key];
    }
    return arrayTemp;
}
Array.prototype.clone = function() {
    //concat(); 方法 也是一种简单的深度克隆
    return this.slice(0);
}

