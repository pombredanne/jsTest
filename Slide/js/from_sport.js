
function getStyle(obj, attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj, false)[attr];
    }
}

function $(id){
    return document.getElementById(id);
}

function startMove(obj, json, fnEnd)
{
    clearInterval(obj.timer);
    var attr;
    obj.timer=setInterval(function (){

        var bStop=true;

        for(attr in json){

            var iCur=0;

            if(attr=='opacity'){
                iCur=Math.round(parseFloat(getStyle(obj, attr))*100);
            }else{
                iCur=parseInt(getStyle(obj, attr));
            }

            var iSpeed=(json[attr]-iCur)/8;
            iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

            if(attr=='opacity'){
                obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
                obj.style.opacity=(iCur+iSpeed)/100;
            }else{
                obj.style[attr]=iCur+iSpeed+'px';
            }

            if(iCur!=json[attr]){
                bStop=false;
            }
        }

        if(bStop){
            clearInterval(obj.timer);
            fnEnd&&fnEnd();
        }
    }, 30);
}


window.onload = function(){
    var oList = $('steps'), //几个框的最大div 为啦让其移动
        aList = oList.getElementsByTagName('fieldset'), //那几个移动框
        oNav = $('navigation'),//移动滑块的总div
        aLi = oNav.getElementsByTagName('li'),  //移动滑块li
        aSp = oNav.getElementsByTagName('span'),    //移动滑块
        aInput = oList.getElementsByTagName('input'),   //from中的input
        arr = [/^\w+$/,/^\w+@[\da-z]+\.[a-z]+$/,/^[0-9a-z]+$/,/^[0-9a-z]+$/,/^[\u4e00-\u9fa5]+$/,/^[\u4e00-\u9fa5]+$/,/^[0-9]{11}$/,/^(http:\/\/)[a-z]+\.[0-9a-z]+\.[a-z]+$/,/^[0-9]{18}$/,/^[a-z0-9\u4e00-\u9fa5]+$/,/^[\u4e00-\u9fa5]+$/,/^[a-z0-9\u4e00-\u9fa5]+$/];

    for(var j= 0,length=arr.length;j<length;j++){
        aInput[j].j = j;
        aInput[j].onblur = function(){
            if(arr[this.j].test(aInput[this.j].value)){
                this.className = '';
            }else{
                this.className = 'error';
            }

            if($('password').value!=$('password2').value){
                $('password').className = $('password2').className = 'error';
            }else{
                $('password').className = $('password2').className = '';
            }
        }
    }


    //文本框的操作
    var all=[];

    for(i=0,length=aList.length;i<length;i++){
        var aEle=aList[i].getElementsByTagName('*');
        for(var j=0;j<aEle.length;j++){
            var tagName=aEle[j].tagName;
            if(tagName=='INPUT' || tagName=='SELECT'){
                all[all.length]=aEle[j];
            }
        }
    }

    for(i=0,length=all.length;i<length;i++){
        all[i].index=i;
        all[i].onkeydown=function (ev){
            var oEvent=ev||event,
                iIndex = (this.index)+1;

           (iIndex == all.length)&&(iIndex--);

            if(oEvent.keyCode===9){  //tab键盘
                startMove(oList, {marginLeft: -all[iIndex].parentNode.parentNode.index*aList[0].offsetWidth}, function (){
                    all[iIndex].focus();
                });
                checked(0,3,all[iIndex].parentNode.parentNode.index-1);
                return false;
            }
        };
    }

    //移动操作
    for(var i=0;i<aList.length;i++){
        aList[i].index=i;
    }

    oList.style.width = aList[0].offsetWidth * aList.length + 'px';


    for(var i=0; i<aLi.length;i++){
        aLi[i].index = i;
        aLi[i].onclick = function(){
            for(var i=0;i<aList.length;i++)
            {
                aLi[i].className = '';
            }
            aLi[this.index].className = 'selected';
            startMove(oList, {marginLeft:-this.index * aList[0].offsetWidth});

            if(this.index==0)
            {
                checked(0,3,this.index);
            }
            else
            {
                checked(0,3,this.index-1);
            }

        }
    }

    function checked(nb,nb2,_this){
        for(var i=nb;i<=nb2;i++){
            if(aInput[i].className == '' && aInput[i].value!=''){
                aSp[_this].className = 'checked';
            }else{
                aSp[_this].className = 'error';
            }
        }
    }

}