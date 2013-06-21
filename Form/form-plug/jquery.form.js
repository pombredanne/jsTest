
;(function($) {
"use strict";

var feature = {};
feature.fileapi = $("<input type='file'/>")[0].files !== undefined;
feature.formdata = window.FormData !== undefined;

var hasProp = !!$.fn.prop;  //jquery 1.6

//主要起一个兼容prop的方法  不太理解这样做的目的
$.fn.attr2 = function() {
    if(!hasProp){
        return this.attr.apply(this, arguments);
   }
    var val = this.prop.apply(this, arguments);
    if((val&&val.jquery) || typeof val === 'string' ){
        return val;
   }
   return this.attr.apply(this, arguments);
};

$.fn.ajaxSubmit.debug = false;
var log=function() {
    if (!$.fn.ajaxSubmit.debug){
        return;
    }
    var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
    if (window.console && window.console.log) {
        window.console.log(msg);
    }
    else if (window.opera && window.opera.postError) {
        window.opera.postError(msg);
    }
},
doAjaxSubmit=function(e) {
    var options = e.data;
    if (!e.isDefaultPrevented()) { 
        e.preventDefault();  //阻止默认行为
        $(this).ajaxSubmit(options);
    }
},
captureSubmittingElement=function (e) {
    var target = e.target,
        $el = $(target);
    if (!($el.is("[type=submit],[type=image]"))) {
        var t = $el.closest('[type=submit]');
        if (t.length === 0) {
            return;
        }
        target = t[0];
    }
    var form = this;
    form.clk = target;
    if (target.type === 'image') {
        if (e.offsetX !== undefined) {
            form.clk_x = e.offsetX;
            form.clk_y = e.offsetY;
        } else if (typeof $.fn.offset == 'function') {
            var offset = $el.offset();
            form.clk_x = e.pageX - offset.left;
            form.clk_y = e.pageY - offset.top;
        } else {
            form.clk_x = e.pageX - target.offsetLeft;
            form.clk_y = e.pageY - target.offsetTop;
        }
    }
    // clear form vars
    setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
};

$.fn.ajaxSubmit = function(options) {

    if (!this.length) {
        log('ajaxSubmit: no element');
        return this;
    }

    var deepSerialize=function (extraData){  //深度拷贝
        var serialized = $.param(extraData, options.traditional).split('&');
        var len = serialized.length;
        var result = [];
        var i, part;
        for (i=0; i < len; i++) {
            serialized[i] = serialized[i].replace(/\+/g,' ');
            part = serialized[i].split('=');
            result.push([decodeURIComponent(part[0]), decodeURIComponent(part[1])]);
        }
        return result;
    },
    fileUploadXhr=function (a) {
        var formdata = new FormData();

        for (var i= 0,length= a.length; i <length; i++) {
            var cache=a[i];
            formdata.append(cache.name, cache.value);
        }

        if (options.extraData) {
            var serializedData = deepSerialize(options.extraData);
            length=serializedData.length;
            for (i=0; i < length; i++){
             (serializedData[i])&&(formdata.append(serializedData[i][0], serializedData[i][1]));
            }
        }

        delete options.data;

        var s = $.extend(true, {}, $.ajaxSettings, options, {
            contentType: false,
            processData: false,
            cache: false,
            type: method || 'POST'
        });

        if (options.uploadProgress) {
            s.xhr = function() {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function(event) {
                        var percent = 0,
                            position = event.loaded || event.position,
                            total = event.total;

                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        options.uploadProgress(event, position, total, percent);
                    }, false);
                }
                return xhr;
            };
        }

        delete s.data;
        var beforeSend = s.beforeSend;
        s.beforeSend = function(xhr, o) {
            o.data = formdata;
            if(beforeSend){
                beforeSend.call(this, xhr, o);
            }

        };
        return $.ajax(s);
    },
    fileUploadIframe=function (a) {
        var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle,
            deferred = $.Deferred();



//          var length=elements.length;
//        if (a) {
//            for (i=0; i < length; i++) {
//                el = $(elements[i]);
//            }
//        }

        s = $.extend(true, {}, $.ajaxSettings, options);
        s.context = s.context || s;
        id = 'jqFormIO' + (new Date().getTime());
        // TODO 这里难道不可以 自动创建一个iframe 重复使用吗?
        if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr2('name');
            (n)?(id = n):($io.attr2('name', id));
        }else {
            //为什么不使用 width height=0 呢?
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

        g = s.global;
        if (g && 0 === $.active++) {
            $.event.trigger("ajaxStart");
        }

        (g) && ($.event.trigger("ajaxSend", [xhr, s]))

        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            if (s.global) {
                $.active--;
            }
            deferred.reject();
            return deferred;
        }
        if (xhr.aborted) {
            deferred.reject();
            return deferred;
        }

        sub = form.clk;
        if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
                s.extraData = s.extraData || {};
                s.extraData[n] = sub.value;
                if (sub.type == "image") {
                    s.extraData[n+'.x'] = form.clk_x;
                    s.extraData[n+'.y'] = form.clk_y;
                }
            }
        }

        var CLIENT_TIMEOUT_ABORT = 1;
        var SERVER_ABORT = 2;

        var getDoc=function(frame) {

            var doc = null;

            // IE8 cascading access check
            try {
                if (frame.contentWindow) {
                    doc = frame.contentWindow.document;
                }
            } catch(err) {
                // IE8 access denied under ssl & missing protocol
                log('cannot get iframe.contentWindow document: ' + err);
            }

            if (doc) {
                return doc;
            }

            try { // simply checking may throw in ie8 under ssl or mismatched protocol
                doc = frame.contentDocument ? frame.contentDocument : frame.document;
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

            // update form attrs in IE friendly way
            form.setAttribute('target',id);
            if (!method) {
                form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
                form.setAttribute('action', s.url);
            }

            // ie borks in some cases when setting encoding
            if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (s.timeout) {
                timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }

            // look for server aborts
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
                if (s.extraData) {
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
                    // TODO 修改这里的执行方式
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
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                xhr.abort('timeout');
                deferred.reject(xhr, 'timeout');
                return;
            }else if (e == SERVER_ABORT && xhr) {
                xhr.abort('server abort');
                deferred.reject(xhr, 'error', 'server abort');
                return;
            }

            if (!doc || doc.location.href == s.iframeSrc) {
                // 还未回应的时候 继续
                if (!timedOut){
                    return;
                }
            }
            $io.load(function(){
               cb();  //TODO  同上 采用了jquery的方法
            });

            var status = 'success', errMsg;
            try {
                if (timedOut) {
                    throw 'timeout';
                }

                var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                log('isXml='+isXml);
                if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                    if (--domCheckCount) {
                        // in some browsers (Opera) the iframe DOM is not always traversable when
                        // the onload callback fires, so we loop a bit to accommodate
                        log('requeing onLoad callback, DOM not available');
                        setTimeout(cb, 250);
                        return;
                    }
                    // let this fall through because server response could be an empty document
                    //log('Could not access iframe DOM after mutiple tries.');
                    //throw 'DOMException: not available';
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

                if (scr || s.textarea) {
                    var ta = doc.getElementsByTagName('textarea')[0];
                    if (ta) {
                        xhr.responseText = ta.value;
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                    }else if (scr) {
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

            if (g){
                $.event.trigger("ajaxComplete", [xhr, s]);
            }


            if (g && ! --$.active) {
                $.event.trigger("ajaxStop");
            }

            if (s.complete)
                s.complete.call(s.context, xhr, status);

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
            /*jslint evil:true */
            return window['eval']('(' + s + ')');
        };

        var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

            var ct = xhr.getResponseHeader('content-type') || '',
                xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
                if ($.error)
                    $.error('parsererror');
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

    var method, action, url, $form = this;

    (typeof options === 'function') &&(options = { success: options })

    method = options.type || this.attr2('method');
    action = options.url  || this.attr2('action');

    //定义 iframe的url
    url = (typeof action === 'string') ? $.trim(action) : '';
    url = url || window.location.href;
    (url) && (url = (url.match(/^([^#]+)/)||[])[1])  //去掉hash部分

    options = $.extend(true, {
        url:  url,
        success: $.ajaxSettings.success,
        type: method || 'GET',
        iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
    }, options);

    //TODO 针对这些插件考虑是否增加判断??? form-submit-notify form-submit-validate  form-pre-serialize    针对FCKedit  http://www.cnblogs.com/fengmk2/archive/2009/01/04/1216013.html

    //序列化表单对象之前
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    //如果你想要用传统的方式来序列化数据  (数据中的对象数据会直接编译成object)
    var traditional = options.traditional;
    if ( traditional === undefined ) {
        traditional = $.ajaxSettings.traditional;
    }

    var elements = [],qx, a = this.formToArray(options.semantic, elements);

    if (options.data) { //是否需要额外的数据支持?
        options.extraData = options.data;
        qx = $.param(options.data, traditional);
    }
    // 提交之前 这时候已经有生成好的 查询数据了
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    var q = $.param(a, traditional);
    (qx) &&(q = ( q ? (q + '&' + qx) : qx ));
    
    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        delete options.data ; 
    }else {
        options.data = q; 
    }

    var callbacks = [];
    (options.resetForm) && (callbacks.push(function() { $form.resetForm(); }))
    (options.clearForm)&&(callbacks.push(function() { $form.clearForm(options.includeHidden); }))

    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            var fn = options.replaceTarget ? 'replaceWith' : 'html';
            $(options.target)[fn](data).each(oldSuccess, arguments);
        });
    }else if (options.success) {
        callbacks.push(options.success);
    }

    options.success = function(data, status, xhr) { 
        var context = options.context || this ;    // jQuery 1.4+ supports scope context
        for (var i=0, max=callbacks.length; i < max; i++) {
            callbacks[i].apply(context, [data, status, xhr || $form, $form]);
        }
    };

    if (options.error) {
        var oldError = options.error;
        options.error = function(xhr, status, error) {
            var context = options.context || this;
            oldError.apply(context, [xhr, status, error, $form]);
        };
    }

     if (options.complete) {
        var oldComplete = options.complete;
        options.complete = function(xhr, status) {
            var context = options.context || this;
            oldComplete.apply(context, [xhr, status, $form]);
        };
    }

    // TODO 这是块骨头啊 are there files to upload?
    var fileInputs = $('input[type=file]:enabled[value!=""]', this),
         hasFileInputs = fileInputs.length > 0,
         mp = 'multipart/form-data',
         multipart = ($form.attr('enctype') === mp || $form.attr('encoding') === mp),
         fileAPI = feature.fileapi && feature.formdata,
         shouldUseFrame = (hasFileInputs || multipart) && !fileAPI,
         jqxhr;

    if((hasFileInputs || multipart) && fileAPI){
        jqxhr = fileUploadXhr(a);
    }else if(options.iframe !== false && (options.iframe || shouldUseFrame)){
        // TODO 放弃这里 why??? (options.closeKeepAlive)
        jqxhr = fileUploadIframe(a);
    }else{
        jqxhr = $.ajax(options);
    }

    $form.data('jqxhr', jqxhr);

    elements=[];

    return this;

};

$.fn.ajaxForm = function(options) {
    options = options || {};
    //options.delegation = options.delegation && $.isFunction($.fn.delegate);  //TODO 使用on方法
    // TODO 个人感觉 这里应该强制在form加载完毕后使用
    return this.ajaxFormUnbind().bind('submit.form-plugin', options, doAjaxSubmit)
                                     .bind('click.form-plugin', options, captureSubmittingElement);
};

$.fn.ajaxFormUnbind = function() {
    return this.unbind('submit.form-plugin click.form-plugin');
};

$.fn.formToArray = function(semantic, elements) {
    if (this.length === 0) {
        return [];
    }

    var a = [];
    if (this.length === 0) {
        return a;
    }

    var form = this[0],
        els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) {
        return a;
    }

    var i,j,n,v,el,max,jmax;
    for(i=0, max=els.length; i < max; i++) {
        el = els[i];
        n = el.name;
        if (!n || el.disabled) {
            continue;
        }

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(form.clk == el) {
                a.push({name: n, value: $(el).val(), type: el.type });
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            }
            continue;
        }

        v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            if (elements)
                elements.push(el);
            for(j=0, jmax=v.length; j < jmax; j++) {
                a.push({name: n, value: v[j]});
            }
        }
        else if (feature.fileapi && el.type == 'file') {
            if (elements)
                elements.push(el);
            var files = el.files;
            if (files.length) {
                for (j=0; j < files.length; j++) {
                    a.push({name: n, value: files[j], type: el.type});
                }
            }
            else {
                // #180
                a.push({ name: n, value: '', type: el.type });
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            if (elements)
                elements.push(el);
            a.push({name: n, value: v, type: el.type, required: el.required});
        }
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle it here
        var $input = $(form.clk), input = $input[0];
        n = input.name;
        if (n && !input.disabled && input.type == 'image') {
            a.push({name: n, value: $input.val()});
            a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;

    // TODO 修改的 不明白这里为什么使用这个 and the semantic ?????
    /*var form = this[0],
        els = semantic ? form.getElementsByTagName('*') : form.elements;

    if(els){
        if(elements){
            var i,n,el,max;
            for(i=0, max=els.length; i < max; i++) {
                el = els[i];
                n = el.name;
                if(n&& !el.disabled && feature.fileapi && el.type === 'file' || el.value){
                    elements.push(el);
                }
            }
        }
        return $(this).serializeArray();
    }else{
        return [];
    }*/

};

$.fn.formSerialize = function(semantic) {
    return $.param(this.formToArray(semantic));
};

$.fn.fieldSerialize = function(successful) {
    if (this.length === 0) {
        return [];
    }
    var tag = this.tagName.toLowerCase();
    if(tag==='form'){
        return $(this).serialize();
    }    
    // TODO 不明白这里为什么使用这个
};

$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i],
             v = $.fieldValue(el, successful);
        if(v|| (v.constructor === Array && v.length)){
            (v.constructor === Array)?( $.merge(val, v)):(val.push(v));    
        }
    }
    return val;
};

$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    successful=successful||true;

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1)) {
            return null;
    }
    return el.selectedIndex<0?null:$(el).val();
        //var multiple = (t === 'multiple'); //select-one
};

$.fn.clearForm = function(includeHidden) {
    return this.each(function() {
        $(this.elements).clearFields(includeHidden);
        //$('input,select,textarea', this).clearFields(includeHidden);
    });
};

$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if(tag==='button'||t==='submit'||t==='button'||t==='reset'){
            return true;
        }
        if (re.test(t) || tag === 'textarea') {
            this.value = '';
        }else if (t === 'checkbox' || t === 'radio') {
            this.checked = false;
        }else if (tag === 'select') {
            this.selectedIndex = -1;
        }else if (t === "file") {
			if (/MSIE/.test(navigator.userAgent)) {
				$(this).replaceWith($(this).clone(true));
			} else {
				$(this).val('');
			}
	   }else if (includeHidden) {
            // includeHidden 是否清楚hidden  
            if ( (includeHidden === true && /hidden/.test(t)) ||(typeof includeHidden == 'string' && $(this).is(includeHidden)) )
                this.value = '';
        }
    });
};

$.fn.resetForm = function() {
    return this.each(function() {
        // ie报告为对象
        if (typeof this.reset === 'function' || (typeof this.reset === 'object' && !this.reset.nodeType)) {
            this.reset();   //默认的reset 不会清除 hidden
        }
    });
};

$.fn.enable = function(b) {
    b=b||true;
    return this.each(function() {
        this.disabled = !b;
    });
};

$.fn.selected = function(select) {
    select=select||true;

   return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio') {
            this.checked = select;
        }else if (this.tagName.toLowerCase() === 'option') {
            var $sel = $(this).parent('select');
            $sel.val(this.value);
        }
    });
};


})(jQuery);
