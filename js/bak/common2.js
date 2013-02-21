//运动框架
zns.site.fx.flex=function (obj, cur, target, fnDo, fnEnd, fs, ms)
{
	var MAX_SPEED=16;
	
	if(!fs)fs=6;
	if(!ms)ms=0.75;
	var now={};
	var x=0;	//0-100
	
	if(!obj.__flex_v)obj.__flex_v=0;
	
	if(!obj.__last_timer)obj.__last_timer=0;
	var t=new Date().getTime();
	if(t-obj.__last_timer>20)
	{
		fnMove();
		obj.__last_timer=t;
	}
	
	clearInterval(obj.timer);
	obj.timer=setInterval(fnMove, 20);
	
	function fnMove(){
		obj.__flex_v+=(100-x)/fs;
		obj.__flex_v*=ms;

		if(Math.abs(obj.__flex_v)>MAX_SPEED)obj.__flex_v=obj.__flex_v>0?MAX_SPEED:-MAX_SPEED;
		
		x+=obj.__flex_v;
		
		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}
		
		
		if(fnDo)fnDo.call(obj, now);
		
		if(Math.abs(obj.__flex_v)<1 && Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
			obj.__flex_v=0;
		}
	}
};

zns.site.fx.buffer=function (obj, cur, target, fnDo, fnEnd, fs)
{
	if(!fs)fs=6;
	var now={};
	var x=0;
	var v=0;
	
	if(!obj.__last_timer)obj.__last_timer=0;
	var t=new Date().getTime();
	if(t-obj.__last_timer>20)
	{
		fnMove();
		obj.__last_timer=t;
	}
	
	clearInterval(obj.timer);
	obj.timer=setInterval(fnMove, 20);
	function fnMove(){
		v=Math.ceil((100-x)/fs);
		
		x+=v;
		
		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}
		
		
		if(fnDo)fnDo.call(obj, now);
		
		if(Math.abs(v)<1 && Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
		}
	}
};

zns.site.fx.linear=function (obj, cur, target, fnDo, fnEnd, fs)
{
	if(!fs)fs=50;
	var now={};
	var x=0;
	var v=0;
	
	if(!obj.__last_timer)obj.__last_timer=0;
	var t=new Date().getTime();
	if(t-obj.__last_timer>20)
	{
		fnMove();
		obj.__last_timer=t;
	}
	
	clearInterval(obj.timer);
	obj.timer=setInterval(fnMove, 20);
	
	v=100/fs;
	function fnMove(){
		x+=v;
		
		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}
		
		if(fnDo)fnDo.call(obj, now);
		
		if(Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
		}
	}
};

zns.site.fx.stop=function (obj)
{
	clearInterval(obj.timer);
};

//css3运动
zns.site.fx.move3=function (obj, json, fnEnd, fTime, sType)
{
	var addEnd=zns.site.fx.addEnd;
	
	fTime||(fTime=1);
	sType||(sType='ease');
	
	setTimeout(function (){
		setStyle3(obj, 'transition', sprintf('%1s all %2', fTime, sType));
		addEnd(obj, function (){
			setStyle3(obj, 'transition', 'none');
			if(fnEnd)fnEnd.apply(obj, arguments);
		}, json);
		
		setTimeout(function (){
			if(typeof json=='function')
				json.call(obj);
			else
				setStyle(obj, json);
		}, 0);
	}, 0);
};

//监听css3运动终止
(function (){
	var aListener=[];	//{obj, fn, arg}
	if(!Modernizr.csstransitions)return;
	
	if(window.navigator.userAgent.toLowerCase().search('webkit')!=-1)
	{
		document.addEventListener('webkitTransitionEnd', endListrner, false);
	}
	else
	{
		document.addEventListener('transitionend', endListrner, false);
	}
	
	function endListrner(ev)
	{
		var oEvObj=ev.srcElement||ev.target;
		//alert(aListener.length);
		for(var i=0;i<aListener.length;i++)
		{
			if(oEvObj==aListener[i].obj)
			{
				aListener[i].fn.call(aListener[i].obj, aListener[i].arg);
				aListener.remove(aListener[i--]);
			}
		}
	}
	
	zns.site.fx.addEnd=function (obj, fn, arg)
	{
		if(!obj || !fn)return;
		aListener.push({obj: obj, fn: fn, arg: arg});
	}
})();