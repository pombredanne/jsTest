
/*
*   _Class:将var变量转换成function形式
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
