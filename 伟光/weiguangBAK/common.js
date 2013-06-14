/**
 + ----------------------------------------

 + ---------------------------------------- +
 + Date: 2012-01-11
 + ---------------------------------------- +
 **/



/**
 + ----------------------------------------
 + 运动弹性菜单 需要搭配css与div结构
 + 参数：dom:节点 speed:速度 fd:弹性幅度
 + Date: 2012-01-11
 + ---------------------------------------- +
 **/
$(function(){
    // 判断是否为首页，添加菜单高亮
    if(!$("#mainMenu li.current").length){
        $("#mainMenu li:eq(0)").addClass("current");
    }
    // loading main menu fn
    menu_scroll("mainMenu", 15, 0.7); // 主菜单 JS移动
});

function menu_scroll(dom,speed,fd){
    var g_iSpeed=0;
    var g_oTimer=dom + "_oTimer"; //命名定时器
    var $_Menu=$('#'+dom);
    var $_Ul=$_Menu.find('ul:eq(0)');
    var $_Li=$_Ul.find("li");
    var $onMenu=$('#'+dom+'On');
    var $onMenuUl = $_Ul.clone(); // 克隆一个菜单ul
    var defLeft = g_iCur = $_Li.filter(".current").position().left; // 当前栏目左边距
    $onMenu.css('left',defLeft+'px');  // 高亮层位置初始化
    $onMenuUl.css('left',-defLeft+'px'); // 高亮层ul位置初始化
    $onMenuUl.appendTo($onMenu); // 将初始化后的克隆菜单ul放入高亮层

    $_Li.mouseenter(function(){ // 让高亮菜单跟随鼠标移动
        if(g_oTimer){
            clearInterval(g_oTimer);
        }
        var targetPosition = $(this).position().left; //获取当前偏离位置
        g_oTimer=setInterval(function(){
            doMove(targetPosition);
        }, speed);
    });

    $_Menu.mouseleave(function(){ // 使菜单回到当前栏目
        if(g_oTimer){
            clearInterval(g_oTimer);
        }
        g_oTimer=setInterval(function(){
            doMove(defLeft);
        }, speed);
    });

    function doMove(iTarget){
        g_iSpeed+=(iTarget+$onMenuUl.position().left)/3;
        g_iSpeed*=fd;
        if(Math.abs(g_iSpeed)>60){
            g_iSpeed=g_iSpeed>0?60:-60;
        }
        g_iCur+=g_iSpeed;
        if(g_iCur>0){
            g_iCur=Math.ceil(g_iCur);
        }else{
            g_iCur=Math.floor(g_iCur);
        }
        if(Math.abs(iTarget-g_iCur)<1 && Math.abs(g_iSpeed)<1){
            clearInterval(g_oTimer);
            g_oTimer=null;
        }else{
            $onMenu.css('left',g_iCur+'px');
            $onMenuUl.css('left',-g_iCur+'px');
        }
    }
};



/**
 + ----------------------------------------------------------------------
 + 内页子菜单
 + 参数无
 + Date: 2012-01-11
 + ---------------------------------------------------------------------- +
 **/
function subNav(){
    var $parent = $(".cattit_list");  //第一个absolute父节点;
    var $Ul = $parent.find("ul");
    var $Li = $Ul.find("li");
    var $LiSpan = $Li.find("span");
    var urlSearch = document.location.search.replace("?","");
    var typeID = "";
    var sn = 0;
    if(urlSearch.indexOf("typeid=") == 0){
        typeID = urlSearch.replace("typeid=","");
        sn = $LiSpan.index($LiSpan.filter("[typeid='"+typeID+"']"));
        sn = (sn==-1)?0:sn;
    }
    $Li.eq(sn).addClass("current");

    // 插入hover背景层，定位初始位置
    var hoverLeft = ($parent.width()-$Ul.width())/2;
    var initHoverLeft = hoverLeft + sn*$Li.eq(0).outerWidth(true);
    $("<div class='cattit_hover'></div>").appendTo($(".cattit_list")).css({
        left: initHoverLeft+"px",
        display:"block"
    });

    $LiSpan.each(function(){ //ajax加载各栏目内容
        var realURL = $(this).attr("data-url");
        var n = $LiSpan.index($(this));
        htmlobj=$.ajax({url:realURL,async:false});
        $(".wrap_li:eq("+n+")").html(htmlobj.responseText);
    });

    $(".content_area").height($(".wrap_li:eq("+sn+")").outerHeight(true)); //初始高度
    $(".wrap_ul").css("left",-920*sn+"px"); //ul初始偏移量

    $Li.live("click",function(e){ //点击栏目菜单切换对应内容
        e.preventDefault();
        $Li.removeClass("current");
        $(this).addClass("current");
        var n = $Li.index($(this));
        var nowLeft = hoverLeft + n*$(this).outerWidth(true);
        var currHeight = $(".wrap_li:eq("+n+")").outerHeight(true);
        $(".cattit_hover").animate({
            left: nowLeft+"px"
        },500);
        $(".wrap_ul").animate({
            left: -920*n+"px"
        },500);
        $(".content_area").animate({
            height: currHeight+"px"
        },500);
    });
}


//=========================
//===== 封装函数
//==========================

/**
 + ----------------------------------------
 + 分类，点击分类标题，内容向左切换
 + 参数： titID: 标题分类ID,
 conID: 内容ID,
 speed: 移动速度, 单位ms
 conWidth: conID总宽度, 单位px
 conMarginLeft: conID左边距,  只填数字，正负,可不填，默认值0

 + 备注： 标题——titID节点包裹 li
 内容——conID包裹UL ，UL为不同内容块
 标题高亮显示classname: current

 + Date: 2012-01-11
 + ---------------------------------------- +
 **/

function conChange(titID,conID,speed,conWidth,conMarginLeft){
    conMarginLeft?conMarginLeft:0;
    var $titLi = $("#"+titID+" li");
    var $conUl = $("#"+conID+" ul");
    $titLi.eq(0).addClass("current"); //默认显示第一个标题
    $conUl.hide().eq(0).show();        //默认内容显示，其余隐藏
    $conUl.each(function(){ // 区块赋class
        var i = $conUl.index($(this));
        $(this).attr("class","cat_"+i);
    });
    var liClick = function (e){
        //标题处理
        var $conUl = $("#"+conID+" ul"); // 有重置，重新定义
        e.preventDefault();
        if(!$(this).hasClass("current")){
            $titLi.unbind("click"); // 取消click绑定
            $(this).siblings().removeClass("current");
            $(this).addClass("current");

            //选中内容显示
            var n = $titLi.index($(this));
            $conUl.filter($(".cat_"+n)).insertAfter($conUl.eq(0)).show();
            //当前内容向左滚动1个版面1000px
            var realML = conWidth-conMarginLeft;
            $conUl.eq(0).animate({
                marginLeft:"-"+realML+"px" //原本有左边距
            },speed,goToLast);
        }
    }
    $titLi.bind("click",liClick);  // case category click事件
    function goToLast(){
        //将左边隐藏的当前内容列队至末尾并隐藏
        $("#"+conID+" ul:eq(0)").hide().insertAfter($("#"+conID+" ul:last")).css("margin-left",conMarginLeft+"px");
        $titLi.bind("click",liClick); //重新绑定
    }
}

/**
 + ----------------------------------------------------------------------
 + 背景颜色切换
 + 参数：dom:节点,defaultColor:默认背景颜色,enterColor:鼠标经过时背景颜色
 + Date: 2012-01-11
 + ---------------------------------------------------------------------- +
 **/

function bgColorChange(dom,defaultColor,enterColor){
    dom.live('mouseenter',function(){  // case item hover事件
        $(this).css("background",enterColor);
    }).live('mouseleave',function(){
            $(this).css("background",defaultColor);
        });
}

/**
 + ----------------------------------------------------------------------
 + 文字颜色切换
 + 参数：dom:节点,defaultColor:默认背景颜色,enterColor:鼠标经过时背景颜色
 + Date: 2012-01-11
 + ---------------------------------------------------------------------- +
 **/

function textColorChange(dom,defaultColor,enterColor){
    dom.live('mouseenter',function(){  // case item hover事件
        $(this).css("color",enterColor);
    }).live('mouseleave',function(){
            $(this).css("color",defaultColor);
        });
}

/**
 * 首页跳转
 *
 */
function indexGoTo(href){
    if(href!=null&&href!=''){
        window.open(href);
    }
    else window.location.href="http://www.wgfly.com"
}