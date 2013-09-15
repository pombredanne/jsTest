/*!
 * VerbalExpressions JavaScript Library v0.1
 * https://github.com/jehna/VerbalExpressions
 *
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-19
 *
 */

(function(){
    "use strict";

    var root = this||window;

    function VerbalExpression(){

        var verbalExpression = Object.create( RegExp.prototype );

        verbalExpression = (RegExp.apply( verbalExpression, arguments ) || verbalExpression);

        VerbalExpression.injectClassMethods( verbalExpression );

        return verbalExpression;
    }

    VerbalExpression.injectClassMethods = function( verbalExpression ){
        for (var method in VerbalExpression.prototype){
            if (VerbalExpression.prototype.hasOwnProperty( method )){
                verbalExpression[ method ] = VerbalExpression.prototype[ method ];
            }
        }
        return verbalExpression;
    };

    VerbalExpression.prototype = {

        _prefixes : "",
        _source : "",
        _suffixes : "",
        _modifiers : "gm",

        sanitize : function( value ) {
            if(value.source){return value.source}
            return (value+'').replace(/[^\w]/g, function(character) { return "\\" + character; });
        },
        add: function( value ) {
            value=value.source?/[*|+]{1}/.test(value.source.substr(-1))?'':'+':value?value+'':'';                   // 这里也可以用+= 太TM神奇了
            this._source+=value;
            this.compile(this._prefixes + this._source + this._suffixes, this._modifiers);  //重新编译正则表达式
            return( this );
        },
        or : function( value ) {

            this._prefixes += "(?:";
            this._suffixes = ")" + this._suffixes;

            this.add( ")|(?:" );
            if(value) this.then( value );

            return( this );
        },
        // 一段完整的正则语句的开始/结束 比如案例中的 url
        startOfLine: function( enable ) {
            enable = ( enable != false );
            this._prefixes = enable ? "^" : "";
            this.add( "" );
            return( this );
        },
        endOfLine : function( enable ) {
            enable = ( enable != false );
            this._suffixes = enable ? "$" : "";
            this.add( "" );
            return( this );
        },

        then : function( value ) {          //开始了 然后。。。
            value = this.sanitize( value );
            this.add( "(?:" + value + ")" );
            return( this );
        },
        maybe : function( value ) {         //正则中也许会含有
            value = this.sanitize(value);
            this.add( "(?:" + value + ")?" );
            return( this );
        },
        anyOf : function( value ) {             //任何给定的字符 /[rambo\,panda\,yui]/gm
            value = this.sanitize(value);
            this.add( "["+ value +"]" );
            return( this );
        },
        any : function( value ) {               // any（[hio456]）/[rambo\,panda\,yui][hio456]/gm
            return( this.anyOf( value ) );
        },
        //任何数量的任何字符倍
        anything : function() {
            this.add( "(?:.*)" );
            return( this );
        },
        anythingBut : function( value ) {
            value = this.sanitize( value );
            this.add( "(?:[^" + value + "]*)" );
            return( this );
        },
        // 任何字符至少一次
        something : function() {
            this.add( "(?:.+)" );
            return( this );
        },
        somethingBut : function( value ) {
            value = this.sanitize( value );
            this.add( "(?:[^" + value + "]+)" );
            return( this );
        },
        // 几个特殊的正则
        lineBreak : function() {
            this.add( "(?:(?:\\n)|(?:\\r\\n))" ); // Unix + windows CLRF换行符
            return( this );
        },
        br : function() {
            return this.lineBreak();
        },
        tab : function() {
            this.add( "\\t" );
            return( this );
        },
        word : function() {         //任何字母数字
            this.add( "\\w+" );
            return( this );
        },

        find : function( value ) {
            return this.then( value );
        },
        replace : function( source, value ) {
            source = source.toString();
            return source.replace( this, value );
        },

        /*range : function() {
         return this;        //TODO 这一点取消 难于控制 因为必须要求用户 " number  string  由小到大  "输入 其实质 [1-9a-z] 范围选择
         var value = "[";

         for(var _from = 0; _from < arguments.length; _from += 2) {
         var _to = _from+1;
         if(arguments.length <= to) break;     //TODO 不知作者为什么这么判断

         var from = this.sanitize( arguments[_from] );
         var to = this.sanitize( arguments[_to]);

         value += from + "-" + to;
         }

         value += "]";

         this.add( value );
         return( this );
         },*/


        /// 规定匹配的类型  i:忽略大小写 g:全局 m:多行匹配
        modifierChange:function(modifier){
            var _modifier=this._modifiers;
            this._modifiers=_modifier[_modifier.indexOf(modifier)===-1?'concat':'replace'](modifier,'');
            this.add("");
            return this;
        },

        /*addModifier : function( modifier ) {
         if( this._modifiers.indexOf( modifier ) === -1 ) {
         this._modifiers += modifier;
         }
         this.add("");
         return( this );
         },
         removeModifier : function( modifier ) {
         this._modifiers = this._modifiers.replace( modifier, "" );
         this.add("");
         return( this );
         },
         //不区分大小写的修饰符
         withAnyCase : function( enable ) {

         if(enable != false) this.addModifier( "i" );
         else this.removeModifier( "i" );

         this.add( "" );
         return( this );

         },
         stopAtFirst : function( enable ) {

         if(enable != false) this.removeModifier( "g" );
         else this.addModifier( "g" );

         this.add( "" );
         return( this );

         },
         searchOneLine : function( enable ) {

         if(enable != false) this.removeModifier( "m" );
         else this.addModifier( "m" );

         this.add( "" );
         return( this );

         },*/

        /*multiple : function( value ) {        // TODO 移植到add方法中
            // Use expression or string
            value = value.source ? value.source : this.sanitize(value);
            switch(value.substr(-1)) {
                case "*":
                case "+":
                    break;
                default:
                    value += "+";
            }
            this.add( value );
            return( this );
        },*/


        // TODO 开始、结束捕获组  这里暂不了解  研究捕获  http://www.jb51.net/tools/zhengze.html
        beginCapture : function() {
            //add the end of the capture group to the suffixes for now so compilation continues to work
            this._suffixes += ")";
            this.add( "(", false );             // TODO  这里啥意思 为什么还有加多余的第二形参
            return this;
        },
        endCapture : function() { //remove the last parentheses from the _suffixes and add to the regex itself
            this._suffixes = this._suffixes.substring(0, this._suffixes.length - 1 );
            this.add( ")", true );

            return this;
        },
        reset:function(){
            this._source='';
            this.add('');
            return this;
        }
    };

    function createVerbalExpression() {
        return new VerbalExpression();
    }

    // support both browser and node.js
    if(typeof module !== 'undefined' && module.exports) {
        module.exports = createVerbalExpression;
    }else if (typeof define === 'function' && define.amd) {
        define(VerbalExpression);
    }else {
        root.VerEx = createVerbalExpression;
    }
}).call();
