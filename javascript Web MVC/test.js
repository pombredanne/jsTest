
/*
   _Class:将var变量转换成function形式
   一定掌握内容:
    1: 定义类的形式
    2:类的属性
    3:this的指向关系
    4:继承方式
*/
var _Class=function(parent){
    var klass=function(){
        this.init.apply(this,arguments);    //this 指向调用者本身  这里也形象的说明了 函数的prototype的特性
    }
    klass.prototype.init=function(){};

    //定义prototype的别名
    klass.fn=klass.prototype;

    //定义类属性的别名
    klass.fn.parent=klass;

    klass.fn.proxy=klass.proxy;

    //给类添加私有属性
    klass.extend=function(obj){
       var extended=obj.extended;
        for(var i in obj){
            klass[i]=obj[i];
        }
        if((typeof extended==='function')&&extended.constructor===Function){extended(klass)};
    }

    //给类添加共享方法
    klass.include=function(obj){
        var includeed=obj.included;  //定义回调函数
        for(var i in obj){
            klass.fn[i]=obj[i];
        }
        if((typeof includeed==='function')&&includeed.constructor===Function){
            included(klass);
        }
    }
    //添加元素之间的this指向关系
    klass.proxy=function(func){
        var self=this;
        return (function(){
            return func.apply(self,arguments);
        });
    }
    //基于原型继承
    if(parent){ //TODO 继承者的实例中 如何查找_super 方法
        var subClass=function(){};
        subClass.prototype=parent.prototype;
        klass.prototype=new subClass;
        klass._super=parent.prototype;
       klass.prototype.constructor=klass;
    }
    return klass;
}


/*
    模型 原型继承
    掌握内容:
    1:构建对象方式
    2:数据持久化
    3:jquery extend原理 以及 严格的判断数据类型的方法 以及作者的思维
    4:了解ORM 并掌握这种思维
    5:学习GUID的随机128位 id的生成
*/

if((typeof Object.create!=='function')&&Object.create.constructor!==Function){
    Object.create=function(o){
        function F(){};
        F.prototype=o;
        return new F();
    }
}

var CopyJquery=function(Object){
    var copyIsArray,
        toString=Object.prototype.toString,
        hasOwn=Object.prototype.hasOwnProperty;

    var class2type={
            '[object Boolean]' : 'boolean',
            '[object Number]' : 'number',
            '[object String]' : 'string',
            '[object Function]' : 'function',
            '[object Array]' : 'array',
            '[object Date]' : 'date',
            '[object RegExp]' : 'regExp',
            '[object Object]' : 'object'
        },
        type=function(obj){
            return obj=null?String(obj):class2type[toString.call(obj)] || 'object';
        },
        isWindow=function(obj){
            return obj && typeof obj==='object' && 'setInterval' in obj;
        },
        isArray=function(obj){
            return type(obj)==='array';
        },
        isPlainObject=function(obj){  //是不是简单的object 常见的
            /*
            *
                如果定义了obj.nodeType，表示这是一个DOM元素；这句代码表示以下四种情况不进行深复制：
             　　1. 对象为undefined；
             　　2. 转为String时不是"[object Object]"；
             　　3. obj是一个DOM元素；
             　　4. obj是window。
             　　之所以不对DOM元素和window进行深复制，可能是因为它们包含的属性太多了；尤其是window对象，所有在全局域声明的变量都会是其属性，更不用说内置的属性了。

             */
            if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
                return false;
            }
            /*
             　如果对象具有构造函数，但却不是自身的属性，说明这个构造函数是通过prototye继承来的，这种情况也不进行深复制。这一点可以结合下面的代码结合进行理解：
            */
            if (obj.constructor && !hasOwn.call(obj, "constructor")&& !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
            /*
                 这几句代码是用于检查对象的属性是否都是自身的，因为遍历对象属性时，会先从自身的属性开始遍历，所以只需要检查最后的属性是否是自身的就可以了。

             　　这说明如果对象是通过prototype方式继承了构造函数或者属性，则不对该对象进行深复制；
                这可能也是考虑到这类对象可能比较复杂，为了避免引入不确定的因素或者为复制大量属性而花费大量时间而进行的处理，从函数名也可以看出来，进行深复制的只有"PlainObject"。
             */
            var key;
            for(key in obj){

            }
            return key === undefined || hasOwn.call(obj, key);
        },
        extend = function(deep,target, options) {
            for (var name in options) {
                var src = target[name],
                    copy = options[name],
                    clone;
                if (target === copy) { continue; }  //这是为了避免无限循环，要复制的属性copy与target相同的话，也就是将“自己”复制为“自己的属性”，可能导致不可预料的循环。

                if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }

            return target;
        };

    return {extend:function(){
        var args=[].slice.call(arguments,arguments.length),
            argLen=args.length,
            host,
            depth=false;

        if(args[0]===true){
            host=args[1];
            for(var i=2;i<argLen;i++){
                extend(true,host,args[i]);
            }
        }else{
            host=args[0];
            for(var i=1;i<argLen;i++){
                extend(false,host,args[i]);
            }
        }
    }}
}(window.Object)


var Model={
    inherited:function(){},
    created:function(){
    },
    prototype:{
        init:function(){},
        newRecord:true,
        create:function(){
            this.newRecord=false;
            this.parent.records[this.id]=this;
        },
        destroy:function(){
            delete this.parent.records[this.id];
        },
        updata:function(){
            this.parent.records[this.id]=this;
        },
        save:function(){
            this.newRecord?this.create():this.updata();
        }
    },
    find:function(id){
        if(this.records[id]){
            return this.records[id]
        }
        throw('Unknown record');

        //return this.records[id] || throw("nwe")  TODO 这种方式报错 不能直接使用throw
    },
    extend:function(o){
        var extended= o.extended;
        jQuery.extend(this,o);
        if(extended){
            extended(this);
        }
    },
    include:function(o){    //添加共享方法
        var included= o.included;
        jQuery.extend(this.prototype,o);
        if(included){
            included(this)
        }
    },
    records:{},
    create:function(){  //返回一个新对象,这个对象继承自Model对象,使用它来创建新的对象模型.
        var object=Object.create(this);
        object.parent=this;
        object.prototype=object.fn=Object.create(this.prototype);

        object.created();
        this.inherited(object);
        return object;
    },
    guid:function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
            var r=Math.random()*16| 0,
                v=c=='x'?r:(r&0x3|0x8);
            return v.toString(16);
        }).toUpperCase();
    },
    init:function(){    //返回一个新对象,继承自 create:创建的 Model对象的prototype 为Model对象的一个实例
        var instance=Object.create(this.prototype);
        instance.parent=this;
        instance.init.apply(instance,arguments);
        return instance;
    }
};

/*利用GUID来快速保存对象持久化*/
Model.include({
    create:function(){
        if(!this.id){
            this.id=Model.guid();
        }
        this.newRecord=false;
        this.parent.records[this.id]=this;
    }
});

Model.extend({
    find:function(id){
        var record=this.records[id];
        if(!record){
            throw("Unknown record");
        }
        return record.dup();
    }
});

Model.include({
    create:function(){
        if(!this.id){
            this.id=Model.guid();
        }
        this.newRecord=false;
        this.parent.records[this.id]=this.dup();
    },
    update:function(){
        this.parent.records[this.id]=this.dup();
    },
    dup:function(){
        return jQuery.extend(true,{},this);
    }
});

Model.extend({
    created:function(){
        this.records={};
    }
});
