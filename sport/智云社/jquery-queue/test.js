$(function() {
    $('li').css('position', 'relative'); // 如果使用  必须加上offsetLeft  为了暂时测试 暂时这样
    $('.zns_box_foot a').click(function() {

        if (this.calssName !== 'show') {
            var Fun = [],
                _index = $(this).index() - 1 ? '531px' : '427px',
                aniCB = function() {
                    $('#div1').dequeue("myAnimation");
                };

            for (var index = 0,length=$('.zns_box_head li').length; index < length; index++) {
                (function(index) {
                    var value = $('.zns_box_head li').eq(index)
                    if (_index === '531px') {
                        if (index < 6) {
                            var len = (index + 1) * (-140);
                            Fun.push(function() {
                                $(value).animate({
                                    left: len + 'px'
                                }, 200, aniCB);
                            });
                        } else {
                            var len = (-140 * 6);
                            Fun.push(function() {
                                $(value).animate({
                                    left: len - 80 + 'px'
                                }, 200, aniCB);
                                setTimeout(function() {
                                    $(value).animate({
                                        left: len + 'px'
                                    }, 200, aniCB);
                                }, 80);
                            });
                        }
                    } else {
                        if (index < 6) {
                            Fun.push(function() {
                                $(value).animate({
                                    left: '80px'
                                }, 200, aniCB);
                                setTimeout(function() {
                                    $(value).animate({
                                        left: '0px'
                                    }, 200, aniCB);
                                }, 80);
                            });
                        } else {
                            Fun.push(function() {
                                $(value).animate({
                                    left: '0px'
                                }, 200, aniCB);
                            });
                        }
                    }
                })(index)

            }

            if (_index !== '531px') {
                Fun.reverse();
            }

            $('#div1').queue("myAnimation", Fun);
            aniCB();
            $('.show').removeClass('show');
            $(this).addClass('show');
            $('.caret').css('left', _index);
        }

        //        var li3=$('li').eq(2);
        //        li3.css('zIndex',10);
        //        var len=-280,
        //            po=140;
        //        li3.animate({left:'-160px'},'fast');
        //        //var e=-6;
        //        var k=setInterval(function(){
        //            var poleft=li3.position().left;
        //            if(poleft>po){
        //                li3.css({left:'-=12px'})
        //            }else if(poleft<po){
        //                li3.css({left:'+=16px'})
        //            }else{
        //                clearInterval(k);
        //            }
        //        },50);
    });
});


/*

    queue in animation
        var FUNC=[
            function() {$("#block1").animate({left:"+=100"},aniCB);},
            function() {$("#block2").animate({left:"+=100"},aniCB);},
            function() {$("#block1").animate({left:"+=100"},aniCB);},
            function() {$("#block2").animate({left:"+=100"},aniCB);},
            function() {$("#block1").animate({left:"+=100"},aniCB);},
            function(){alert("动画结束")}
        ];
        var aniCB=function() {
            $(document).dequeue("myAnimation");
        }
        $(document).queue("myAnimation",FUNC);
        aniCB();
        //清空队列
        $(document).queue("myAnimation",[]);   // $(document).clearQueue();
        //加一个新的函数放在最后
        $(document).queue("myAnimation",function(){alert("动画真的结束了！")});

    jQuery方法
        function cb1() {alert(1)}
        function cb2() {alert(2)}
        var arr = [cb1, cb2];
        var el=$('p')[0];
        $.queue(el, 'mx', cb1); // 第三个参数为function    //queue 默认名称'fx'
        $.queue(el, 'xm', arr); // 第三个参数为数组

        //这时可以取到存入的callbacks
        var k=$.queue(el, 'xm', arr);  // k:[cb1,cb2]

         //取出来 开始用他
         $.dequeue(el, 'mx')

    delay 方法在queue上的应用
        delay（延迟时间，延迟对象/可选/）
                 function cb() {
                    console.log(1);
                 }
                 var $p = $('p');
                 $p.delay(2000, 'mx').queue('mx', cb);

                 $p.dequeue('mx'); // 2秒后输出1

    promise 方法在queue上的应用
         function ff1() {
            alert(1)
         }
         function ff2() {
            alert(2)
         }
         function succ() {
            alert('done')
         }
         $body = $('body')
         $body.queue('mx', ff1);
         $body.queue('mx', ff2);
          
         var promise = $body.promise('mx');
         promise.done(succ);
          
         setInterval(function() {
            $body.dequeue('mx') // 先弹出1,2，最后是"done"
         }, 1500)

*/
