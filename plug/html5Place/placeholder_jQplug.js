(function($) {
    $.fn.placeholder = function(options) {
        return this.each(function(index, element) {
             
             var defaultOpt = {
                isFF: false,
                className: 'placeholder',
                normal:false,
                textarea:20,   //因为默认的行高 都是Dom元素的 一半 因此 对于textarea 进行设置
                fn:false
            };
            options= $.extend(defaultOpt,options);

            var self = this,
                placejQ=self.getAttributeNode('placejQ'),
                isPlaceHolder = function() {
                    return 'placeholder' in document.createElement('input');
                },
                init=function(input){
                    if (!input) {
                        return;
                    }
                    var $label=$('<label>',{
                                html: placejQ&&(placejQ.value),
                                'class':options.className+' label_'+index,
                                css:{
                                    display:input.value?'none':'',
                                    width: input.offsetWidth,
                                    height: input.offsetHeight,
                                    lineHeight:(options.textarea&&(self.nodeName.toUpperCase()=='TEXTAREA')?options.textarea:input.offsetHeight)+'px',
                                    left: $(input).offset().left,
                                    top: $(input).offset().top
                                }
                            });

                    if (options.isFF){
                        $label.click(function(){
                            input.focus();
                        });

                        $(input).bind('keyup',function(e) {
                            this.value ? ($label.hide()) : ($label.show());
                        });

                    } else {
                        $label.click(function(){
                            this.style.display = "none";
                            input.focus();  
                        });

                        $(input).focus(function(){
                            $label.hide();
                        }).blur(function(){
                            (this.value === "") && ($label.show());
                        });
                    }
                    $('body').append($label);
                };

            if(options.normal && isPlaceHolder() && placejQ){  //正常 并且 该浏览器支持placeholder  正常显示
                $(self).attr('placeholder',placejQ.value);
            }else if(placejQ){
                options.normal && (options.isFF=false); //如果 正常模式 但是该浏览器不支持 placeholder 让其支持ie10模式
                init(self);
            }
            
        });
    };
})(jQuery);