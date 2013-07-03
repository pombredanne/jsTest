
/**
 + ----------------------------------------
 + 运动弹性菜单 需要搭配css与div结构
 + 参数：dom:节点 speed:速度 fd:弹性幅度
 + Date: 2012-01-11
 + HTML 结构：
 +   <div class="main-menu" id="mainMenu">
 +       <ul>
 +         <li class='current'><a href='/'>首页</a></li>
 +         <li><a href='/service/'  rel='dropmenu2'><span>服务范围</span></a></li>
 +         <li><a href='/cases/'  rel='dropmenu4'><span>成功案例</span></a></li>
 +         <li><a href='/about_us/'  rel='dropmenu6'><span>关于我们</span></a></li>
 +         <li><a href='/guestbook/' ><span>在线留言</span></a></li>
 +       </ul>
 +       <div class="main-menu-on" id="mainMenuOn"></div>
 +   </div>

 原理：
    1：克隆原来的导航UL
    2：将新UL通过样式控制(宽度)，只能显示一个li，并为其设定背景图片(即那张活动小图)
    3：设定定时器 用来检测新ul的left属性
    4：通过mouseenter，mouseleave定时器控制left，使其产生活动效果。并判断是否停止定时器
    (5)：产生来回滚动效果 是将其left设定偏大 并逐渐减少 形成视觉上活动效果
 **/
$(function(){
    menu_scroll("mainMenu", 15, 0.7); // 主菜单 JS移动
});

function menu_scroll(dom,speed,fd){
    var g_iSpeed=0,
        g_oTimer=dom + "_oTimer",
        $_Menu=$('#'+dom),
        $_Ul=$_Menu.find('ul:eq(0)'),
        $_Li=$_Ul.find("li"),
        $onMenu=$('#'+dom+'On'),
        $onMenuUl = $_Ul.clone(); // 克隆一个菜单ul
    
    var defLeft = g_iCur = $_Li.filter(".current").position().left; // 当前栏目左边距 默认为地一个
    $onMenu.css('left',defLeft+'px');  // 高亮层位置初始化
    $onMenuUl.css('left',-defLeft+'px'); // 高亮层ul位置初始化
    $onMenuUl.appendTo($onMenu); // 将初始化后的克隆菜单ul放入高亮层

    $_Li.mouseenter(function(){ // 让高亮菜单跟随鼠标移动
        if(g_oTimer){
            clearInterval(g_oTimer); //停止上述定时器
        }
        var targetPosition = $(this).position().left; //获取当前偏离第一个nav的左距
        g_oTimer=setInterval(function(){
            doMove(targetPosition);
        }, speed);
    });

    $_Menu.mouseleave(function(){ // 使菜单回到当前栏目
        if(g_oTimer){
            clearInterval(g_oTimer);    //停止上述定时器
        }
        g_oTimer=setInterval(function(){
            doMove(defLeft);
        }, speed);
    });

    function doMove(iTarget){
        g_iSpeed=(g_iSpeed+(iTarget+$onMenuUl.position().left)/3)*fd;

        if(Math.abs(g_iSpeed)>60){  //获取绝对值  这里影响着他的速度
            g_iSpeed=g_iSpeed>0?60:-60;
        }

        g_iCur+=g_iSpeed;
        g_iCur=g_iCur>0?Math.ceil(g_iCur):Math.floor(g_iCur);  //g_iCur的值一直存放在内存中 由此看出这很耗费内存

        if(Math.abs(iTarget-g_iCur)<=1 && Math.abs(g_iSpeed)<=1){
            clearInterval(g_oTimer);    //停止内存运行 干掉定时器
            g_oTimer=null;
        }else{
            $onMenu.css('left',g_iCur+'px');
            $onMenuUl.css('left',-g_iCur+'px');
        }
    }
};



/**
    左右滑动
 **/
function subNav(){
    var $parent = $(".cattit_list"),
         $Ul = $parent.find("ul"),
         $Li = $Ul.find("li"),
         $LiSpan = $Li.find("span"),
         typeID = "",
         sn = 0; 

     $Li.eq(0).addClass("current");

    // 插入hover背景层，定位初始位置
    var hoverLeft = ($parent.width()-$Ul.width())/2;
    $("<div class='cattit_hover'></div>").appendTo($(".cattit_list")).css({
        left: hoverLeft+"px",
        display:"block"
    });

    $Li.bind("click",function(e){ //点击栏目菜单切换对应内容
        e.preventDefault();
        $Li.removeClass("current");
        $(this).addClass("current");
        var n = $Li.index($(this)),
            nowLeft = hoverLeft + n*$(this).outerWidth(true),//包括margin
            currHeight = $(".wrap_li:eq("+n+")").outerHeight(true);
        $(".cattit_hover").animate({
            left: nowLeft+"px"
        },500);
        $(".wrap_ul").animate({
            left: -920*n+"px"
        },500);
    });
}
