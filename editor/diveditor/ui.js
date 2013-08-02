/**
 ui.js
 author      : comger@gmail.com
 createdate  : 2012-11-26
 基础的前端交互，功能包括对话框管理(打开、关闭、拖动),ui 通用方法等
 **/

var Barfoo = Barfoo || {}

Barfoo.Ui = Barfoo.Ui || ((function() {
    var ui = {
        tag: 'BarfooUi',
        messages: [],
        //所有Message对象，都会放在此列表里，将按条件定时回收
        dailogs: {},
        //所有Dailog对象，都会放在此对象里，将按条件定时回收
        //将exp 对象，浮动到 InExp 对象的位置，并进行,x ,y 偏移
        inPosition: function(exp, InExp, x, y) {
            var offset = $(InExp).offset();
            var left = 300;
            var top = 300;
            if(offset != null) {
                left = offset.left + x;
                top = offset.top + y;
            }
            //$(exp).addClass("floatDiv");
            $(exp).css({
                left: left,
                top: top,
                position: 'absulote'
            });
        },
        //添加z-index 数
        addZindex: function(exp, index) {
            index = index || 1;
            index += $(exp).css("z-index");
            $(exp).css("z-index", index);
            $(exp).css({
                position: 'absulote'
            });
        },
        //焦点插入
        focusTool: function(ele /*Element*/ , str /*插入内容*/ ) {
            var selection = window.getSelection ? window.getSelection() : document.selection;
            var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
            if(!window.getSelection) { //IE
                ele.focus();
                range.pasteHTML(str);
                ele.focus();
                range.collapse(false);
                range.select();
                range=null;
            } else {
                ele.focus();
                range.collapse(false); //将插入点移动到当前范围的开始或结尾。
                var hasR = range.createContextualFragment(str);
                var hasR_lastChild = hasR.lastChild;
                while(hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() == "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br") {
                    var e = hasR_lastChild;
                    hasR_lastChild = hasR_lastChild.previousSibling;
                    hasR.removeChild(e);
                }
                range.insertNode(hasR);
                if(hasR_lastChild) {
                    range.setEndAfter(hasR_lastChild);
                    range.setStartAfter(hasR_lastChild);
                }
                selection.removeAllRanges();
                selection.addRange(range);
                range.detach();
                range=null;
            }

        }
    }
    return ui;

})());

/**
 UI 基类，实现基本显示,附加，隐藏及回收
 **/

Barfoo.Ui.Base = Class({
    element: null,
    //控件最外层元素表达式
    addTo: function(exp) {
        $(exp).append(this.element);
    },
    show: function() {
        this.element && this.element.show();
    },
    hide: function() {
        this.element && this.element.hide();
    },
    //拖动事件
    setDragEnable: function(holderexp /*Element (最好是title栏)*/ ) {

        this.dragMaximumX = this.dragMaximumX || $(document).width(); //允许拖动的最大宽度
        this.dragMaximumY = this.dragMaximumY || $(document).height(); //最大高度
        var x = y = 0;
        var self = this;
        $("#" + this.id).mousedown(function() {
            $(this).css('z-index', Barfoo.Ui.Dailog.zin);
            Barfoo.Ui.Dailog.zin++;
        })
        $(holderexp).mousedown(function(e) {
            var pos = self.element.position() || {left: 0,top: 0};
            x = e.clientX - pos.left;
            y = e.clientY - pos.top;
            $(self).setCapture && $(this).setCapture(); //IE下捕捉焦点
            $(this).parent().css('z-index', Barfoo.Ui.Dailog.zin);

            if(self.element.css('z-index') < (Barfoo.Ui.Dailog.zin - 1)) {
                self.element.css({
                    'z-index': Barfoo.Ui.Dailog.zin
                });
                Barfoo.Ui.Dailog.zin++;
            }

            $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
        })

        function mouseMove(e) {
            self.y = e.clientY - y;
            self.x = e.clientX - x;

            if(self.y > (self.dragMaximumY - self.element.height())) self.y = self.dragMaximumY - self.element.height();
            if(self.x > (self.dragMaximumX - self.element.width())) self.x = self.dragMaximumX - self.element.width();
            if(self.y < self.dragMinimumY) self.y = 0;
            if(self.x < self.dragMinimumX) self.x = 0;

            self.element.css({
                left: self.x + "px",
                top: self.y + "px"
            });
        }

        function mouseUp() {
            $("#" + self.id).releaseCapture && $("#" + self.id).releaseCapture(); //IE下释放焦点
            $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
        }
    },
    //销毁事件 适用于Element Dom
    destroy: function() {
        this.element.remove();
        for(var i in this) {
            this[i] = undefined;
        }
        if(CollectGarbage) CollectGarbage();
    }
})

/**
 弹出聊天框

 var dailog = new Barfoo.Ui.Dailog({
            width:600,
            height:500,
            style:'dailogcss'
        });

 dailog.show();
 dailog.hide();
 dailog.destroy(); //销毁

 **/

Barfoo.Ui.Dailog = Class(Barfoo.Ui.Base, {
    uid: undefined,
    width: "410px",
    height: "500px",
    title: '消息标题',
    message: '消息内容',
    style: 'chat_box',
    closed: false,
    init: function(opts) {
        $.extend(this, opts);
        var self = this;
        this.id = '_dailog_' + Barfoo.Ui.Dailog.count;
        this.element = $("#" + this.id);

        if(this.element.length === 0) {

            this.element = $("<div>").attr({
                'id': this.id,
                'class': this.style
            }).css({
                    top: Barfoo.Ui.Dailog.top + "px",
                    left: Barfoo.Ui.Dailog.left + "px",
                    'z-index': Barfoo.Ui.Dailog.zin,
                    'width':self.width
                });
            
            
            this.element.find('.chat_top').css('width','');
            this.element.find('.chat_center').css('')
            this.element.append(bafSendDiv(this));
            $('body').append(this.element);

        };
        //发送
        this.element.find('.button_send').click(function() {
            var msg = self.element.find('.textarea').html();
            if(msg!==""){
                var result = {
                    to: self.uid,
                    time: new Date().toIMString(),
                    body: escape(msg),
                    from:Barfoo.userinfo.email
                };
                self.appendMsg(result);
                Runtime.sendRequest("chat",result);
                $(this).find('img').attr('src','{0}skin/Images/button_gray.png'.format(Barfoo.imagehost));

            }else{
                alert('不能发送空消息')
            }
        });
        this.element.BafUploadDiv(self);
        this.element.BafUploadDiv(self,true);
        this.initfn();
    },
    appendMsg: function(result) {
        var str = "";
        var time = result.time.split('T');
        time = time[1];
        time = time.split('Z')[0].substring(0,8);

        if(result.from == this.uid){
            str='<p class="name_me">'+Barfoo.friends[result.from]+' <span class="span_left">'+time+'</span></p><p class="name_text">'+unescape(result.body)+'</p>';
        }else{
            str='<p class="name_they">'+Barfoo.friends[result.from]+' <span class="span_left">'+time+'</span></p><p class="name_text">'+unescape(result.body)+'</p>';
        }
        this.element.find('.message').append($('<li>').append(str));
        this.element.find('.textarea').html('');
        //滚动条滚到最底下
        var hei = this.element.find('.chat_box1')[0].scrollHeight;
        this.element.find('.chat_box1').scrollTop(hei);
        
    },
   initfn:function(){
        this.element.FacesDiv();
        var self = this;
        this.element.find('#bafDiagClo').click(function() {
            self.hide();
        });
        //检测是否有内容信息
        this.element.find('.textarea').keyup(function(){
            var img=$(this).next().find('img'),imgSrc='{0}skin/Images/'.format(Barfoo.imagehost);
            $(this).html()===''?img.attr('src',imgSrc+'button_gray.png'):img.attr('src',imgSrc+'/button.png')
        })

        this.element.click(function() {
            if($(this).css('z-index') < (Barfoo.Ui.Dailog.zin - 1)) {
                $(this).css({
                    'z-index': Barfoo.Ui.Dailog.zin
                });
                Barfoo.Ui.Dailog.zin++;
            }
        })
        Barfoo.Ui.Dailog.zin++;
        Barfoo.Ui.Dailog.count++;
        Barfoo.Ui.Dailog.top += 40;
        Barfoo.Ui.Dailog.left += 40;
        var _height = $(window).height() - parseInt(this.height.replace('px', ''));
        if(Barfoo.Ui.Dailog.top > _height) {
            Barfoo.Ui.Dailog.left += 80;
            Barfoo.Ui.Dailog.top = 80;
        }
        this.setDragEnable(this.element.find('.chat_top'));


        if(this.element.length === 0) {
            this.element.find('#bafDiagClo').click(function() {
                self.hide();
            });
            this.element.FacesDiv();
              
            this.element.BafUploadDiv(self);
            this.element.BafUploadDiv(self,true);
        };
    }

});

Barfoo.Ui.Dailog.count = 0;
Barfoo.Ui.Dailog.zin = 999;
Barfoo.Ui.Dailog.top = 100;
Barfoo.Ui.Dailog.left = 100;


Barfoo.Ui.GroupDailog = Class(Barfoo.Ui.Dailog,{
    width:'550px',
    init:function(opts){
        $.extend(this, opts);
        var self = this;
        this.id = '_dailogGro_' + Barfoo.Ui.Dailog.count;
        this.element = $("#" + this.id);

        if(this.element.length === 0) {
            this.element = $("<div>").attr({
                'id': this.id,
                'class': this.style
            }).css({
                    top: Barfoo.Ui.Dailog.top + "px",
                    left: Barfoo.Ui.Dailog.left + "px",
                    'z-index': Barfoo.Ui.Dailog.zin,
                    width:this.width
                });
            this.element.append(bafSendDiv(this));
            var qunShows=$('<div class="proclamation">').attr('id','groupGao');
            var qunNums=$('<div class="line_name">').attr('id','groupNum');
              //载入用户
            var qunUsers=$('<div class="people_list">');
            this.element.find('.chat_center').append($('<div class="right_group">').append($('<div class="line_name">').html('群公告')).append(qunShows).append(qunNums).append(qunUsers));
            $('body').append(this.element);
              
            this.element.find('.chat_line li').not(':first').remove();
        };
        
        //发送
        this.element.find('.button_send').click(function() {
            var msg = self.element.find('.textarea').html();
            if(msg!==""){
                var result = {
                    to: self.uid,
                    time: new Date().toIMString(),
                    body: escape(msg),
                    type:'group',
                    from:Barfoo.userinfo.email
                };
                self.appendMsg(result);
                Runtime.sendRequest("chat",result);
                $(this).find('img').attr('src','{0}skin/Images/button_gray.png'.format(Barfoo.imagehost));

            }else{
                alert('不能发送空消息')
            }
        });
        
        this.initfn();
        
        $.getJSON(Barfoo.filehost+"/group/info/?jsoncallback=?&uid="+Barfoo.userinfo.id+"&groupid="+this.uid+"&token="+Barfoo.userinfo.token,function(data){   //加载聊天用户
            if(data.status){
                self.loadGroup(data.data);
            }
        });
        
    },
    loadGroup:function(data){
        //群公告
        var announce=data.announce||'暂无群公告';
        this.element.find('#groupGao').text(announce);        
        data = data.members||[];
        //群成员(N/M)
        var length=data.length;
        this.element.find('#groupNum').text('群成员('+length+'/'+length+')');
        var img='<img width="19" height="19" align="absmiddle" src="'+Barfoo.imagehost+'skin/Images/img2.png">';
	    for(var i=0;i<length;i++){
	       
	       var _userdiv = $('<div>').attr({'class':'people','uid':data[i].email,'title':data[i].name});
	        _userdiv.click(function(){
                var title = $(this).attr('title');
                var key = $(this).attr('uid');
                Barfoo.Ui.dailogs[key] = Barfoo.Ui.dailogs[key] || new Barfoo.Ui.Dailog({
                    title: title,
                    uid: key
                  });
                Barfoo.Ui.dailogs[key].show();	            
	         })
	        _userdiv.append($('<a>').attr('href',"javascript:void(0)").append(img).append(data[i].name));
	        
     		this.element.find('.people_list').append(_userdiv);
     		
        }

    }
})

/**
 ui 消息提示控件
 var msg = new Ui.Message({
        title:'标题',
        message:'提示内容',
        width:'300px',
        height:'200px'
    })
 **/
Barfoo.Ui.Message = Class(Barfoo.Ui.Base, {
    style: 'msgcss',
    title: '标题',
    message: '提示内容',
    width: '300px',
    height: '200px',
    time: false,
    type: 'message',
    // message | failed | success
    init: function(opts) {
        $.extend(this, opts);
        this.id = '_message_' + Barfoo.Ui.Message.count;
        this.element = $('#' + this.id);
        var self = this;
        if(this.element.length == 0) {
            this.element = $("<div>").attr({
                'id': this.id,
                'class': this.style
            }).css({
                    width: this.width,
                    height: this.height
                });

            this.element.append($('<div>').attr('class', 'title').html(this.title).append($('<input>').attr({
                type: 'button',
                'class': 'btn_close'
            })));

            this.element.append($('<div>').attr('class', 'message').
                css({
                    height: (parseInt(this.height.replace("px", "")) - 35) + "px"
                }).html(this.message));

            this.element.find('.btn_close').click(function() {
                self.hide();
            });
            this.addTo($('body'));

            Barfoo.Ui.Message.count++;
        }
        this.setDragEnable(this.element.find('.title'));
        if(this.time) {
            setTimeout(this.hide(), this.time);
        }
    },
    hide: function() {
        this.Super('hide');
        this.destroy();
    }
});
Barfoo.Ui.Message.count = 0;


/**
 用户列表栏
 **/
Barfoo.Ui.Main = Class(Barfoo.Ui.Base, {
    style: 'a_box',
    uid: undefined,
    title: 'BarfooIM',
    width: '260px',
    height: '600px',
    messages: {},//用户消息容器
    messagesGro:{},
    messagecount: '',
    init: function(opts) {
        $.extend(this, opts);
        this.id = 'bfwebim_main';
        Barfoo.friends = Barfoo.friends || {};
        Barfoo.friends[this.uid] = this.title;

        var self = this,cont=this.messagecount;
        if(!this.element) {//组装Main层                       
            this.element = $("<div>").attr({ 'id': this.id,'class': this.style}).css({right: '10px',top: '50px' });
            var a_box = $('<div>').attr('class', 'a_top');
            var head=$('<div>').attr('class','head').append($('<img>').attr('src',Barfoo.imagehost+'skin/Images/img1.png'));
            var username = $("<div>").attr('class', 'name');
            username.append($('<div>').attr('class', 'name1').html(this.title));
            var online=$('<div>').attr({id:'bafStatus','class':'online'}).append($('<a>').attr('href','javascript:;').append($('<img>').attr({align:'absmiddle',src:Barfoo.imagehost+'skin/Images/on_line.png'})).append('&nbsp;').append($('<img>').attr({align:'absmiddle',src:Barfoo.imagehost+'skin/Images/gray_down.png'})))

            var box=$('<div>').addClass('box').css('display','none').append($('<ul>').append($('<li>').attr('id','bafOnlStatus').append($('<img>').attr('src',Barfoo.imagehost+'skin/Images/on_line.png')).append(' 在线')).append($('<li>').attr('id','bafHideStatus').append($('<img>').attr('src',Barfoo.imagehost+'skin/Images/invisible.png')).append(' 离线')));

            username.append(online.append(box));

            var email=$('<div>').addClass('email').append($('<img>').attr('src',Barfoo.imagehost+'skin/Images/samll.png'));
            var email1=$('<div>').addClass('email1 msgbox').append($('<img>').attr({align:'absmiddle',src:Barfoo.imagehost+'skin/Images/email.png'})).append($('<span>')).after($('<div>').css('clear','both'));
            a_box.append(head).append(username).append(email).append(email1);

            this.element.append(a_box);

            //Tab
            var tab=$('<div>').attr('class','group');
            var group_left=$('<div>').attr({title:'bafTuser','class':'group_left1'}).append($('<img>').attr({src:Barfoo.imagehost+'skin/Images/dialog_green.png'})).append('联系人');
            var group_right=$('<div>').attr({title:'bafTgroup','class':'group_right1'}).append($('<img>').attr({align:'absmiddle',src:Barfoo.imagehost+'skin/Images/dialog_two_gray.png'})).append('群');
            a_box.after($('<div>').attr({id:'bafTuser','class':'a_center'})).after($('<div>').attr({id:'bafTgroup','class':'a_center'}).css('display','none').text('您未添加组'));

            var bottom=$('<div>').attr('class','a_bottom');
            var bottom_ul=$('<ul>').append($('<li>').append($('<img>').attr({align:'absmiddle',src:Barfoo.imagehost+'skin/Images/add_green.png'})));
            var bottom_a=$('<a>').attr({href:Barfoo.filehost+'/group/create/?uid='+Barfoo.userinfo.id+'&token='+Barfoo.userinfo.token,target:'_blank'}).append($('<span>').attr("class","font_green").text('创建群'));
            bottom.append(bottom_ul.append(bottom_a)).append($('<div>').attr('style','clear:both'));

            var canzhaoku=$('<div>').attr('id','bafCanKao').css('display','none');
            
            a_box.after(tab.append(group_left).append(group_right).append(canzhaoku))
            this.element.append(bottom.css('display','none'))
                             
            this.setDragEnable(this.element.find('.a_top')); //拖动主窗口

            var tab=this.element.find('.group div');   //Tab操作
            tab.click(function(){
                var index=$(this).index('div'),title=$(this).attr('title'),element=self.element;
                if(this.className==='group_left'){
                    $(this).removeClass('group_left').addClass('group_left1');
                    $(this).find('img').attr('src',Barfoo.imagehost+'skin/Images/dialog_green.png');
                    $(this).next().removeClass('group_right').addClass('group_right1');
                    $(this).next().find('img').attr('src',Barfoo.imagehost+'skin/Images/dialog_two_gray.png')
                    
                }else if(this.className==='group_right1'){
                    $(this).removeClass('group_right1').addClass('group_right');
                    $(this).find('img').attr('src',Barfoo.imagehost+'skin/Images/dialog_two.png')
                    $(this).prev().removeClass('group_left1').addClass('group_left');
                    $(this).prev().find('img').attr('src',Barfoo.imagehost+'skin/Images/dialog.png')
                }
                //控制如果群为'' 则提示
                if(title==='bafTuser'){
                    element.find('#bafTgroup').hide();
                    element.find('.a_bottom').hide();
                }else{
                    element.find('#bafTuser').hide();
                    element.find('.a_bottom').show();
                }
                $('#'+title).show();
            })

            this.element.find('.msgbox').click(function() { //弹出其它一个用户的所有未读消息
                var result = Uti.popDict(self.messages);
                if(result) {
                    var key = result[0];
                    var title = Barfoo.friends[key];
       
                    if(result[1][0].type =='group'){
                        Barfoo.Ui.dailogs[key] = new Barfoo.Ui.GroupDailog({
                            title: title,
                            uid: key
                        });
                    }else{
                        Barfoo.Ui.dailogs[key] = new Barfoo.Ui.Dailog({
                            title: title,
                            uid: key
                        });
                    }
                    
                    Barfoo.Ui.dailogs[key].show();
                    var rs = result[1];
                    for(var i = 0; i < rs.length; i++) {
                        Barfoo.Ui.dailogs[key].appendMsg(rs[i]);
                    }
                    self.messagecount = self.messagecount -rs.length;
                    if(self.messagecount>0){
                        $(this).find('span').html(self.messagecount);
                    }else{
                        $(this).find('span').html(" ");
                    }
                    
                    //取消用户消息提示
                    var msguser = $(document.getElementById("#"+key));
                    msguser.attr('color','black');
                    msguser.css({'color':'black'});
                    clearInterval(msguser.attr('flashtimeid'));
                    
                }
            });
            this.addTo($('body'));
        }

    },
    //加载用户
    loadUser: function(users) {
        users = users || [];
        Barfoo.friends = Barfoo.friends || {};
        var self = this;
        var usertree = this.element.find('#bafTuser');
        var centerGroupImg = '<img align="absmiddle" src=' + '{0}skin/Images/gray_down.png'.format(Barfoo.imagehost) + '/>';//小组图标
        var centerUserImg = '<img  align="absmiddle" src=' + '{0}/skin/Images/img2.png'.format(Barfoo.imagehost) + '/>';    //用户图标
        var centerUserImg_gray = '<img width="19" height="19" align="absmiddle" src=' + '{0}/skin/Images/img2_gray.png'.format(Barfoo.imagehost) + '/>';    //用户图标
        //循环加载组
        for(var i = 0; i < users.length; i++) {
            var group = users[i];
            var groupDiv = $('<div>').attr({id: 'ug_' + group.id,'class': 'center0'}).append($('<div>').attr({ id: 'Gid_' + group.id,
                'class': 'a_center1'}).append(centerGroupImg).append(group.name));
            //加载用户
            for(var n = 0; n < group.users.length; n++) {
                var user = group.users[n];
                Barfoo.friends[user.email] = user.name;
                var userDiv = $('<div>').attr({
                    id: user.email,
                    'class': 'a_center2',
                    title: user.name,
                    uid: user.email
                });
                
                Uti.log(userDiv.attr('id'));
                
                if(user.status==='Online'){
                    userDiv.append(centerUserImg).append(user.name);
                }else if(user.status==='Offline'){
                    userDiv.append(centerUserImg_gray).append(user.name);
                }
                userDiv.click(function() {//弹出对话框
                    var title = $(this).attr('title');
                    var key = $(this).attr('uid');
                    Barfoo.Ui.dailogs[key] = Barfoo.Ui.dailogs[key] || new Barfoo.Ui.Dailog({
                        title: title,
                        uid: key
                    });
                    Barfoo.Ui.dailogs[key].show();
                    
                    var result = Uti.popDict(self.messages);
                        if(result){
                        var rs = result[1];
                        for(var i = 0; i < rs.length; i++) {
                            Barfoo.Ui.dailogs[key].appendMsg(rs[i]);
                        }
                        
                        Barfoo.main.messagecount = Barfoo.main.messagecount -rs.length;
                        if(Barfoo.main.messagecount>0){
                            Barfoo.main.element.find('.msgbox span').html(Barfoo.main.messagecount);
                        }else{
                            Barfoo.main.element.find('.msgbox span').html(" ");
                        }
                    }
                });
                groupDiv.append(userDiv);
            };
            usertree.append(groupDiv);
            
            
        };
        this.element.find('.a_center1').click(function() {//组成员的折叠/关闭
            var thisImg=$(this).find('img'),thisPar=$(this).parent().find('.a_center2');
            if($(this).next().is(':hidden')) {
                //让他们显示
                thisImg.attr('src', '{0}skin/Images/gray_down.png'.format(Barfoo.imagehost));
                thisPar.show();
            } else {
                thisImg.attr('src', '{0}skin/Images/gray_right.png'.format(Barfoo.imagehost));
                thisPar.hide()
            }
        });

        this.element.find('.email').click(function() { //用户组的折叠/关闭
            var A_center=self.element.find('#bafTuser'),Img=self.element.find('.email img'),B_center=self.element.find('#bafTgroup');
            var bottom=self.element.find('.a_bottom');
            var t1=self.element.find('.group_left1').length;
            if($('#bafCanKao').is(':hidden')){
                $('#bafCanKao').show();
                bottom.add(B_center).hide();
                A_center.hide();
                Img.attr('src','{0}skin/Images/big.png'.format(Barfoo.imagehost));
            }else{
                if(t1===0){
                    A_center.hide();
                    B_center.add(bottom).show();
                }else{
                    A_center.show();
                    B_center.add(bottom).hide();                   
                }
                $('#bafCanKao').hide();
                Img.attr('src','{0}skin/Images/samll.png'.format(Barfoo.imagehost));
            }
        });

        this.element.find('#bafStatus').click(function(e) {//状态栏显示隐藏操作  class为box
            self.element.find('.box').toggle();
            if(self.element.find('.box').is(':hidden')){
                //TODO 这里更换隐身的时候 头像的变化
                self.element.find('.head>img').attr('src','{0}skin/Images/img1.png'.format(Barfoo.imagehost));
            }else{
                 self.element.find('.head>img').attr('src','{0}skin/Images/img1.png'.format(Barfoo.imagehost));
            }
        });
        this.element.find('#bafStatus,.box').mouseleave(function(e){
            $('div.box').hide(e);
        });
        this.element.find('.box li').click(function() { //状态的显示隐藏操作
            var statusId = this.id;
            var $li = $(this).closest('.online').find('img').eq(0);
            if(statusId === 'bafOnlStatus') {
                //bafOnlStatus
                $li.attr('src', '{0}skin/Images/on_line.png'.format(Barfoo.imagehost));
                Runtime.sendRequest("friendStatus", {status : 'Online'});
            } else {
                //bafHideStatus
                $li.attr('src', '{0}skin/Images/invisible.png'.format(Barfoo.imagehost));
                Runtime.sendRequest("friendStatus", {status : 'Offline'});
            }

        })
    },
    loadGroup:function(group){
        group = group || [];
        Barfoo.group = Barfoo.group || {};
        if(!group.status)return;        
        var self = this;
        var grouptree = this.element.find('#bafTgroup');
        grouptree.html('');
       
         //循环加载组
        var center0=$('<div>').attr('class','center0');
        grouptree.append(center0);
         
        for(var i = 0; i < group.data.length; i++) {
            var set=$('<a>').addClass('sethover').attr('title','设置群');
            var exit=$('<a>').addClass('exithover').attr('title','退出群');
            var item = group.data[i];
            Barfoo.friends[item._id] = item.name;
            var set1=item.isself===true?set:exit;
            var seturl=item.isself===true?Barfoo.filehost+'/group/modify/?gid='+item._id+'&uid='+Barfoo.userinfo.id+'&token='+Barfoo.userinfo.token:'javascript:;';
            //var A=set1.attr({title:item._id,target:'_blank',href:seturl});
            var A=set1.attr({target:'_blank',href:seturl});
            var groupDiv =$('<div>').attr({id:item._id,title:item.name,'class':'a_center1'}).append(item.name).append(A);
            center0.append(groupDiv);
            groupDiv.click(function(e) {//弹出对话框
                if(e.target.nodeName!=='A'){
                    var title = $(this).attr('title');
                    var key = $(this).attr('id');
                    if(Barfoo.Ui.dailogs[key]){
                        Barfoo.Ui.dailogs[key].show()
                    }else{
                        Barfoo.Ui.dailogs[key] = Barfoo.Ui.dailogs[key] || new Barfoo.Ui.GroupDailog({
                            title: title,
                            uid: key
                        });
                    }
                }
            });
           groupDiv.hover(function(){   //控制设置显/隐
                  $(this).find('.sethover,.exithover').toggle();
            });         
        };
               this.element.find('.exithover').click(function(e){
               var that=this
               if(confirm('是否退出?')){
                   var url=Barfoo.filehost+'/group/member/remove/?jsoncallback=?&groupid='+this.title+'&uid='+Barfoo.userinfo.id+"&member_id="+Barfoo.userinfo.id+"&token="+Barfoo.userinfo.token;
                    $.getJSON(url,function(result){
                         if(result.status){
                                alert('退出成功');
                                $(that).closest('.a_center1').remove();          
                            }else{
                                alert('退出失败')
                            }
                       }) 
                }
              e.stopPropagation()
         })

    },
    loadUserStatus:function(result){ //用户状态变更
        /**
        if(result.status == 'Online'){//此处$('#uid_'+result.from),失效
            var parent = $(document.getElementById('uid_'+result.from)).parent();
            if(parent.find(".Online")){
                Uti.log("last",parent.find(".Online:last"),document.getElementById('uid_'+result.from));
                if(parent.find(".Online:last")){
                    $(document.getElementById('uid_'+result.from)).insertAfter(parent.find(".Online:last"));
                }
                
            }else{//插入到组第一位
                Uti.log("first",parent.find(".a_center2:first"),document.getElementById('uid_'+result.from));
                if(parent.find(".a_center2:first")){
                    $(document.getElementById('uid_'+result.from)).insertBefore(parent.find(".a_center2:first"));
                }
                
            }
            
            $(document.getElementById('uid_'+result.from)).removeClass('Offline');
            $(document.getElementById('uid_'+result.from)).addClass('Online');
            $(document.getElementById('uid_'+result.from)).find('img').attr('src','{0}skin/Images/img2.png'.format(Barfoo.imagehost));

        }else{
            var parent = $(document.getElementById('uid_'+result.from)).parent();
            if(parent.find(".a_center2:last")){
                Uti.log('offline last',parent.find(".a_center2:last"),document.getElementById('uid_'+result.from))
                $(document.getElementById('uid_'+result.from)).insertAfter(parent.find(".a_center2:last"));
            }
            
            $(document.getElementById('uid_'+result.from)).removeClass('Online');
            $(document.getElementById('uid_'+result.from)).addClass('Offline');
            $(document.getElementById('uid_'+result.from)).find('img').attr('src','{0}skin/Images/img2_gray.png'.format(Barfoo.imagehost));
        }**/
        
    },
    loadSelfStatus:function(status){//用户上下线更新
        //TODO 
        //this.element.find('.onlinestatus').html(status);
    },
    receiverMsg: function(result) { //接收到消息
        if(result.type =="group"){
            this.messages[result.to] = this.messages[result.to] || [];
            this.messages[result.to].push(result);
            $(document.getElementById(result.to)).HasMessage();
        }else{
            this.messages[result.from] = this.messages[result.from] || [];
            this.messages[result.from].push(result);
            
            $(document.getElementById(result.from)).HasMessage();
        }

        this.messagecount ++;
        this.element.find('.msgbox span').html(this.messagecount+"");
    }
});


//face
(function($) {
    //表情插件
    //$("div").FacesDiv() div 里应包含 触发控件，及 textarea
    $.fn.FacesDiv = function() {

        var Opt = {
            Element: null,
            Faces: null,
            TextArea: null
        };
        return this.each(function() {
            var eml = Opt.Element = $(this).find("#bafFaceImg");
            Opt.TextArea = $(this).find(".textarea");
            var faces = Opt.Faces = $("#layerBoxCon");
            if(faces.length == 0) {
                var _div = '<div style="background-color:#FFFFFF" class="expression_all divFaces" id="layerBoxCon"><div class="expression_top"></div><div class="expression_center"><div class="expression_center_content"><div class="expression_center_content_img"><img src="../skin/sysemotions/0.gif" title="[微笑]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/1.gif" title="[冷]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/2.gif" title="[色狼]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/3.gif" title="[发呆]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/4.gif" title="[得意]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/5.gif" title="[流泪]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/6.gif" title="[害羞]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/7.gif" title="[闭嘴]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/8.gif" title="[睡]"/></div> <div class="expression_center_content_img"><img src="../skin/sysemotions/9.gif" title="[大哭]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/10.gif" title="[尴尬]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/11.gif" title="[发怒]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/12.gif" title="[调皮]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/13.gif" title="[呲牙]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/14.gif" title="[惊讶]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/15.gif" title="[难过]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/16.gif" title="[装酷]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/17.gif" title="[冷汗]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/18.gif" title="[抓狂]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/19.gif" title="[呕吐]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/20.gif" title="[偷笑]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/21.gif" title="[可爱]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/22.gif" title="[白眼]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/23.gif" title="[傲慢]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/24.gif" title="[饥饿]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/25.gif" title="[困]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/26.gif" title="[惊恐]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/27.gif" title="[流汗]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/28.gif" title="[大笑]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/29.gif" title="[士兵]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/30.gif" title="[奋斗]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/31.gif" title="[咒骂]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/32.gif" title="[疑问]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/33.gif" title="[嘘]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/34.gif" title="[晕]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/35.gif" title="[折磨]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/36.gif" title="[衰]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/37.gif" title="[骷髅]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/38.gif" title="[敲打]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/39.gif" title="[再见]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/40.gif" title="[擦汗]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/41.gif" title="[扣鼻孔]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/42.gif" title="[鼓掌]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/43.gif" title="[糗大了]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/44.gif" title="[坏笑]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/45.gif" title="[左哼哼]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/46.gif" title="[右哼哼]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/47.gif" title="[打哈欠]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/48.gif" title="[鄙视]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/49.gif" title="[委屈]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/50.gif" title="[快哭了]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/51.gif" title="[阴险]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/52.gif" title="[亲亲]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/53.gif" title="[吓]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/54.gif" title="[可怜]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/55.gif" title="[菜刀]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/56.gif" title="[西瓜]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/57.gif" title="[啤酒]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/58.gif" title="[篮球]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/59.gif" title="[乒乓球]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/60.gif" title="[咖啡]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/61.gif" title="[饭]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/62.gif" title="[猪头]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/63.gif" title="[玫瑰]"/></div>  <div class="expression_center_content_img"><img src="../skin/sysemotions/64.gif" title="[凋谢]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/65.gif" title="[示爱]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/66.gif" title="[心]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/67.gif" title="[心碎]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/68.gif" title="[蛋糕]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/69.gif" title="[闪电]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/70.gif" title="[炸弹]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/71.gif" title="[刀]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/72.gif" title="[足球]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/73.gif" title="[瓢虫]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/74.gif" title="[便便]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/75.gif" title="[月亮]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/76.gif" title="[太阳]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/77.gif" title="[礼物]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/78.gif" title="[抱抱]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/79.gif" title="[强]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/80.gif" title="[弱]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/81.gif" title="[握手]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/82.gif" title="[胜利]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/83.gif" title="[抱拳]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/84.gif" title="[勾引]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/85.gif" title="[拳头]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/86.gif" title="[差劲]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/87.gif" title="[爱你]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/88.gif" title="[NO]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/89.gif" title="[OK]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/90.gif" title="[爱情]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/91.gif" title="[飞吻]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/92.gif" title="[跳跳]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/93.gif" title="[发抖]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/94.gif" title="[怄火]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/95.gif" title="[转圈]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/96.gif" title="[磕头]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/97.gif" title="[回头]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/98.gif" title="[跳绳]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/99.gif" title="[挥手]"/></div><div class="expression_center_content_img"><img src="../skin/sysemotions/100.gif" title="[激动]"/></div><div style="clear:both"></div></div></div><div class="expression_bottom"></div></div>';
                _div = _div.replace(new RegExp('../skin','g'),Barfoo.imagehost+"skin");
                faces = Opt.Faces = $(_div);
                $("body").append(faces.hide());
            }
            faces.find("img").bind("click", function(e) {
                //需要判断一下是不是当前编辑器
                if(Opt.TextArea.attr("id") === faces.attr("textarea")) {
                    var img = "<img src='" + this.getAttribute('src') + "'>";
                    Opt.TextArea[0].focus();
                    Barfoo.Ui.focusTool(Opt.TextArea[0], img);
                    Opt.TextArea.triggerHandler('keyup');
                }
            });
            //faces之外点击 表情框隐藏
            $(document).click(function() {
                faces.hide();

            });
            eml.click(function(e) {
                faces.attr("textarea", Opt.TextArea.attr("id"));
                Barfoo.Ui.inPosition(Opt.Faces, eml, 10, 10);

                function onscroll_() {
                    Barfoo.Ui.inPosition(Opt.Faces, eml, 10, 10);
                }
                $(window).scroll(onscroll_);
                $('body').scroll(onscroll_);
                faces.show("fast");
                //显示表情层时清除上次LIVE事件委托
                $(".ShowFaceDiv,#layerBoxCon").die();
                e.stopPropagation(); //阻止冒泡
            });
        });

    }
})(jQuery);

//上传
(function($) {
    //上传插件
    //$("div").BafUploadDiv() div 里应包含 触发控件，及 textarea
    $.fn.BafUploadDiv = function(ele,files) {

        return this.each(function() {
            var eml = files?$(this).find("#baffileField1"):$(this).find("#baffileField");
            var self = this,textarea = $(this).find(".textarea");

            eml.change(function(e) {
                var checkImg=files?true:checkImgType(this.value);
                if(checkImg) {
                    var file = $(this);
                    var $iframe = $('#msgiframe');
                    if($iframe.length===0){
                        $iframe = $("<iframe>").attr("name",'msgiframe').attr('id','msgiframe').css('display','none');
                        $('body').append($iframe);
                    }

                    var myform = $('#bafUpIdForm');
                    var fileType=files?'file':'img';
                    var url='{0}/upload/'+fileType+'/ie?cb={1}&uid={2}&token={3}';
                    url=url.format(Barfoo.filehost, location.href,Barfoo.userinfo.id,Barfoo.userinfo.token);
                    if(myform.length === 0) {
                        myform =$("<form >").attr({method:"POST",enctype:'multipart/form-data',action:url,
                            target:'msgiframe'});
                        $('body').append(myform);
                    } else {
                        myform.attr('action',url);
                        $("#bafUpIdForm input[type='file']").remove();
                    }


                    var fu = file.clone(true).val("");

                    file.appendTo(myform);
                    var timespan = $('<input>').attr({name:'t',value:new Date().toString()});
                    timespan.appendTo(myform);
                    $('body').append(myform);
                    myform.submit();
                    myform.remove();
                    
                    $(self).find('#bafLoadImg').show();
                    var timeid = setInterval(function(){
                        try{
                            var _url = frames["msgiframe"].document.location.href;
                            if(_url!='about:blank'){
                                clearInterval(timeid);
                                //加载完成
                                //var data = _url.split("#")[_url.split("#").length-1];//返回数据
                                var data = Uti.getQueryString('imdata',frames["msgiframe"].document.location);
                                data=jQuery.parseJSON(decodeURIComponent(data));
                                frames["msgiframe"].document.location.href = 'about:blank';
                                //msg 处理
                                var baseCallUrl='{0}/download/?fid={1}&uid={2}&token={3}';
                                if(files){
                                    var fileUrl=baseCallUrl.format(Barfoo.filehost,data.sid,Barfoo.userinfo.id,Barfoo.userinfo.token);
                                    //var msg='&lt;a href="'+fileUrl+'" target="_blank"&gt;下载文件&lt;/a&gt;';
                                    var msg='您的好友向您发送文件 <a href="'+fileUrl+'" target="_blank" style="color:blue">下载文件</a>';
                                    var msgSelf='<span style="color: blue;">您已成功向对方发送文件</span>';
                                }else{
                                    var imgUrl=baseCallUrl.format(Barfoo.filehost,data.pid,Barfoo.userinfo.id,Barfoo.userinfo.token);
                                    var imgDown=baseCallUrl.format(Barfoo.filehost,data.sid,Barfoo.userinfo.id,Barfoo.userinfo.token);
                                    var msg='<a href="'+imgDown+'" target="_blank"><img src="'+imgUrl+'"/></a>';
                                    var show=msg;
                                }

                                var result={
                                    to:ele.uid,
                                    time:new Date().toIMString(),
                                    from:Barfoo.userinfo.email
                                }
                                if(files){
                                    var show={};
                                    show.body=escape(msgSelf);
                                    ele.appendMsg($.extend(result,show));
                                }
                                result.body= escape(msg);
                                !files&&ele.appendMsg(result);

                                var element=ele.element;
                                element.find('#bafLoadImg').hide();
                                //file input reset
                                var liReset=files?element.find('#bafUpFile'):element.find('#textfield1')
                                liReset.closest('li').append(fu);

                                Runtime.sendRequest("chat",result);

                            }
                        }catch(e){
                            clearInterval(timeid);
                        }
                    },500);

                } else {
                    alert('抱歉只能下载图片')
                }

            });

            function checkImgType(filename) {
                var pos = filename.lastIndexOf(".");
                var str = filename.substring(pos, filename.length)
                var str1 = str.toLowerCase();
                if(!/\.(gif|jpg|jpeg|png|bmp)$/.test(str1)) {
                    return false;
                }
                return true;
            }
        });

    };
    
})(jQuery);

(function($) {
    //有新消息提示插件 
    $.fn.HasMessage = function(){
        return this.each(function(){
            var self = this;
            function flash(){
                if($(self).attr('color')=='red'){
                    $(self).css({'color':'black'});
                    $(self).attr('color','black');
                }else{
                    $(self).css({'color':'red'});
                    $(self).attr('color','red');
                }
            }
            
            var flashtimeid = setInterval(flash,500);
           
            $(self).attr('flashtimeid',flashtimeid);
            
            $(self).click(function(){
                $(this).attr('color','black');
                $(this).css({'color':'black'});
                clearInterval($(this).attr('flashtimeid'));
            });
            
        })
    };
    
})(jQuery);


//聊天对话框
function bafSendDiv(obj) {
    var baseImg=Barfoo.imagehost+'skin/Images/';
    var str = '';
    //BEGIN
    str += '<div class="chat_top">';
    //头部
    str += '<div class="name">' + obj.title + '</div><div class="shut"><a href="javascript:;"><img id="bafDiagClo" width="13" height="12" src="'+baseImg+'shut_icon.png"></a></div><div style="clear:both"></div></div><div class="chat_center"><div class="left_chat">';
    //接受消息框
    str += '<div class="chat_box1"><ul class="message"></ul></div>';
    //表情栏
    str += '<div class="chat_line"><ul><li><img id="bafFaceImg" width="18" height="16" title="表情" src="'+baseImg+'expression.png"></li><li><a href="javascript:;"><img width="18" height="16" name="textfield2" id="bafUpFile" title="传送文件" src="'+baseImg+'file.png"></a><input type="file" size="5" id="baffileField1" class="filea" name="barfoofile"></li><li><a href="javascript:;"><img width="18" height="16" name="textfield" id="textfield1" title="传送文件" src="'+baseImg+'sendimg.png"></a><input type="file" size="5" id="baffileField" class="filea upimg" name="barfoofile"></li><li id="bafLoadImg" style="display: none;"><img width="18" height="16" title="正在上传" src="'+baseImg+'load.gif">正在上传</li></ul></div>';
    //发送消息框
    str += '<div class="chat_input"><div contenteditable="true" class="textarea chat_input" id="'+obj.uid+'"></div><span class="button_send"><a href="javascript:;"><img width="53" height="73" src="'+baseImg+'button_gray.png"></a></span></div></div>'
    //OVER
    str += '</div>';

    return str;

}

