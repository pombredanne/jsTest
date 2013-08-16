/*
     上传渐进方案:  http://kb.cnblogs.com/page/153741/
     iframe上传: 上传中最难但针对跨域上传 最有效的一个方法 同时也是 jquery-form 插件中的难点:
     关于获取文件路径一个小注意点:
            js 取得的是图片的数据 不建议使用FireFox
            if(IE){
                obj.select();
                picPath=document.selection.createRange().text;
            }else if(FireFox){
                if(obj.files){
                    // Firefox下
                    var reader = new FileReader();
                    picPath=obj.files.item(0).mozFullPath;  // mozFullPath 需要特殊权限  见数字签名-http://tianmoboping.blog.163.com/blog/static/1573953220075279330978/
                }
                picPath= 'file:///'+obj.value;
            }
*/

// --- iframe上传   http://malsup.com/jquery/form/#download
var fileUploadIframe=function (a) {
        var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle,
            deferred = $.Deferred();

        s = $.extend(true, {}, $.ajaxSettings, options);  // 注意这里是 ajaxSettings
        s.context = s.context || s;
        id = 'jqFormIO' + (+new Date());
        // TODO 这里难道不可以 自动创建一个iframe 重复使用吗? 创建后，又创建呢？？
        if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr2('name');
            (n)?(id = n):($io.attr2('name', id));
        }else {
            //TODO 为什么不使用 width height=0 呢?
            $io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" style="position:absolute;top: -1000px;left:-1000px"/>');
        }

        io = $io[0];

        xhr = {
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function(status) {
                var e = (status === 'timeout' ? 'timeout' : 'aborted');
                log('aborting upload... ' + e);
                this.aborted = 1;

                try {
                    if (io.contentWindow.document.execCommand) {
                        io.contentWindow.document.execCommand('Stop');
                    }
                }
                catch(ignore) {}

                $io.attr('src', s.iframeSrc); // abort op in progress
                xhr.error = e;
                (s.error)&&(s.error.call(s.context, xhr, e, status))
                (g)&&($.event.trigger("ajaxError", [xhr, s, e]))
                (s.complete)&&(s.complete.call(s.context, xhr, e))
            }
        };

        /*
            ajax知识补充:
               1:绑定事件  http://api.jquery.com/Ajax_Events/?rdfrom=http%3A%2F%2Fdocs.jquery.com%2Fmw%2Findex.php%3Ftitle%3DAjax_Events%26redirect%3Dno
                  ajax事件分为本地方法(自定义),全局方法(eg:ajaxStrat ajaxStop) 事件触发并不意味着立即执行;
               2:s.global  默认:true
                 无论怎么样这个请求将触发全局AJAX事件处理程序.设置为 false 将不会触发全局 AJAX 事件，如 ajaxStart 或者 ajaxStop。

         */
        //TODO $.activ http://hustoknow.blogspot.com/2010/10/how-jqueryactive-code-works.html
        g = s.global;
        if (g && 0 === $.active++) {   // 监听一个新的请求
            $.event.trigger("ajaxStart");
        }

        (g) && ($.event.trigger("ajaxSend", [xhr, s]))

        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {  //判断beforeSend

            if (s.global) {
                $.active--;  // if $.active===0  那么将会自动触发ajaxStop事件
            }
            deferred.reject(); //将延迟时间 从"未完成"改为"已失败"  出发fail(error)方法
            return deferred;
        }

        if (xhr.aborted) {     //取消ajax
            deferred.reject();
            return deferred;
        }

        sub = form.clk;  //触发表单元素  e.target
        if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
                s.extraData = s.extraData || {};
                s.extraData[n] = sub.value;
                if (sub.type === "image") {
                    s.extraData[n+'.x'] = form.clk_x;
                    s.extraData[n+'.y'] = form.clk_y;
                }
            }
        }

        var CLIENT_TIMEOUT_ABORT = 1;
        var SERVER_ABORT = 2;

        var getDoc=function(frame) {   //获取 iframe的 docuemnt

            var doc ;

            // IE8 级联访问检查
            try {
                if (frame.contentWindow) {
                    doc = frame.contentWindow.document;
                }
            } catch(err) {
                //  IE8 SSL下拒绝访问&丢失协议
                log('cannot get iframe.contentWindow document: ' + err);
            }

            if (doc) {
                return doc;
            }

            try { // 简单检查在IE8可能会抛出下SSL或不匹配的协议
                doc = frame.contentDocument || frame.document;
            } catch(err) {
                log('cannot get iframe.contentDocument: ' + err);
                doc = frame.document;
            }
            return doc;
        };

        // 注入攻击 Rails CSRF hack (thanks to Yvan Barthelemy)
        var csrf_token = $('meta[name=csrf-token]').attr('content'),
            csrf_param = $('meta[name=csrf-param]').attr('content');

        if (csrf_param && csrf_token) {
            s.extraData = s.extraData || {};
            s.extraData[csrf_param] = csrf_token;
        }

        var doSubmit=function() {
            var t = $form.attr2('target'), a = $form.attr2('action');

            form.setAttribute('target',id);
            if (!method) {
                form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
                form.setAttribute('action', s.url);
            }

            if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            if (s.timeout) {
                timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }

            // 监听服务是否被abort 
            var checkState=function() {
                try {
                    var state = getDoc(io).readyState;
                    log('state = ' + state);
                    if (state && state.toLowerCase() == 'uninitialized'){
                        setTimeout(checkState,50);
                    }
                }
                catch(e) {
                    log('Server abort: ' , e, ' (', e.name, ')');
                    cb(SERVER_ABORT);
                    if (timeoutHandle){
                        clearTimeout(timeoutHandle);
                    }
                    timeoutHandle = null;
                }
            }

            var extraInputs = [];
            try {
                if (s.extraData) {    //上传的时候 是否添加额外数据
                    for (var n in s.extraData) {
                        if (s.extraData.hasOwnProperty(n)) {
                            if($.isPlainObject(s.extraData[n]) && s.extraData[n].hasOwnProperty('name') && s.extraData[n].hasOwnProperty('value')) {
                                extraInputs.push($('<input type="hidden" name="'+s.extraData[n].name+'">').val(s.extraData[n].value).appendTo(form)[0]);
                            } else {
                                extraInputs.push($('<input type="hidden" name="'+n+'">').val(s.extraData[n]).appendTo(form)[0]);
                            }
                        }
                    }
                }

                if (!s.iframeTarget) {
                    $io.appendTo('body');
                    $io.load(function(){
                        cb();
                    });
                }
                setTimeout(checkState,15);

                try {
                    form.submit();
                } catch(err) {
                    var submitFn = document.createElement('form').submit;
                    submitFn.apply(form);
                }
            }
            finally {
                form.setAttribute('action',a);
                if(t) {
                    form.setAttribute('target', t);
                } else {
                    $form.removeAttr('target');
                }
                $(extraInputs).remove();
            }
        }

        if (s.forceSync) {
            doSubmit();
        }else {
            setTimeout(doSubmit, 10); // this lets dom updates render
        }

        var data, doc, domCheckCount = 50, callbackProcessed;

        function cb(e) {
            if (xhr.aborted || callbackProcessed) {
                return;
            }

            doc = getDoc(io);
            if(!doc) {
                log('cannot access response document');
                e = SERVER_ABORT;
            }

            //检查是否abort
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                xhr.abort('timeout');
                deferred.reject(xhr, 'timeout');
                return;
            }else if (e == SERVER_ABORT && xhr) {
                xhr.abort('server abort');
                deferred.reject(xhr, 'error', 'server abort');
                return;
            }

            if (doc.location.href == s.iframeSrc && !timedOut) {
                // 还未回应的时候 继续
                    return;
            }
            $io.load(function(){
               cb();
            });

            var status = 'success', errMsg;
            try {
                if (timedOut) {
                    throw 'timeout';
                }

                // 判断数据类型 
                var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                log('isXml='+isXml);
                if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                    if (--domCheckCount) {
                        log('requeing onLoad callback, DOM not available');
                        setTimeout(cb, 250);
                        return;
                    }
                }

                var docRoot = doc.body ? doc.body : doc.documentElement;
                xhr.responseText = docRoot ? docRoot.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                if (isXml){
                    s.dataType = 'xml';
                }
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': s.dataType};
                    return headers[header];
                };
                // support for XHR 'status' & 'statusText' emulation :
                if (docRoot) {
                    xhr.status = ( docRoot.getAttribute('status')-0 ) || xhr.status;
                    xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                }

                var dt = (s.dataType || '').toLowerCase(),
                    scr = /(json|script|text)/.test(dt);

                // 如果返回数据是json script text 则放入textarea中
                if (scr || s.textarea) {
                    var ta = doc.getElementsByTagName('textarea')[0];
                    if (ta) { //ie
                        xhr.responseText = ta.value;
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                    }else if (scr) { // 高版本 以及 火狐
                        var pre = doc.getElementsByTagName('pre')[0],
                            b = doc.getElementsByTagName('body')[0];
                        if (pre) {
                            xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                        }else if (b) {
                            xhr.responseText = b.textContent ? b.textContent : b.innerText;
                        }
                    }
                }else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
                    xhr.responseXML = toXml(xhr.responseText);
                }

                try {
                    data = httpData(xhr, dt, s);
                }
                catch (err) {
                    status = 'parsererror';
                    xhr.error = errMsg = (err || status);
                }
            }
            catch (err) {
                log('error caught: ',err);
                status = 'error';
                xhr.error = errMsg = (err || status);
            }

            if (xhr.aborted) {
                log('upload aborted');
                status = null;
            }

            if (xhr.status) { // we've set xhr.status
                status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (status === 'success') {
                if (s.success){
                    s.success.call(s.context, data, 'success', xhr);
                }

                deferred.resolve(xhr.responseText, 'success', xhr);
                if (g){
                    $.event.trigger("ajaxSuccess", [xhr, s]);
                }
            }else if (status) {
                if (errMsg === undefined)
                    errMsg = xhr.statusText;
                if (s.error)
                    s.error.call(s.context, xhr, status, errMsg);
                deferred.reject(xhr, 'error', errMsg);
                if (g)
                    $.event.trigger("ajaxError", [xhr, s, errMsg]);
            }

            // 同 358行
            if (g){
                $.event.trigger("ajaxComplete", [xhr, s]);
            }
            if (g && ! --$.active) {
                $.event.trigger("ajaxStop");
            }

            if (s.complete){
                s.complete.call(s.context, xhr, status);
            }

            callbackProcessed = true;
            if (s.timeout){
                clearTimeout(timeoutHandle);
            }
            // clean up
            setTimeout(function() {
                if (!s.iframeTarget)
                    $io.remove();
                xhr.responseXML = null;
            }, 100);
        }

        var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else {
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            }
            return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
        };
        var parseJSON = $.parseJSON || function(s) {
            return window['eval']('(' + s + ')');
        };

        var httpData = function( xhr, type, s ) { // 大多数在1.4之前已经解除

            var ct = xhr.getResponseHeader('content-type') || '',
                xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
                if ($.error){
                    $.error('parsererror');
                }
            }
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            if (typeof data === 'string') {
                if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                    data = parseJSON(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    $.globalEval(data);
                }
            }
            return data;
        };

        return deferred;
    };

    //我个人在跨欲 做的上传 原理同上:
    //解决domain无法访问--- http://www.58lou.com/separticle.php?artid=180
/* 
ifrane 操作   --  http://www.58lou.com/separticle.php?artid=179
chorme:使用 ownerDocument  _iframe.contentWindow.document? _iframe.contentWindow.document.body : _iframe.ownerDocument.body; 
*/
// 创建ifram
var iframeID = 'bafUploadIframe',
    $iframe = $('#' + iframeID);

if ($iframe.length === 0) {
    $iframe = $("<iframe>", {
        name: iframeID,
        id: iframeID,
        style: 'display:none'
    }).appendTo($('body'));

    if (document.documentMode < 8) {
        $iframe[0].contentWindow.name = iframeID;
    }
}
// 创建临时form
var myform = $('#bafUploadForm'),
    fileType = isFile ? 'file' : 'img',
    url = '{0}/upload/' + fileType + '/ie?cb={1}&uid={2}&token={3}';
url = url.format(BarfooIM.filehost, location.href, BarfooIM.userinfo.id, BarfooIM.userinfo.token);

if (myform.length === 0) {
    myform = $("<form>", {
        method: "POST",
        enctype: 'multipart/form-data',
        action: url,
        target: iframeID
    }).appendTo($('body'));
} else {
    myform.attr('action', url);
    $("#bafUploadForm input[type='file']").remove();
}

file.appendTo(myform); //file  就是上传条  
//附加额外数据
$('<input>', {
    name: 't',
    value: new Date().toString(),
    style: 'display:none' //没有使hidden  在有些ie中会报错 因此采用默认的text
}).appendTo(myform);

myform.submit();

var timeid = setInterval(function() {
    try {

        var _url = frames[iframeID].document.location.href;

        if (_url != 'about:blank') {
            clearInterval(timeid);
            //加载完成  这些返回数据格式为json
            var data = Uti.getQueryString('imdata', frames[iframeID].document.location);
            data = jQuery.parseJSON(decodeURIComponent(data));
            frames[iframeID].document.location.href = 'about:blank';

            //success 处理            

        }
    } catch (e) {
        clearInterval(timeid);
        alert('上传文件失败')
    }

}, 500);

// 图片预览
if (typeof FileReader === 'undefined') {
    input.setAttribute('disabled', 'disabled');
} else {
    input.addEventListener('change', readFile, false);
}

function readFile() {

    var file = this.files[0];

    if (!/image\/\w+/.test(file.type)) {

        alert("请确保文件为图像类型");

        return false;

    }

    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function(e) {

        result.innerHTML = '<img src="' + this.result + '" alt=""/>'

    }

}

// 验证插件
/*
    1: html5插件 http://www.zhangxinxu.com/wordpress/2012/12/html5-number-input-step-invidate/
        DBC2SBC:
         将全角SBC字符转化为半角DBC字符
          全角空格为12288，半角空格为32；其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248
         * "我爱看３Ｄ阿凡达".sbc2dbc()->我爱看3D阿凡达
            var sbc2dbc = function (){
                  return this.replace(/[\uff01-\uff5e]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248);}).replace(/\u3000/g," ");
            }

        novalidate  -- 取消默认验证
    2: Valiform 优势    没发现什么优势 也就是 check处理丰富
*/
