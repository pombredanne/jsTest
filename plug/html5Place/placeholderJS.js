(function ($) {
    $.event.special.textchange = {
         //初始化事件处理器 
      setup: function (data, namespaces) {
          $(this).data('lastValue', this.contentEditable === 'true' ? $(this).html() : $(this).val());
        $(this).bind('keyup.textchange', $.event.special.textchange.handler);
        $(this).bind('cut.textchange paste.textchange input.textchange', $.event.special.textchange.delayedHandler);
      },
      //卸载事件处理器
      teardown: function (namespaces) {
        $(this).unbind('.textchange');
      },
      
      handler: function (event) {
        $.event.special.textchange.triggerIfChanged($(this));
      },
      
      delayedHandler: function (event) {
        var element = $(this);
        setTimeout(function () {
          $.event.special.textchange.triggerIfChanged(element);
        }, 25);
      },
      
      triggerIfChanged: function (element) {
        var current = element[0].contentEditable === 'true' ? element.html() : element.val();
        if (current !== element.data('lastValue')) {
          element.trigger('textchange',  [element.data('lastValue')]);
          element.data('lastValue', current);
        }
      }
    };
    
    $.event.special.hastext = {
      
      setup: function (data, namespaces) {
        $(this).bind('textchange', $.event.special.hastext.handler);  //undefined==null
      },
      
      teardown: function (namespaces) {
        $(this).unbind('textchange', $.event.special.hastext.handler);
      },
      
      handler: function (event, lastValue) {
        if ((lastValue === '') && lastValue !== $(this).val()) {
          $(this).trigger('hastext');
        }
      }
    };
    
    $.event.special.notext = {
      
      setup: function (data, namespaces) {
        $(this).bind('textchange', $.event.special.notext.handler);
      },
      
      teardown: function (namespaces) {
        $(this).unbind('textchange', $.event.special.notext.handler);
      },
      
      handler: function (event, lastValue) {
        if ($(this).val() === '' && $(this).val() !== lastValue) {
          $(this).trigger('notext');
        }
      }
    };  
})(jQuery);


(function() {
  var init, isPlaceHolder, placeHolder;

  isPlaceHolder = function() {
    var input;

    input = document.createElement('input');
    return 'placeholder' in input;
  };

  if (!isPlaceHolder()) {
    placeHolder = function(obj) {
      if (!obj) {
        return;
      }
      this.input = obj;
      this.label = document.createElement('label');
      this.label.innerHTML = obj.getAttributeNode('placeholder').value;
      this.label.className = "placeholder";
      if (obj.value) {
        this.label.style.display = 'none';
      }
      return this.init();
    };
  }

  placeHolder.prototype = {
    getxy: function(obj) {
      var cl, ct, l, sl, st, t;

      if (document.documentElement.getBoundingClientRect) {
        st = document.documentElement.scrollTop || document.body.scrollTop;
        sl = document.documentElement.scrollLeft || document.body.scrollLeft;
        ct = document.documentElement.clientTop || document.body.clientTop;
        cl = document.documentElement.clientLeft || document.body.clientLeft;
        return {
          left: obj.getBoundingClientRect().left + sl - cl,
          top: obj.getBoundingClientRect().top + st - ct
        };
      } else {
        l = t = 0;
        while (obj) {
          l += obj.offsetLeft;
          t += obj.offsetTop;
          obj = obj.offsetParent;
        }
        return {
          top: t,
          left: l
        };
      }
    },
    getwh: function(obj) {
      return {
        w: obj.offsetWidth,
        h: obj.offsetHeight
      };
    },
    setStyles: function(obj, styles) {
      var p, _results;

      _results = [];
      for (p in styles) {
        _results.push(obj.style[p] = styles[p] + 'px');
      }
      return _results;
    },
    init: function() {
      var input, label, wh, wy;

      label = this.label;
      input = this.input;
      wy = this.getxy(input);
      wh = this.getwh(input);
      this.setStyles(label, {
        width: wh.w,
        height: wh.h,
        lineHeight: wh.h,
        left: wy.left,
        top: wy.top
      });
      document.body.appendChild(this.label);

      /*
      label.onclick = function() {
        this.style.display = "none";
        return input.focus();
      };
      input.onfocus = function() {
        return label.style.display = "none";
      };
      return input.onblur = function() {
        if (this.value === "") {
          return label.style.display = "";
        }
      };*/
      
      label.onclick = function() {
        input.focus();
      };

       $(input).bind('keyup',function(e){
        console.log(this.value)
        if(this.value===''){
          label.style.display = "";
        }else{
          label.style.display = "none";
        }
      });

      // $(input).bind('textchange',function(e){
      //   if(this.value===''){
      //     label.style.display = "";
      //   }else{
      //     label.style.display = "none";
      //   }
      // });
    }
  };

  init = function() {
    var i, inps, k, _i, _len, _results;

    inps = document.getElementsByTagName("input");
    _results = [];
    for (k = _i = 0, _len = inps.length; _i < _len; k = ++_i) {
      i = inps[k];
      if ((i.getAttributeNode("placeholder").nodeValue)) {
        _results.push(new placeHolder(i));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  window.onload = init;

}).call(this);
