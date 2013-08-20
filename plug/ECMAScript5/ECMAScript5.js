(function(undefined){

        /*
             修改自:https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
             ECMAScript 5.0 兼容图:http://kangax.github.io/es5-compat-table/
             ECMAScript 5.0 介绍网站:http://es5.github.io/
             让ie兼容html5标签的js库:https://github.com/aFarkas/html5shiv
        */

        /*
            Function.bind(element,argument)  element: 事件对象, argument:函数所用参数(可选)
            eg:
            eleBtn.onclick = function(color) {
                 color = color || "#003399";
                 this.style.color = color;
             }.bind(eleText, "#cd0000");
         */
        if (!Function.prototype.bind) {
            Function.prototype.bind = function bind(that) {
                var target = this;
                if (typeof target != "function") {
                    throw new TypeError("Function.prototype.bind called on incompatible " + target);
                }
                var args = slice.call(arguments, 1);
                var bound = function () {
                    return target.apply(
                        that,
                        args.concat(slice.call(arguments))
                    );
                };
                return bound;
            };
        }



        var call = Function.prototype.call,
                    prototypeOfArray = Array.prototype,
                    prototypeOfObject = Object.prototype,
                    slice = prototypeOfArray.slice;

        var _toString = call.bind(prototypeOfObject.toString),
            owns = call.bind(prototypeOfObject.hasOwnProperty);

        var defineGetter,defineSetter,lookupGetter,lookupSetter,supportsAccessors;

        if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {    // 检测浏览器是否支持快捷键访问 直接使用对象内部defineGetter 在某些浏览器中不允许
            defineGetter = call.bind(prototypeOfObject.__defineGetter__);
            defineSetter = call.bind(prototypeOfObject.__defineSetter__);
            lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
            lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
        }

        /*
            Array
        */
        if (!Array.isArray) {
            Array.isArray = function isArray(obj) {     // isArray:  检测是否为一数组 return boolean
                return _toString(obj) == "[object Array]";
            };
        }

        if (!prototypeOfArray.forEach) {        //forEach:  返回给回调函数 self(本身) index self[index]
            Array.prototype.forEach = function forEach(fun) {
                var self = toObject(this),
                    thisp = arguments[1],
                    i = -1,
                    length = self.length >>> 0;

                if (_toString(fun) != "[object Function]") {
                    throw new TypeError(fun + " is not a function");
                }

                while (++i < length) {
                    if (i in self) {
                        fun.call(thisp, self[i], i, self);
                    }
                }
            };
        }

        if (!prototypeOfArray.map) {        //对数组中每一项进行CRDU操作 并返回新数组
            Array.prototype.map = function map(fun) {
                var self = toObject(this),
                    length = self.length >>> 0,
                    result = Array(length),
                    thisp = arguments[1];

                if (_toString(fun) != "[object Function]") {
                    throw new TypeError(fun + " is not a function");
                }

                for (var i = 0; i < length; i++) {
                    if (i in self)
                        result[i] = fun.call(thisp, self[i], i, self);
                }
                return result;
            };
        }

        if (!prototypeOfArray.filter) {     //过滤数组中的元素 返回新数组
            Array.prototype.filter = function filter(fun) {
                var self = toObject(this),
                    length = self.length >>> 0,
                    result = [],
                    value,
                    thisp = arguments[1];

                if (_toString(fun) != "[object Function]") {
                    throw new TypeError(fun + " is not a function");
                }

                for (var i = 0; i < length; i++) {
                    if (i in self) {
                        value = self[i];
                        if (fun.call(thisp, value, i, self)) {
                            result.push(value);
                        }
                    }
                }
                return result;
            };
        }

        if (!prototypeOfArray.every) {      //检测数组中每一项目,每一项都必须满足回调条件 返回boolean
            Array.prototype.every = function every(fun /*, thisp */) {
                var self = toObject(this),
                    length = self.length >>> 0,
                    thisp = arguments[1];

                if (_toString(fun) != "[object Function]") {
                    throw new TypeError(fun + " is not a function");
                }

                for (var i = 0; i < length; i++) {
                    if (i in self && !fun.call(thisp, self[i], i, self)) {
                        return false;
                    }
                }
                return true;
            };
        }

        if (!prototypeOfArray.some) {   //检测数组中每一项目,只要有一项满足回调条件 返回boolean
            Array.prototype.some = function some(fun /*, thisp */) {
                var self = toObject(this),
                    length = self.length >>> 0,
                    thisp = arguments[1];

                if (_toString(fun) != "[object Function]") {
                    throw new TypeError(fun + " is not a function");
                }

                for (var i = 0; i < length; i++) {
                    if (i in self && fun.call(thisp, self[i], i, self)) {
                        return true;
                    }
                }
                return false;
            };
        }

        if (!prototypeOfArray.reduce) {     //从头开始遍历  return prev(前一个值) cur(当前值) index(索引) array(本身array)
            Array.prototype.reduce = function reduce(fun /*, initial*/) {
                var self = toObject(this),
                    length = self.length >>> 0;

                if (_toString(fun) != "[object Function]") {
                    throw new TypeError(fun + " is not a function");
                }

                if (!length && arguments.length == 1) {
                    throw new TypeError('reduce of empty array with no initial value');
                }

                var i = 0;
                var result;
                if (arguments.length >= 2) {
                    result = arguments[1];
                } else {
                    do {
                        if (i in self) {
                            result = self[i++];
                            break;
                        }

                        if (++i >= length) {
                            throw new TypeError('reduce of empty array with no initial value');
                        }
                    } while (true);
                }

                for (; i < length; i++) {
                    if (i in self) {
                        result = fun.call(void 0, result, self[i], i, self);
                    }
                }

                return result;
            };
        }

        if (!prototypeOfArray.reduceRight) {         //从尾开始遍历  return prev(前一个值) cur(当前值) index(索引) array(本身array)
            Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
                var self = toObject(this),
                    length = self.length >>> 0;

                if (_toString(fun) != "[object Function]") {
                    throw new TypeError(fun + " is not a function");
                }

                if (!length && arguments.length == 1) {
                    throw new TypeError('reduceRight of empty array with no initial value');
                }

                var result, i = length - 1;
                if (arguments.length >= 2) {
                    result = arguments[1];
                } else {
                    do {
                        if (i in self) {
                            result = self[i--];
                            break;
                        }

                        if (--i < 0) {
                            throw new TypeError('reduceRight of empty array with no initial value');
                        }
                    } while (true);
                }

                do {
                    if (i in this) {
                        result = fun.call(void 0, result, self[i], i, self);
                    }
                } while (i--);

                return result;
            };
        }

        if (!prototypeOfArray.indexOf) {    //返回数组中元素从头到尾的索引值
            Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
                var self = toObject(this),
                    length = self.length >>> 0;

                if (!length) {
                    return -1;
                }

                var i = 0;
                if (arguments.length > 1) {
                    i = toInteger(arguments[1]);
                }

                i = i >= 0 ? i : Math.max(0, length + i);
                for (; i < length; i++) {
                    if (i in self && self[i] === sought) {
                        return i;
                    }
                }
                return -1;
            };
        }

        if (!prototypeOfArray.lastIndexOf) {    //返回数组中元素从尾到头的索引值
            Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
                var self = toObject(this),
                    length = self.length >>> 0;

                if (!length) {
                    return -1;
                }
                var i = length - 1;
                if (arguments.length > 1) {
                    i = Math.min(i, toInteger(arguments[1]));
                }
                i = i >= 0 ? i : length - Math.abs(i);
                for (; i >= 0; i--) {
                    if (i in self && sought === self[i]) {
                        return i;
                    }
                }
                return -1;
            };
        }

        /*
            Object
            重要概念:
                数据属性:
                    该数据中的属性  下面所说的属性没有特别注释 都是数据属性
                访问器属性:
                    对象中函数子对象的属性

                 var t={
                    k:'3',
                    b:function(){}
                 }
                 k的属性:
                 {
                    configurable:可定义
                    enumerable: for-in 遍历
                    writable:可编辑
                    value:值
                 }
                 b的属性:
                 {
                    configurable:可定义
                    enumerable: for-in 遍历
                    get:fn
                    set:fn
                 }
        */

        /*
            getPrototypeOf:返回对象的原型(返回的是一个Object).  跟function的prototype类似
            适用于:原型继承
            特点: 父类永远共享  子类拒绝共享
            参数: Object.getPrototypeOf(object)   //object:引用原型的对象
            eg: Object.getPrototypeOf(this).eat();  //调用原型中的 eat()方法
         */
        if (!Object.getPrototypeOf) {
            Object.getPrototypeOf = function getPrototypeOf(object) {
                return object.__proto__ || (object.constructor? object.constructor.prototype: prototypeOfObject);
            };
        }

        /*
            返回对象子元素的属性(不包括从原型中的).
            参数:Object.getOwnPropertyDescriptor(object,propertyname) //object:引用对象  propertyname:子元素的名称
         */
        if (!Object.getOwnPropertyDescriptor) {
            var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";

            Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
                if ((typeof object != "object" && typeof object != "function") || object === null) {
                    throw new TypeError(ERR_NON_OBJECT + object);
                }
                if (!owns(object, property)) {
                    return;
                }

                var descriptor =  { enumerable: true, configurable: true };

                if (supportsAccessors) {
                    var prototype = object.__proto__;
                    object.__proto__ = prototypeOfObject;

                    var getter = lookupGetter(object, property);
                    var setter = lookupSetter(object, property);

                    object.__proto__ = prototype;

                    if (getter || setter) {
                        if (getter) {
                            descriptor.get = getter;
                        }
                        if (setter) {
                            descriptor.set = setter;
                        }
                        return descriptor;
                    }
                }

                descriptor.value = object[property];
                return descriptor;
            };
        }

        /*
            返回对象子元素的集合
            return []
            Object.getOwnPropertyNames(object)//object:目标对象
         */
        if (!Object.getOwnPropertyNames) {
            Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
                return Object.keys(object);
            };
        }

        /*
            浅拷贝继承
            更改子对象 将会对父(原型)产生影响
         */
        if (!Object.create) {
            Object.create = function create(prototype, properties) {
                var object;
                if (prototype === null) {
                    object = { "__proto__": null };
                } else {
                    if (typeof prototype != "object") {
                        throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
                    }
                    var Type = function () {};
                    Type.prototype = prototype;
                    object = new Type();
                    object.__proto__ = prototype;
                }
                if (properties !== void 0) {
                    Object.defineProperties(object, properties);
                }
                return object;
            };
        }


        function doesDefinePropertyWork(object) {
            try {
                Object.defineProperty(object, "sentinel", {});
                return "sentinel" in object;
            } catch (exception) {
                // returns falsy
            }
        }
        /*
         Object.defineProperty(obj, "newDataProperty", {
             value: 101,
             writable: true,
             enumerable: true,
             configurable: true
         });
         */
        if (Object.defineProperty) {
            var definePropertyWorksOnObject = doesDefinePropertyWork({});
            var definePropertyWorksOnDom = typeof document == "undefined" ||
                doesDefinePropertyWork(document.createElement("div"));
            if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
                var definePropertyFallback = Object.defineProperty;
            }
        }

        if (!Object.defineProperty || definePropertyFallback) {
            var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
            var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
            var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                "on this javascript engine";

            Object.defineProperty = function defineProperty(object, property, descriptor) {
                if ((typeof object != "object" && typeof object != "function") || object === null) {
                    throw new TypeError(ERR_NON_OBJECT_TARGET + object);
                }
                if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null) {
                    throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
                }
                if (definePropertyFallback) {
                    try {
                        return definePropertyFallback.call(Object, object, property, descriptor);
                    } catch (exception) {
                        // try the shim if the real one doesn't work
                    }
                }

                if (owns(descriptor, "value")) {
                     if ( // can't implement these features; allow false but not true
                     !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                     !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                     !(owns(descriptor, "configurable") ? descriptor.configurable : true)
                     )
                     throw new RangeError(
                     "This implementation of Object.defineProperty does not " +
                     "support configurable, enumerable, or writable."
                     );

                    if (supportsAccessors && (lookupGetter(object, property) ||
                        lookupSetter(object, property)))
                    {
                        var prototype = object.__proto__;
                        object.__proto__ = prototypeOfObject;
                        delete object[property];
                        object[property] = descriptor.value;
                        object.__proto__ = prototype;
                    } else {
                        object[property] = descriptor.value;
                    }
                } else {
                    if (!supportsAccessors) {
                        throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                    }
                    if (owns(descriptor, "get")) {
                        defineGetter(object, property, descriptor.get);
                    }
                    if (owns(descriptor, "set")) {
                        defineSetter(object, property, descriptor.set);
                    }
                }
                return object;
            };
        }

        if (!Object.defineProperties) {
            Object.defineProperties = function defineProperties(object, properties) {
                for (var property in properties) {
                    if (owns(properties, property) && property != "__proto__") {
                        Object.defineProperty(object, property, properties[property]);
                    }
                }
                return object;
            };
        }

        /*
            阻止修改现有属性的特性，并阻止添加新属性。
            注意:不可以修改属性,但是可以修改 值(value)
            Object.seal(object)
            Object.isSealed(obj)  //检测是否锁定对象
         */
        if (!Object.seal) {
            Object.seal = function seal(object) {
                return object;
            };
        }

        /*
            阻止修改现有属性的特性和[值]，并阻止添加新属性。
         */
        if (!Object.freeze) {
            Object.freeze = function freeze(object) {
                return object;
            };
        }

        // detect a Rhino bug and patch it
        try {
            Object.freeze(function () {});
        } catch (exception) {
            Object.freeze = (function freeze(freezeObject) {
                return function freeze(object) {
                    if (typeof object == "function") {
                        return object;
                    } else {
                        return freezeObject(object);
                    }
                };
            })(Object.freeze);
        }

        /*
            阻止向对象添加新属性。
            Object.preventExtensions(object)
         */
        if (!Object.preventExtensions) {
            Object.preventExtensions = function preventExtensions(object) {
                return object;
            };
        }

        if (!Object.isSealed) {
            Object.isSealed = function isSealed(object) {
                return false;
            };
        }

        if (!Object.isFrozen) {
            Object.isFrozen = function isFrozen(object) {
                return false;
            };
        }

        if (!Object.isExtensible) {
            Object.isExtensible = function isExtensible(object) {
                if (Object(object) === object) {
                    throw new TypeError(); // TODO message
                }
                var name = '';
                while (owns(object, name)) {
                    name += '?';
                }
                object[name] = true;
                var returnValue = owns(object, name);
                delete object[name];
                return returnValue;
            };
        }

        /*
            返回对象可枚举的子元素集合

         */
        if (!Object.keys) {
            var hasDontEnumBug = true,
                dontEnums = [
                    "toString",
                    "toLocaleString",
                    "valueOf",
                    "hasOwnProperty",
                    "isPrototypeOf",
                    "propertyIsEnumerable",
                    "constructor"
                ],
                dontEnumsLength = dontEnums.length;

            for (var key in {"toString": null}) {
                hasDontEnumBug = false;
            }

            Object.keys = function keys(object) {

                if ((typeof object != "object" && typeof object != "function") || object === null) {
                    throw new TypeError("Object.keys called on a non-object");
                }

                var keys = [];
                for (var name in object) {
                    if (owns(object, name)) {
                        keys.push(name);
                    }
                }

                if (hasDontEnumBug) {
                    for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                        var dontEnum = dontEnums[i];
                        if (owns(object, dontEnum)) {
                            keys.push(dontEnum);
                        }
                    }
                }
                return keys;
            };

        }

        /*
            Date
         */

        if (!Date.prototype.toISOString || (new Date(-62198755200000).toISOString().indexOf('-000001') === -1)) {
            Date.prototype.toISOString = function toISOString() {
                var result, length, value, year;
                if (!isFinite(this)) {
                    throw new RangeError("Date.prototype.toISOString called on non-finite value.");
                }

                result = [this.getUTCMonth() + 1, this.getUTCDate(),
                    this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
                year = this.getUTCFullYear();
                year = (year < 0 ? '-' : (year > 9999 ? '+' : '')) + ('00000' + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);

                length = result.length;
                while (length--) {
                    value = result[length];
                    if (value < 10) {
                        result[length] = "0" + value;
                    }
                }
                return year + "-" + result.slice(0, 2).join("-") + "T" + result.slice(2).join(":") + "." +
                    ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
            }
        }

        if (!Date.now) {
            Date.now = function now() {
                return new Date().getTime();
            };
        }

        if (!Date.prototype.toJSON) {
            Date.prototype.toJSON = function toJSON(key) {
                if (typeof this.toISOString != "function") {
                    throw new TypeError('toISOString property is not callable');
                }
                return this.toISOString();
            };
        }

        if (!Date.parse || Date.parse("+275760-09-13T00:00:00.000Z") !== 8.64e15) {
            Date = (function(NativeDate) {

                var Date = function Date(Y, M, D, h, m, s, ms) {
                    var length = arguments.length;
                    if (this instanceof NativeDate) {
                        var date = length == 1 && String(Y) === Y ? // isString(Y)
                            new NativeDate(Date.parse(Y)) :
                            length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                                length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                                        length >= 4 ? new NativeDate(Y, M, D, h) :
                                            length >= 3 ? new NativeDate(Y, M, D) :
                                                length >= 2 ? new NativeDate(Y, M) :
                                                    length >= 1 ? new NativeDate(Y) :
                                                        new NativeDate();
                        date.constructor = Date;
                        return date;
                    }
                    return NativeDate.apply(this, arguments);
                };

                var isoDateExpression = new RegExp("^" +
                    "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign + 6-digit extended year
                    "(?:-(\\d{2})" + // optional month capture
                    "(?:-(\\d{2})" + // optional day capture
                    "(?:" + // capture hours:minutes:seconds.milliseconds
                    "T(\\d{2})" + // hours capture
                    ":(\\d{2})" + // minutes capture
                    "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:\\.(\\d{3}))?" + // milliseconds capture
                    ")?" +
                    "(?:" + // capture UTC offset component
                    "Z|" + // UTC capture
                    "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                    ")" +
                    ")?)?)?)?" +
                    "$");

                for (var key in NativeDate) {
                    Date[key] = NativeDate[key];
                }

                Date.now = NativeDate.now;
                Date.UTC = NativeDate[UTC];
                Date.prototype = NativeDate.prototype;
                Date.prototype.constructor = Date;

                Date.parse = function parse(string) {
                    var match = isoDateExpression.exec(string);
                    if (match) {
                        match.shift(); // kill match[0], the full match
                        for (var i = 1; i < 7; i++) {
                            match[i] = +(match[i] || (i < 3 ? 1 : 0));
                            if (i == 1) {
                                match[i]--;
                            }
                        }

                        var minuteOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

                        var offset = 0;
                        if (sign) {
                            if (hourOffset > 23 || minuteOffset > 59) {
                                return NaN;
                            }

                            offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
                        }
                        var year = +match[0];
                        if (0 <= year && year <= 99) {
                            match[0] = year + 400;
                            return NativeDate[UTC].apply(this, match) + offset - 12622780800000;
                        }

                        return NativeDate[UTC].apply(this, match) + offset;
                    }
                    return NativeDate[parse].apply(this, arguments);
                };

                return Date;
            })(Date);
        }

       /*
            String
        */

        var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
            "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
            "\u2029\uFEFF";
        if (!String.prototype.trim || ws.trim()) {
            ws = "[" + ws + "]";
            var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
                trimEndRegexp = new RegExp(ws + ws + "*$");
            String.prototype.trim = function trim() {
                if (this === undefined || this === null) {
                    throw new TypeError("can't convert "+this+" to object");
                }
                return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
            };
        }

        // Util

        var toInteger = function (n) {
            n = +n;
            if (n !== n) { // isNaN
                n = 0;
            } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            return n;
        };

        var prepareString = "a"[0] != "a";
        // ES5 9.9
        // http://es5.github.com/#x9.9
        var toObject = function (o) {
            if (o == null) { // this matches both null and undefined
                throw new TypeError("can't convert "+o+" to object");
            }
            // If the implementation doesn't support by-index access of
            // string characters (ex. IE < 9), split the string
            if (prepareString && typeof o == "string" && o) {
                return o.split("");
            }
            return Object(o);
        };
})(undefined)
