/**
 * DEVELOPED BY
 * GIL LOPES BUENO
 * gilbueno.mail@gmail.com
 *
 * WORKS WITH:
 * IE 9+, FF 4+, SF 5+, WebKit, CH 7+, OP 12+, BESEN, Rhino 1.7+
 *
 * FORK:
 * https://github.com/melanke/Watch.JS
 */
/*

    观察者模式:
        观察者模式属于行为型模式，其意图是定义对象间的一种[一对多]的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。在制作系统的过程中，将一个系统分割成一系列相互协作的类有一个常见的副作用：需要维护相关对象间的一致性。我们不希望为了维持一致性而使各类紧密耦合，因为这样降低了他们的可充用性。这一个模式的关键对象是目标（Subject）和观察者（Observer）。一个目标可以有任意数目的依赖它的观察者，一旦目标的状态发生改变，所有的观察者都得到通知，作为对这个通知的响应，每个观察者都将查询目标以使其状态与目标的状态同步。这种交互也称为发布-订阅模式，目标是通知的发布者。他发出通知时并不需要知道谁是他的观察者，可以有任意数据的观察者订阅并接收通知。

*/
"use strict";
(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        window.WatchJS = factory();
        window.watch = window.WatchJS.watch;
        window.unwatch = window.WatchJS.unwatch;
        window.callWatchers = window.WatchJS.callWatchers;
    }
}(function () {

    var WatchJS = {
            noMore: false       // 防止重复执行 详细见https://github.com/melanke/Watch.JS#how-deep-you-wanna-go-provide-a-level-of-children
        },
        lengthsubjects = [],
        IntervalArr={},
        isFunction = function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
        },
        isInt = function (x) {
            return x % 1 === 0;
        },
        isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        noIsArrayOrObject=function(obj){
            return (typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj));
        };

    // @todo code related to "watchFunctions" is certainly buggy
    var methodNames = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift'],
        getObjDiff = function(a, b){
            var aplus = [],
                bplus = [];
            if(!(noIsArrayOrObject(a) && noIsArrayOrObject(b))){
            //if(!(typeof a == "string" || isArray(a)) && !(typeof b == "string" || isArray(b))){
                var i;
                for(i in a){
                    if(b[i] === undefined){
                        aplus.push(i);
                    }
                }

                for(i in b){
                    if(a[i] === undefined){
                        bplus.push(i);
                    }
                }
            }

            return {
                added: aplus,
                removed: bplus
            }
        },
        clone = function(obj){

            if (!(obj instanceof Object)) {
                return obj;
            }

            var copy = obj.constructor();

            for (var attr in obj) {
                copy[attr] = obj[attr];
            }

            return copy;

        },
        defineGetAndSet = function (obj, propName, getter, setter) {
            try {

                Object.observe(obj[propName], function(data){       //EC6中新属性 检测对象属性的CRUD改动
                    setter(data); //TODO: adapt our callback data to match Object.observe data spec
                });

            } catch(e) {

                try {
                    Object.defineProperty(obj, propName, {
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                    });
                } catch(e2) {
                    try{
                        Object.prototype.__defineGetter__.call(obj, propName, getter);
                        Object.prototype.__defineSetter__.call(obj, propName, setter);
                    } catch(e3) {
                        throw new Error("watchJS error: 不支持你 赶紧换浏览器吧 :/")
                    }
                }
            }
        },

        defineProp = function (obj, propName, value) {
            if('defineProperty' in Object){
                Object.defineProperty(obj, propName, {
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value: value
                });
            }else{
                obj[propName] = value;
            }
        },
        defineArrayMethodWatcher = function (obj, prop, original, methodName) {
            var _prop=obj[prop];
            defineProp(_prop, methodName, function () {
                var response = original.apply(_prop, arguments);
                watchOne(obj, _prop);
                if (methodName !== 'slice') {
                    callWatchers(obj, prop, methodName,arguments);
                }
                return response;
            });
        },
        defineWatcher = function (obj, prop, watcher) {

            var val = obj[prop];

            watchFunctions(obj, prop);

            (!obj.watchers) && (defineProp(obj, "watchers", {}));

            obj.watchers[prop]=obj.watchers[prop]||[];
debugger
            for(var i in obj.watchers[prop]){
                if(obj.watchers[prop][i] === watcher){
                    return; //跳出函数
                }
            }

            obj.watchers[prop].push(watcher);

            var getter = function () {
                return val;
            };


            var setter = function (newval) {
                var oldval = val;
                val = newval;

                if (obj[prop]){
                    watchAll(obj[prop], watcher);
                }

                watchFunctions(obj, prop);

                if (!WatchJS.noMore){
                    if (JSON.stringify(oldval) !== JSON.stringify(newval)) {
                        callWatchers(obj, prop, "set", newval, oldval);
                        WatchJS.noMore = false;
                    }
                }
            };

            defineGetAndSet(obj, prop, getter, setter);

        },
        callWatchers = function (obj, prop, action, newval, oldval) {
            if (prop) {
                for (var wr in obj.watchers[prop]) {
                    if (isInt(wr)) {
                        obj.watchers[prop][wr].call(obj, prop, action, newval || obj[prop], oldval);
                    }
                }
            } else {
                for (var prop in obj) {//call all
                    callWatchers(obj, prop, action, newval, oldval);
                }
            }
        },
        watchFunctions = function(obj, prop) {

            var _prop= obj[prop];
            if(noIsArrayOrObject(_prop)){
                //if ( (!obj[prop]) || (obj[prop] instanceof String) || (!isArray(obj[prop]))) {
                return;
            }

            for (var i = methodNames.length, methodName; i--;) {
                methodName = methodNames[i];
                defineArrayMethodWatcher(obj, prop, obj[prop][methodName], methodName);
            }

        },
        pushToLengthSubjects = function(obj, prop, watcher, level){

            var actual;

            if (prop === "$$watchlengthsubjectroot") {
                actual =  clone(obj);
            } else {
                actual = clone(obj[prop]);
            }

            lengthsubjects.push({
                obj: obj,
                prop: prop,
                actual: actual,
                watcher: watcher,
                level: level
            });
        },
        removeFromLengthSubjects = function(obj, prop, watcher){

            for (var i in lengthsubjects) {
                var subj = lengthsubjects[i];

                if (subj.obj == obj && subj.prop == prop && subj.watcher == watcher) {
                    lengthsubjects.splice(i, 1);
                }
            }

        },
        loop = function(){

            for(var i in lengthsubjects){

                var subj = lengthsubjects[i];

                if (subj.prop === "$$watchlengthsubjectroot") {

                    var difference = getObjDiff(subj.obj, subj.actual);

                    if(difference.added.length || difference.removed.length){
                        if(difference.added.length){
                            watchMany(subj.obj, difference.added, subj.watcher, subj.level - 1, true);
                        }

                        subj.watcher.call(subj.obj, "root", "differentattr", difference, subj.actual);
                    }
                    subj.actual = clone(subj.obj);


                } else {

                    var difference = getObjDiff(subj.obj[subj.prop], subj.actual);

                    if(difference.added.length || difference.removed.length){
                        if(difference.added.length){
                            for(var j in subj.obj.watchers[subj.prop]){
                                watchMany(subj.obj[subj.prop], difference.added, subj.obj.watchers[subj.prop][j], subj.level - 1, true);
                            }
                        }

                        callWatchers(subj.obj, subj.prop, "differentattr", difference, subj.actual);
                    }

                    subj.actual = clone(subj.obj[subj.prop]);

                }

            }

        };

    var watch = function () {

            if (isFunction(arguments[1])) {
                watchAll.apply(this, arguments);
            } else if (isArray(arguments[1])) {
                watchMany.apply(this, arguments);
            } else {
                watchOne.apply(this, arguments);
            }

        },
        watchAll = function (obj, watcher, level, addNRemove) {             // addNRemove : 监听对象的新属性的CRUD   loop  pushToLengthSubjects  removeFromLengthSubjects
            if (noIsArrayOrObject(obj)) {
                return;
            }

            var props = [],
                prop;

            for(prop in obj){
                props.push(prop)
            }

            watchMany(obj, props, watcher, level, addNRemove);

            if (addNRemove) {
                pushToLengthSubjects(obj, "$$watchlengthsubjectroot", watcher, level);
            }
        },
        watchMany = function (obj, props, watcher, level, addNRemove) {

            if (noIsArrayOrObject(obj)) {
                return;
            }

            for (var prop in props) {
                watchOne(obj, props[prop], watcher, level, addNRemove);
            }
        },
        watchOne = function (obj, prop, watcher, level, addNRemove) {

            if (noIsArrayOrObject(obj)) {
                return;
            }

            var _prop=obj[prop];

            if(typeof _prop === 'undefined'){
                throw "没有此项目"
            }
            if(isFunction(_prop)) { //TODO  排出是函数情况 我们就在这里下手
                if((/"use watch";/ig.test(_prop.toString()))){
                    (function(){
                        var propArr=prop.split('-'),
                            cache=_prop;
                        IntervalArr[propArr[0]]=IntervalArr[propArr[0]]||{};
                        IntervalArr[propArr[0]][propArr[1]]=setInterval(function(){
                            obj[prop]=cache();  //  考虑这里的GC
                        },800);
                        // obj[prop]=_prop=_prop();  保险其间 暂时不用这种
                        obj[prop]=_prop();
                        _prop=_prop();
                        propArr=null;
                    })();
                }else{
                    return;
                }
            }

            if(_prop != null && (level === undefined || level > 0)){
                if(level !== undefined){
                    level--;
                }
                watchAll(_prop, watcher, level);
            }

            defineWatcher(obj, prop, watcher);

            if(addNRemove){
                pushToLengthSubjects(obj, prop, watcher, level);
            }

        };

    var unwatch = function () {

            if (isFunction(arguments[1])) {
                unwatchAll.apply(this, arguments);
            } else if (isArray(arguments[1])) {
                unwatchMany.apply(this, arguments);
            } else {
                unwatchOne.apply(this, arguments);
            }

        },
        unwatchAll = function (obj, watcher) {

            if (noIsArrayOrObject(obj)) { //accepts only objects and array (not string)
                return;
            }

            var props = [],
                prop;

            for(prop in obj){
                props.push(prop);
            }

            /*if (isArray(obj)) {  //TODO 防止这里进行变化
             for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
             props.push(prop); //put in the props
             }
             } else {
             for (var prop2 in obj) { //for each attribute if obj is an object
             props.push(prop2); //put in the props
             }
             }*/

            unwatchMany(obj, props, watcher);
        },
        unwatchMany = function (obj, props, watcher) {
            for (var prop2 in props) {
                unwatchOne(obj, props[prop2], watcher);
            }
        },
        unwatchOne = function (obj, prop, watcher) {
            for(var i in obj.watchers[prop]){
                var w = obj.watchers[prop][i],
                    propArr=prop.split('-');
                if((watcher==='isAll') ||(w===watcher) || (watcher.toString().replace(/\s/g,'')===w.toString().replace(/\s/g,''))) {
                    obj.watchers[prop].splice(i, 1);
                    if(propArr.length>1){
                        window.clearInterval(IntervalArr[propArr[0]][propArr[1]]);
                    }
                }
            }

            removeFromLengthSubjects(obj, prop, watcher);
        };




    window.setInterval(loop, 50);

    WatchJS.watch = watch;
    WatchJS.unwatch = unwatch;
    WatchJS.callWatchers = callWatchers;

    return WatchJS;

}));
