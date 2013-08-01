var isIE = (document.all) ? true : false,
    isIE6 = isIE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6),
    getById = function (id) {
        return "string" == typeof id ? document.getElementById(id) : id;
    },
    Class = {
        create: function() {
            return function() { this.initialize.apply(this, arguments); }
        }
    },
    Extend = function(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
    },
    Bind = function(object, fun) {
        return function() {
            return fun.apply(object, arguments);
        }
    },
    BindAsEventListener = function(object, fun) {
        var args = Array.prototype.slice.call(arguments).slice(2);
        return function(event) {
            return fun.apply(object, [event || window.event].concat(args));
        }
    },
    CurrentStyle = function(element){
        return element.currentStyle || document.defaultView.getComputedStyle(element, null);
    },
    addEventHandler=function(oTarget, sEventType, fnHandler){
        if (oTarget.addEventListener) {
            oTarget.addEventListener(sEventType, fnHandler, false);
        } else if (oTarget.attachEvent) {
            oTarget.attachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = fnHandler;
        }
    },
    removeEventHandler=function(oTarget, sEventType, fnHandler) {
        if (oTarget.removeEventListener) {
            oTarget.removeEventListener(sEventType, fnHandler, false);
        } else if (oTarget.detachEvent) {
            oTarget.detachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = null;
        }
    };

//图片切割
var ImgCropper = Class.create();
ImgCropper.prototype = {
    initialize: function(container, handle, url, options) {
        this._Container = getById(container);//容器对象
        this._layHandle = getById(handle);//控制层
        this.Url = url;

        this._layImg = this._Container.appendChild(document.createElement("img"));       // 用来做背景用的
        this._ContImg = this._Container.appendChild(document.createElement("img"));      // 用来拖动的
        this._ContImg.onload = Bind(this, this.SetPos);                                   // 规定一开始 选取框的大小范围

        //虚拟建立一个缓存的图片对象 用来比对大小
        this._cacheImg = document.createElement("img");
        this._cacheImg.onload = Bind(this, this.SetSize);

        // 设定基本选项
        this.SetOptions(options);
        var opts=this.options;
        this.Opacity = Math.round(opts.Opacity);
        this.Color = opts.Color;
        this.Scale = !!opts.Scale;
        this.Ratio = Math.max(opts.Ratio, 0);
        this.Height = Math.round(opts.Height);

        //设置预览对象
        var oPreview = getById(opts.Preview);//预览对象
        if(oPreview){
            oPreview.style.position = "relative";
            oPreview.style.overflow = "hidden";
            this.viewWidth = Math.round(opts.viewWidth);
            this.viewHeight = Math.round(opts.viewHeight);
            //预览图片对象
            this._viewImg = oPreview.appendChild(document.createElement("img"));
            this._viewImg.style.position = "absolute";
            this._viewImg.onload = Bind(this, this.SetPreview);
        }
        //设置拖放
        this._drag = new Drag(this._layHandle, { Limit: true, onMove: Bind(this, this.SetPos), Transparent: true });
        //设置缩放
        this.Resize = !!opts.Resize;
        if(this.Resize){
            var op =opts, _resize = new Resize(this._layHandle, { Max: true, onResize: Bind(this, this.SetPos) });
            //设置缩放触发对象
            op.RightDown && (_resize.Set(op.RightDown, "right-down"));
            op.LeftDown && (_resize.Set(op.LeftDown, "left-down"));
            op.RightUp && (_resize.Set(op.RightUp, "right-up"));
            op.LeftUp && (_resize.Set(op.LeftUp, "left-up"));
            op.Right && (_resize.Set(op.Right, "right"));
            op.Left && (_resize.Set(op.Left, "left"));
            op.Down && (_resize.Set(op.Down, "down"));
            op.Up && (_resize.Set(op.Up, "up"));
            //最小范围限制
            this.Min = !!this.options.Min;
            this.minWidth = Math.round(opts.minWidth);
            this.minHeight = Math.round(opts.minHeight);
            //设置缩放对象
            this._resize = _resize;
        }
        //设置样式
        this._Container.style.position = "relative";
        this._Container.style.overflow = "hidden";
        this._layHandle.style.zIndex = 200;
        this._ContImg.style.zIndex = 100;
        this._layImg.style.position = this._ContImg.style.position = "absolute";
        this._layImg.style.top = this._layImg.style.left = this._ContImg.style.top = this._ContImg.style.left = 0;//对齐
        //初始化设置
        this.Init();
    },
    SetOptions: function(options) {                     //设置默认属性
        this.options = {//默认值
            Opacity:	50,//透明度(0到100)
            Color:		"",//背景色
            Width:		0,//图片高度
            Height:		0,//图片高度
            //缩放触发对象
            Resize:		false,//是否设置缩放
            Right:		"",//右边缩放对象
            Left:		"",//左边缩放对象
            Up:			"",//上边缩放对象
            Down:		"",//下边缩放对象
            RightDown:	"",//右下缩放对象
            LeftDown:	"",//左下缩放对象
            RightUp:	"",//右上缩放对象
            LeftUp:		"",//左上缩放对象
            Min:		false,//是否最小宽高限制(为true时下面min参数有用)
            minWidth:	50,//最小宽度
            minHeight:	50,//最小高度
            Scale:		false,//是否按比例缩放
            Ratio:		0,//缩放比例(宽/高)
            //预览对象设置
            Preview:	"",//预览对象
            viewWidth:	0,//预览宽度
            viewHeight:	0//预览高度
        };
        Extend(this.options, options || {});
    },
    Init: function() {                      //初始化对象
        //设置背景色
        this.Color && (this._Container.style.backgroundColor = this.Color);
        //设置图片
        this._cacheImg.src = this._layImg.src = this._ContImg.src = this.Url;
        //设置透明
        if(isIE){
            this._layImg.style.filter = "alpha(opacity:" + this.Opacity + ")";
        } else {
            this._layImg.style.opacity = this.Opacity / 100;
        }

        //设置预览对象
        this._viewImg && (this._viewImg.src = this.Url);
        //设置缩放
        if(this.Resize){
            var resize=this._resize;
            resize.Scale = this.Scale;
            resize.Ratio = this.Ratio;
            resize.Min = this.Min;
            resize.minWidth = this.minWidth;
            resize.minHeight = this.minHeight;
        }
    },
    //设置切割样式
    SetPos: function() {
        //ie6渲染bug
        if(isIE6){
            //this._layHandle.style.zoom = .9;
            this._layHandle.style.zoom = 1;
        }
        var p = this.GetHandPos();
        this._ContImg.style.clip = "rect(" + p.Top + "px " + (p.Left + p.Width) + "px " + (p.Top + p.Height) + "px " + p.Left + "px)";
        this.SetPreview();
    },
    SetPreview: function(){  //设置预览效果
        if(this._viewImg){
            //预览显示的宽和高
            var p = this.GetHandPos(),
                s = this.GetSize(p.Width, p.Height, this.viewWidth, this.viewHeight),
                scale = s.Height / p.Height,
                pHeight = this._layImg.height * scale,
                pWidth = this._layImg.width * scale,
                pTop = p.Top * scale,
                pLeft = p.Left * scale,
                view=this._viewImg.style;

            view.width = pWidth + "px";
            view.height = pHeight + "px";
            view.top = - pTop + "px ";
            view.left = - pLeft + "px";
            //切割预览图
            view.clip = "rect(" + pTop + "px " + (pLeft + s.Width) + "px " + (pTop + s.Height) + "px " + pLeft + "px)";
        }
    },
    SetSize: function() {                                                                       //设置图片大小
        var s = this.GetSize(this._cacheImg.width, this._cacheImg.height, this.Width, this.Height);
        this._layImg.style.width = this._ContImg.style.width = s.Width + "px";
        this._layImg.style.height = this._ContImg.style.height = s.Height + "px";
        //设置缩放拖放范围
        this._drag.mxRight = s.Width; this._drag.mxBottom = s.Height;
        if(this.Resize){ this._resize.mxRight = s.Width; this._resize.mxBottom = s.Height; }
    },
    GetHandPos: function() {                                                                    //获取拖动层当前位置信息
        var k=this._layHandle;
        return { Top:k.offsetTop, Left:k.offsetLeft, Width:k.offsetWidth, Height:k.offsetHeight }
    },
    GetSize: function(nowWidth, nowHeight, fixWidth, fixHeight) {                               //获取尺寸
        var scale = nowWidth / nowHeight;
        if(fixHeight){ nowWidth = (nowHeight = fixHeight) * scale; }
        if(fixWidth && (!fixHeight || nowWidth > fixWidth)){ nowHeight = (nowWidth = fixWidth) / scale; }
        return { Width: nowWidth, Height: nowHeight }
    }
}


//拖放程序
var Drag = Class.create();
Drag.prototype = {
    //拖放对象
    initialize: function(drag, options) {
        this.Drag = getById(drag);
        this._x = this._y = 0;
        this._marginLeft = this._marginTop = 0;
        this._fM = BindAsEventListener(this, this.Move);
        this._fS = Bind(this, this.Stop);

        this.SetOptions(options);
        var opts=this.options;
        this.Limit = !!opts.Limit;
        this.mxLeft = parseInt(opts.mxLeft);
        this.mxRight = parseInt(opts.mxRight);
        this.mxTop = parseInt(opts.mxTop);
        this.mxBottom = parseInt(opts.mxBottom);

        this.LockX = !!opts.LockX;
        this.LockY = !!opts.LockY;
        this.Lock = !!opts.Lock;

        this.onStart = opts.onStart;
        this.onMove = opts.onMove;
        this.onStop = opts.onStop;

        this._Handle = getById(opts.Handle) || this.Drag;
        this._mxContainer = getById(opts.mxContainer) || null;

        this.Drag.style.position = "absolute";
        //透明
        if(isIE && !!opts.Transparent){
            //填充拖放对象
            with(this._Handle.appendChild(document.createElement("div")).style){
                width = height = "100%"; backgroundColor = "#fff"; filter = "alpha(opacity:0)"; fontSize = 0;
            }
        }
        //修正范围
        this.Repair();
        addEventHandler(this._Handle, "mousedown", BindAsEventListener(this, this.Start));
    },
    //设置默认属性
    SetOptions: function(options) {
        this.options = {//默认值
            Handle:			"",//设置触发对象（不设置则使用拖放对象）
            Limit:			false,//是否设置范围限制(为true时下面参数有用,可以是负数)
            mxLeft:			0,//左边限制
            mxRight:		9999,//右边限制
            mxTop:			0,//上边限制
            mxBottom:		9999,//下边限制
            mxContainer:	"",//指定限制在容器内
            LockX:			false,//是否锁定水平方向拖放
            LockY:			false,//是否锁定垂直方向拖放
            Lock:			false,//是否锁定
            Transparent:	false,//是否透明
            onStart:		function(){},//开始移动时执行
            onMove:			function(){},//移动时执行
            onStop:			function(){}//结束移动时执行
        };
        Extend(this.options, options || {});
    },
    //准备拖动
    Start: function(oEvent) {
        if(this.Lock){ return; }
        this.Repair();
        //记录鼠标相对拖放对象的位置
        this._x = oEvent.clientX - this.Drag.offsetLeft;
        this._y = oEvent.clientY - this.Drag.offsetTop;
        //记录margin
        this._marginLeft = parseInt(CurrentStyle(this.Drag).marginLeft) || 0;
        this._marginTop = parseInt(CurrentStyle(this.Drag).marginTop) || 0;
        //mousemove时移动 mouseup时停止
        addEventHandler(document, "mousemove", this._fM);
        addEventHandler(document, "mouseup", this._fS);
        if(isIE){
            //焦点丢失
            addEventHandler(this._Handle, "losecapture", this._fS);
            //设置鼠标捕获
            this._Handle.setCapture();
        }else{
            //焦点丢失
            addEventHandler(window, "blur", this._fS);
            //阻止默认动作
            oEvent.preventDefault();
        };
        //附加程序
        this.onStart();
    },
    //修正范围
    Repair: function() {
        if(this.Limit){
            //修正错误范围参数
            this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
            this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);
            //如果有容器必须设置position为relative或absolute来相对或绝对定位，并在获取offset之前设置
            !this._mxContainer || CurrentStyle(this._mxContainer).position == "relative" || CurrentStyle(this._mxContainer).position == "absolute" || (this._mxContainer.style.position = "relative");
        }
    },
    //拖动
    Move: function(oEvent) {
        if(this.Lock){ this.Stop(); return; };
        //清除选择
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        var iLeft = oEvent.clientX - this._x, iTop = oEvent.clientY - this._y;
        if(this.Limit){
            var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
            if(!!this._mxContainer){
                mxLeft = Math.max(mxLeft, 0);
                mxTop = Math.max(mxTop, 0);
                mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
            };
            iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
            iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
        }
        if(!this.LockX){ this.Drag.style.left = iLeft - this._marginLeft + "px"; }
        if(!this.LockY){ this.Drag.style.top = iTop - this._marginTop + "px"; }
        //附加程序
        this.onMove();
    },
    //停止拖动
    Stop: function() {
        //移除事件
        removeEventHandler(document, "mousemove", this._fM);
        removeEventHandler(document, "mouseup", this._fS);
        if(isIE){
            removeEventHandler(this._Handle, "losecapture", this._fS);
            this._Handle.releaseCapture();
        }else{
            removeEventHandler(window, "blur", this._fS);
        }
        //附加程序
        this.onStop();
    }
};


//缩放程序
var Resize = Class.create();
Resize.prototype = {
    initialize: function(obj, options) {
        this._obj = getById(obj);                                                           //缩放Dom对象 
        this._styleWidth = this._styleHeight = this._styleLeft = this._styleTop = 0;
        this._sideRight = this._sideDown = this._sideLeft = this._sideUp = 0;               //坐标参数
        this._downLW = this._downTH = 0;                                                   //定位参数
        this._scaleLeft = this._downTHScale = 0;                                               //定位坐标

        this._mxSet = function(){};
        this._mxRightWidth = this._mxDownHeight = this._mxUpHeight = this._mxLeftWidth = 0;
        this._mxScaleWidth = this._mxScaleHeight = 0;                                       //比例范围参数

        this._fun = function(){};

        var _style = CurrentStyle(this._obj);
        this._borderX = (parseInt(_style.borderLeftWidth) || 0) + (parseInt(_style.borderRightWidth) || 0);
        this._borderY = (parseInt(_style.borderTopWidth) || 0) + (parseInt(_style.borderBottomWidth) || 0);
        this._fR = BindAsEventListener(this, this.Resize);
        this._fS = Bind(this, this.Stop);

        this.SetOptions(options);
        var opts=this.options;
        //范围限制
        this.Max = !!opts.Max;
        this._mxContainer = getById(opts.mxContainer) || null;
        this.mxLeft = Math.round(opts.mxLeft);
        this.mxRight = Math.round(opts.mxRight);
        this.mxTop = Math.round(opts.mxTop);
        this.mxBottom = Math.round(opts.mxBottom);
        //宽高限制
        this.Min = !!opts.Min;
        this.minWidth = Math.round(opts.minWidth);
        this.minHeight = Math.round(this.options.minHeight);
        //按比例缩放
        this.Scale = !!opts.Scale;
        this.Ratio = Math.max(opts.Ratio, 0);

        this.onResize = opts.onResize;

        this._obj.style.position = "absolute";
        !this._mxContainer || CurrentStyle(this._mxContainer).position == "relative" || (this._mxContainer.style.position = "relative");

        // 是否设置为整边拖动有效
        if(opts.allSide){
            var cacheChild=this._obj.children,
            	   cacheDom;
            for(var i=4;i<8;i++){
                cacheDom=cacheChild[i];
                if(/rUp|rDown/.test(cacheDom.id)){
                    cacheDom.style.left='auto';
                    cacheDom.style.width='100%';
                }else if(/rRight|rLeft/.test(cacheDom.id)){
                    cacheDom.style.height='100%';
                    cacheDom.style.top='auto';
                }
            }
            cacheChild=cacheDom=i=null;
        }
    },
    SetOptions: function(options) {
        this.options = {//默认值
            Max:		false,//是否设置范围限制(为true时下面mx参数有用)
            mxContainer:"",//指定限制在容器内
            mxLeft:		0,//左边限制
            mxRight:	9999,//右边限制
            mxTop:		0,//上边限制
            mxBottom:	9999,//下边限制
            Min:		false,//是否最小宽高限制(为true时下面min参数有用)
            minWidth:	50,//最小宽度
            minHeight:	50,//最小高度
            Scale:		false,//是否按比例缩放
            Ratio:		0,//缩放比例(宽/高)
            allSide:    false,  //是否整边有效
            onResize:	function(){}//缩放时执行
        };
        Extend(this.options, options || {});
    },
    Set: function(resize, side) {
        var resize = getById(resize), fun;
        if(!resize) return;
        fun=this[{up:'Up',down:'Down',left:'Left',right:'Right','left up':'LeftUp','right up':'RightUp','left down':'LeftDown','right down':'RightDown'}[side.toLowerCase()]]||this.RightDown;
        addEventHandler(resize, "mousedown", BindAsEventListener(this, this.Start, fun));
    },
    //准备缩放
    Start: function(e, fun, touch) {
        e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
        this._fun = fun;
        
        this._styleWidth = this._obj.clientWidth;
        this._styleHeight = this._obj.clientHeight;
        this._styleLeft = this._obj.offsetLeft;
        this._styleTop = this._obj.offsetTop;
       
       //四条边定位坐标
        this._sideLeft = e.clientX - this._styleWidth;
        this._sideRight = e.clientX + this._styleWidth;
        this._sideUp = e.clientY - this._styleHeight;
        this._sideDown = e.clientY + this._styleHeight;
        
        //top和left定位参数
        this._downLW = this._styleLeft + this._styleWidth;
        this._downTH = this._styleTop + this._styleHeight;
        
        //缩放比例
        if(this.Scale){
            this.Ratio = Math.max(this.Ratio, 0) || this._styleWidth / this._styleHeight;
            //left和top的定位坐标
            this._scaleLeft = this._styleLeft + this._styleWidth / 2;
            this._downTHScale = this._styleTop + this._styleHeight / 2;
        };
        //范围限制
        if(this.Max){
            //设置范围参数
            var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
            //如果设置了容器，再修正范围参数
            if(!!this._mxContainer){
                mxLeft = Math.max(mxLeft, 0);
                mxTop = Math.max(mxTop, 0);
                mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
            };
            //根据最小值再修正
            mxRight = Math.max(mxRight, mxLeft + (this.Min ? this.minWidth : 0) + this._borderX);
            mxBottom = Math.max(mxBottom, mxTop + (this.Min ? this.minHeight : 0) + this._borderY);
            //由于转向时要重新设置所以写成function形式
            this._mxSet = function(){
                this._mxRightWidth = mxRight - this._styleLeft - this._borderX;
                this._mxDownHeight = mxBottom - this._styleTop - this._borderY;
                this._mxUpHeight = Math.max(this._downTH - mxTop, this.Min ? this.minHeight : 0);
                this._mxLeftWidth = Math.max(this._downLW - mxLeft, this.Min ? this.minWidth : 0);
            };
            this._mxSet();
            //有缩放比例下的范围限制
            if(this.Scale){
                this._mxScaleWidth = Math.min(this._scaleLeft - mxLeft, mxRight - this._scaleLeft - this._borderX) * 2;
                this._mxScaleHeight = Math.min(this._downTHScale - mxTop, mxBottom - this._downTHScale - this._borderY) * 2;
            };
        };

        addEventHandler(document, "mousemove", this._fR);
        addEventHandler(document, "mouseup", this._fS);
        if(isIE){
            addEventHandler(this._obj, "losecapture", this._fS);
            this._obj.setCapture();
        }else{
            addEventHandler(window, "blur", this._fS);
            e.preventDefault();
        };
    },
    Stop: function() {
        removeEventHandler(document, "mousemove", this._fR);
        removeEventHandler(document, "mouseup", this._fS);
        if(isIE){
            removeEventHandler(this._obj, "losecapture", this._fS);
            this._obj.releaseCapture();
        }else{
            removeEventHandler(window, "blur", this._fS);
        }
    },
    Resize: function(e) {
        //window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();  //  TODO  这有什麽必要吗?
        
        this._fun(e);
        
        //设置样式，变量必须大于等于0否则ie出错
        var style=this._obj.style;
        style.width = this._styleWidth + "px"; style.height = this._styleHeight + "px";
        style.top = this._styleTop + "px"; style.left = this._styleLeft + "px";
       
        this.onResize();  //附加程序
    },
    // 下面三个方法为主要方法 分别从x y 对角来控制 元素的伸缩  其中对我来说 难点在于 比例的时候 获取正确的相对应的 高 宽
    RepairX: function(iWidth, mxWidth) {
        iWidth = this.RepairWidth(iWidth, mxWidth);
        if(this.Scale){
            /*
                重点说一下这里:
                    1: 为什么在正常范围的时候,不会出现鼠标脱离当前拖动层
                       假设当前拖动目标为 右边 因此我在拖动的时候 我改变是宽度 高度只是在我改变宽度的同时增加高度 我鼠标的clientX Y 并没有更改 所以不会出现脱离的现象
                    2: this._downTHScale 本身就是以中心为参照点 即 this._downTHScale = this._styleTop + this._styleHeight / 2;  这也是 下面为什么除以2的原因
            */
            var iHeight = this.RepairScaleHeight(iWidth);
            if(this.Max && iHeight > this._mxScaleHeight){
                iHeight = this._mxScaleHeight;
                iWidth = this.RepairScaleWidth(iHeight);
            }else if(this.Min && iHeight < this.minHeight){
                var tWidth = this.RepairScaleWidth(this.minHeight);
                if(tWidth < mxWidth){ iHeight = this.minHeight; iWidth = tWidth; }
            }
            this._styleHeight = iHeight;
            this._styleTop = this._downTHScale - iHeight / 2;
        }
        this._styleWidth = iWidth;
    },
    RepairY: function(iHeight, mxHeight) {
        iHeight = this.RepairHeight(iHeight, mxHeight);
        if(this.Scale){
            var iWidth = this.RepairScaleWidth(iHeight);
            if(this.Max && iWidth > this._mxScaleWidth){
                iWidth = this._mxScaleWidth;
                iHeight = this.RepairScaleHeight(iWidth);
            }else if(this.Min && iWidth < this.minWidth){
                var tHeight = this.RepairScaleHeight(this.minWidth);
                if(tHeight < mxHeight){ iWidth = this.minWidth; iHeight = tHeight; }
            }
            this._styleWidth = iWidth;
            this._styleLeft = this._scaleLeft - iWidth / 2;
        }
        this._styleHeight = iHeight;
    },
    RepairAngle: function(iWidth, mxWidth, iHeight, mxHeight) {
        iWidth = this.RepairWidth(iWidth, mxWidth);
        if(this.Scale){
            iHeight = this.RepairScaleHeight(iWidth);
            if(this.Max && iHeight > mxHeight){
                iHeight = mxHeight;
                iWidth = this.RepairScaleWidth(iHeight);
            }else if(this.Min && iHeight < this.minHeight){
                var tWidth = this.RepairScaleWidth(this.minHeight);
                if(tWidth < mxWidth){ iHeight = this.minHeight; iWidth = tWidth; }
            }
        }else{
            iHeight = this.RepairHeight(iHeight, mxHeight);
        }
        this._styleWidth = iWidth;
        this._styleHeight = iHeight;
    },
    // RepairTop  RepairLeft  主要用来 当拖动 top left的时候 因为时时刻刻涉及到 top left的重新设定 因此重新修改 this._obj的top left参数
    RepairTop: function() {
        this._styleTop = this._downTH - this._styleHeight;
    },
    RepairLeft: function() {
        this._styleLeft = this._downLW - this._styleWidth;
    },
    // RepairHeight  && RepairWidth  主要是用来当设定范围的时候,重新修改高度 宽度用的 默认[0,iHeight||iWidth]
    RepairHeight: function(iHeight, mxHeight) {
        iHeight = Math.min(this.Max ? mxHeight : iHeight, iHeight);
        iHeight = Math.max(this.Min ? this.minHeight : iHeight, iHeight, 0);
        return iHeight;
    },
    RepairWidth: function(iWidth, mxWidth) {
        iWidth = Math.min(this.Max ? mxWidth : iWidth, iWidth);
        iWidth = Math.max(this.Min ? this.minWidth : iWidth, iWidth, 0);
        return iWidth;
    },
    //RepairScaleHeight  &&  RepairScaleWidth  主要用来当设定 比例的时候 进行高宽重新设定  默认比例为: w/h
    RepairScaleHeight: function(iWidth) {
        return Math.max(Math.round((iWidth + this._borderX) / this.Ratio - this._borderY), 0);
    },
    RepairScaleWidth: function(iHeight) {
        return Math.max(Math.round((iHeight + this._borderY) * this.Ratio - this._borderX), 0);
    },
    //Turn*  方法 主要用来控制 转向问题  eg: left 拖啊拖  拖到右边啦 这时候属于右边管 交给右边来关 左方法 暂时休息 等待再次回来
    TurnRight: function(fun) {
        if(!(this.Min || this._styleWidth)){
            this._fun = fun;
            this._sideLeft = this._sideRight;
            this.Max && this._mxSet();
            return true;
        }
    },
    TurnLeft: function(fun) {
        if(!(this.Min || this._styleWidth)){
            this._fun = fun;
            this._sideRight = this._sideLeft;
            this._downLW = this._styleLeft;
            this.Max && this._mxSet();
            return true;
        }
    },
    TurnUp: function(fun) {
        if(!(this.Min || this._styleHeight)){
            this._fun = fun;
            this._sideDown = this._sideUp;
            this._downTH = this._styleTop;
            this.Max && this._mxSet();
            return true;
        }
    },
    TurnDown: function(fun) {
        if(!(this.Min || this._styleHeight)){
            this._fun = fun;
            this._sideUp = this._sideDown;
            this.Max && this._mxSet();
            return true;
        }
    },
    //  每个方向方法的接口
    Up: function(e) {
        this.RepairY(this._sideDown - e.clientY, this._mxUpHeight);
        this.RepairTop();
        this.TurnDown(this.Down);
    },
    Down: function(e) {
        this.RepairY(e.clientY - this._sideUp, this._mxDownHeight);
        this.TurnUp(this.Up);
    },
    Right: function(e) {
        this.RepairX(e.clientX - this._sideLeft, this._mxRightWidth);
        this.TurnLeft(this.Left);
    },
    Left: function(e) {
        this.RepairX(this._sideRight - e.clientX, this._mxLeftWidth);
        this.RepairLeft();
        this.TurnRight(this.Right);
    },
    RightDown: function(e) {
        this.RepairAngle(
            e.clientX - this._sideLeft, this._mxRightWidth,
            e.clientY - this._sideUp, this._mxDownHeight
        );
        this.TurnLeft(this.LeftDown) || this.Scale || this.TurnUp(this.RightUp);
    },
    RightUp: function(e) {
        this.RepairAngle(
            e.clientX - this._sideLeft, this._mxRightWidth,
            this._sideDown - e.clientY, this._mxUpHeight
        );
        this.RepairTop();
        this.TurnLeft(this.LeftUp) || this.Scale || this.TurnDown(this.RightDown);
    },
    LeftDown: function(e) {
        this.RepairAngle(
            this._sideRight - e.clientX, this._mxLeftWidth,
            e.clientY - this._sideUp, this._mxDownHeight
        );
        this.RepairLeft();
        this.TurnRight(this.RightDown) || this.Scale || this.TurnUp(this.LeftUp);
    },
    LeftUp: function(e) {
        this.RepairAngle(
            this._sideRight - e.clientX, this._mxLeftWidth,
            this._sideDown - e.clientY, this._mxUpHeight
        );
        this.RepairTop(); this.RepairLeft();
        this.TurnRight(this.RightUp) || this.Scale || this.TurnDown(this.LeftDown);
    }
};
