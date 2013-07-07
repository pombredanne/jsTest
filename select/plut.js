	$.fn.xl = function () {
		function a(name){
			this.kl=name;
		}

		a.prototype=jQuery.prototype;
		a.prototype._name=function(){
			console.log(2)
		}
		return new a('fd')
	}
	var k=$('div').xl();
	console.log(k)  //function

(function($,window,undefined){
    $(function(){
        "use strict";
        $.fn.xlSelect=function(option){
                var opts= $.extend({},{
                    sucCallback:$.noop()
                },option);
                return this.each(function(index,dom){
                   var self=dom,
                       $ulcache=$(self).find('.option>ul li'),
                       addValue=function(valDom){
                           $(self).find('a.text').html(valDom.html()+'<em><i></i></em>');
                           $(self).removeClass('on').attr('xlindex',valDom.index());
                           opts.sucCallback.call(this,valDom.html())
                       },
                       contains  =  function($a,b){  //检查 a是不是b的的子类 如果你嫌这里不够严谨的话  使用下面  不过我发现并没有太大差异
                               return ($a.closest(b).length > 0);
                       };

                        /*
                         var contains = function(a, b, itself) {
                         if (itself && a == b) {
                         return true
                         }
                         if (a.contains) {
                         if (a.nodeType === 9){
                         return true;
                         }
                         return a.contains(b);
                         } else if (a.compareDocumentPosition) {
                         return !!(a.compareDocumentPosition(b) & 16);
                         }
                         while ((b = b.parentNode)){
                         if (a === b) return true;
                         }
                         return false;
                         }
                         */
                    //打开、关闭事件
                    $(self).find('a.text').click(function(){
                        var _self=this,
                            fun=$(self).hasClass("on")?'removeClass':'addClass';
                        $(self)[fun]('on');
                        if(fun==='addClass'){
                            $(self).attr('data-focus',true);
                            var liindex=$(self).attr('xlindex')-0;
                            liindex&&$ulcache.eq(liindex).addClass('on');
                        }else{
                            $(self).removeAttr('data-focus');
                        }
                    });

                    //键盘事件事件
                    $(document).keydown(function(event){
                           if($(self).hasClass('on') && $(self).attr('data-focus')==="true"){
                               var keyCode=event.keyCode,
                                   $cache= $ulcache,
                                   index=$cache.filter('.on').index(),
                                   bool=true;
                                //up:38  down:40 left:37  right:39
                               $cache.filter('.on').removeClass('on');
                                if(keyCode===38 && index-1>0){
                                    $cache.eq(index-1).addClass('on');
                                    bool=false;
                                }else if(keyCode === 40 && index+1<$cache.length){
                                    $cache.eq(index+1===0?1:index+1).addClass('on');
                                    bool=false;
                                }
                                bool&&($cache.eq(index).addClass('on'));
                               if(keyCode===13){
                                   //event.preventDefault();
                                   addValue($cache.filter('.on'));
                                   return false; // 如果你还想添加事件 那么就使用上面那个
                               }
                           }
                    });

                    //li 点击赋值操作  这里你也可以直接使用 live  但是不建议 如果你要采用的话 请使用(function(){ //闭包抱住}())
                    $(document).on("click", 'li', function(){
                        if(contains($(this),self)){
                            addValue($(this));
                        }
                    });

                    //添加操作  像这种添加的功能   一般都会放到option选项中， 然后给他绑定一个虚拟的事件
                    $.fn.xlSelect().addData=function(array){
                        // TODO  ajax填充数据 你自己写吧 还得判断post 还是get 这些你自己来吧 只需要在option中设计可以
                        if(contains($(this),self)){
                            var length=array.length,
                                dom=$(this).find('.option>ul'),
                                html=function(value){
                                    return '<li>'+value+'</li>'
                                },
                                cacheHtml='';
                            do{
                                cacheHtml+=html(array[length-1]);
                                length--;
                            }while(length>0);
                            $(this).find('.option>ul').html(dom.html()+cacheHtml);
                        }
                    };

                    //清空 这个就好些了吧
                    $.fn.xlSelect().destroy=function(){
                        if(contains($(this),self)){
                            $(self).remove();
                        }
                    }

                    //关于把select 转变为 你写的这种div形式的 你自己写吧  如果还要加上那个的话，这就真的是个插件了 哈哈 好 你先看看吧

                });
        };

    });
})(jQuery,window,undefined)
