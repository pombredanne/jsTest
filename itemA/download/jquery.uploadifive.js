/*
UploadiFive 1.1.0
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the UploadiFive Standard License <http://www.uploadify.com/uploadifive-standard-license>
*/

// http://www.uploadify-cn.info/documentation/index.html
;(function($) {

    "use strict";

    var methods = {

        init : function(options) {

            return this.each(function() {

                var $this = $(this);

                $this.data('uploadifive', {
                    inputs     : {}, // The object that contains all the file inputs
                    inputCount : 0,  // The total number of file inputs created
                    fileID     : 0,
                    queue      : {
                        count      : 0, // Total number of files in the queue
                        selected   : 0, // Number of files selected in the last select operation
                        replaced   : 0, // Number of files replaced in the last select operation
                        errors     : 0, // Number of files that returned an error in the last select operation
                        queued     : 0, // Number of files added to the queue in the last select operation
                        cancelled  : 0  // Total number of files that have been cancelled or removed from the queue
                    },
                    uploads    : {
                        current    : 0, // Number of files currently being uploaded
                        attempts   : 0, // Number of file uploads attempted in the last upload operation
                        successful : 0, // Number of files successfully uploaded in the last upload operation
                        errors     : 0, // Number of files returning errors in the last upload operation
                        count      : 0  // Total number of files uploaded successfully
                    }
                });

                var $data=$this.data('uploadifive');
                var settings = $data.settings = $.extend({
                    'auto'            : true,               // 是否自动上传
                    'buttonClass'     : false,              // button自定义样式
                    'buttonText'      : '选择上传文件',     // button上的字体
                    'checkScript'     : false,              // 用以检查服务器上已存在文件的后台脚本的路径。
                    'dnd'             : true,               // 是否允许拖拽上传
                    'dropTarget'      : false,              // TODO 拖动目标  新版去去除
                    'fileObjName'     : 'Filedata',         // TODO The name of the file object to use in your server-side script
                    'fileType'        : false,              // 允许上传的文件类型
                    'formData'        : {},                 // 上传时候,额外需要带上的数据
                    'height'          : 30,                 // button's height
                    'width'           : 100,                // The width of the button
                    'itemTemplate'    : false,              // 回调的时候,返回来的数据直接拼接成html模板 详细见 官方文档
                    'method'          : 'post',             // 上传的方法
                    'multi'           : false,               // 是否允许上传多个文件
                    'simUploadLimit'  : 0,                  // 允许同时上传文件的最大数量
                    'fileSizeLimit'   : 0,                  // 最大上传
                    'queueSizeLimit'  : 0,                  // 多文件上传的时候,队列中最大文件数
                    'uploadLimit'     : 0,                  // 你能上传的最大文件数
                    'overrideEvents'  : [],                 // TODO An array of events to override     新版已去除
                    'queueID'         : false,              // 队列的id
                    'removeCompleted' : false,              // 是否从队列中,删除已经上传完毕的文件.
                    'truncateLength'  : 0,                  // 截断在队列中的名称,太长的话
                    'uploadScript'    : 'uploadifive.php'   // 后台处理上传脚本的路径

                    /*
                    // Events
                    'onAddQueueItem'   : function(file) {},                        // Triggered for each file that is added to the queue
                    'onCancel'         : function(file) {},                        // Triggered when a file is cancelled or removed from the queue
                    'onCheck'          : function(file, exists) {},                // Triggered when the server is checked for an existing file
                    'onClearQueue'     : function(queue) {},                       // Triggered during the clearQueue function
                    'onDestroy'        : function() {}                             // Triggered during the destroy function
                    'onDrop'           : function(files, numberOfFilesDropped) {}, // Triggered when files are dropped into the file queue
                    'onError'          : function(file, fileType, data) {},        // Triggered when an error occurs
                    'onFallback'       : function() {},                            // Triggered if the HTML5 File API is not supported by the browser
                    'onInit'           : function() {},                            // Triggered when UploadiFive if initialized
                    'onQueueComplete'  : function() {},                            // Triggered once when an upload queue is done
                    'onProgress'       : function(file, event) {},                 // Triggered during each progress update of an upload
                    'onSelect'         : function() {},                            // Triggered once when files are selected from a dialog box
                    'onUpload'         : function(file) {},                        // Triggered when an upload queue is started
                    'onUploadComplete' : function(file, data) {},                  // Triggered when a file is successfully uploaded
                    'onUploadFile'     : function(file) {},                        // Triggered for each file being uploaded
                    */
                }, options);

                // 大小限制
                settings.fileSizeLimit=parseInt(settings.fileSizeLimit)*({'K':1024,'M':1048576,'G':1073741824}[$.trim((settings.fileSizeLimit+' ').substr(-1))||'K']);

                //创造一个辅助上传
                $data.inputTemplate = $('<input type="file">').css({
                   'opacity'  : 0,
                   'position' : 'absolute',
                   'z-index'  : 999
                });

                // Create a new input
                $data.createInput = function() {

                    var input  = $data.inputTemplate.clone(),
                        inputName = input.name = 'input' + $data.inputCount++;
                    if (settings.multi) {       // 多选?
                        input.attr('multiple', true);
                    }
                    input.bind('change', function() {
                        var limit = this.files.length,
                            file;

                        $data.queue.selected = 0;
                        $data.queue.replaced = 0;
                        $data.queue.errors   = 0;
                        $data.queue.queued   = 0;
                        $data.queue.selected = limit;

                        if (($data.queue.count + limit) > settings.queueSizeLimit && settings.queueSizeLimit !== 0) {
                            if ($.isFunction(settings.onError)) {
                                settings.onError.call($this, 'QUEUE_LIMIT_EXCEEDED');
                            }else if ($.inArray('onError', settings.overrideEvents) < 0){
                                alert('The maximum number of queue items has been reached (' + settings.queueSizeLimit + ').  Please select fewer files.');
                            }
                        } else {
                            for (var n = 0; n < limit; n++) {
                                file = this.files[n];
                                $data.addQueueItem(file);
                            }
                            $data.inputs[inputName] = this;
                            $data.createInput();
                        }

                        (settings.auto)&&(methods.upload.call($this));

                        // 每向上传队列添加一个文件时触发。onSelect
                        if ($.isFunction(settings.onSelect)) {
                            settings.onSelect.call($this, $data.queue);
                        }
                    });

                    ($data.currentInput.length>0)&&($data.currentInput.hide());  // 隐藏现有的当前项，并添加新的
                    $data.button.append(input);
                    $data.currentInput = input;
                }

                // Remove an input
                $data.destroyInput = function(key) {
                    $($data.inputs[key]).remove();
                    delete $data.inputs[key];
                    $data.inputCount--;
                }

                // Drop a file into the queue
                $data.drop = function(e) {
                    $data.queue.selected = 0;
                    $data.queue.replaced = 0;
                    $data.queue.errors   = 0;
                    $data.queue.queued   = 0;

                    var fileData = e.dataTransfer,
                        file;

                    var inputName = fileData.name = 'input' + $data.inputCount++;
                    // Add a queue item to the queue for each file
                    var limit = fileData.files.length;
                    $data.queue.selected = limit;
                    if (($data.queue.count + limit) > settings.queueSizeLimit && settings.queueSizeLimit !== 0) {
                        if($.isFunction(settings.onError)){
                            settings.onError.call($this, 'QUEUE_LIMIT_EXCEEDED');
                        }else if($.inArray('onError', settings.overrideEvents) < 0){
                            alert('The maximum number of queue items has been reached (' + settings.queueSizeLimit + ').  Please select fewer files.');
                        }
                    } else {
                        for (var n = 0; n < limit; n++) {
                            file = fileData.files[n];
                            $data.addQueueItem(file);
                        }
                        $data.inputs[inputName] = fileData;
                    }

                    (settings.auto)&&(methods.upload.call($this));

                    ($.isFunction(settings.onDrop))&&(settings.onDrop.call($this, fileData.files, fileData.files.length));

                    e.preventDefault();
                    e.stopPropagation();
                }

                // 检查队列是否重复
                $data.fileExistsInQueue = function(file) {
                    var key, input, limit, existingFile;
                    for (key in $data.inputs) {
                        input = $data.inputs[key];
                        limit = input.files.length;
                        for (var n = 0; n < limit; n++) {
                            existingFile = input.files[n];
                            if (existingFile.name == file.name && !existingFile.complete) {
                                return true;
                            }
                        }
                    }
                    return false;
                }

                // 在队列中删除制定文件
                $data.removeExistingFile = function(file) {
                    var key,input,limit,existingFile;
                    for (key in $data.inputs) {
                        input = $data.inputs[key];
                        limit = input.files.length;
                        for (var n = 0; n < limit; n++) {
                            existingFile = input.files[n];
                            if (existingFile.name == file.name && !existingFile.complete) {
                                $data.queue.replaced++;
                                methods.cancel.call($this, existingFile, true);
                            }
                        }
                    }
                }

                // 创建文件项目模板
                if (settings.itemTemplate == false) {
                    $data.queueItem = $('<div class="uploadifive-queue-item"><a class="close" href="#">X</a>\
                        <div><span class="filename"></span><span class="fileinfo"></span></div><div class="progress"><div class="progress-bar"></div> </div></div>');
                } else {
                    $data.queueItem = $(settings.itemTemplate);
                }

                // 队列中添加一项
                $data.addQueueItem = function(file) {
                    if ($.inArray('onAddQueueItem', settings.overrideEvents) < 0) {     // 检查是否存在队列中
                        $data.removeExistingFile(file);
                        file.queueItem = $data.queueItem.clone();
                        // Add an ID to the queue item
                        file.queueItem.attr('id', settings.id + '-file-' + $data.fileID++);
                        // Bind the close event to the close button
                        file.queueItem.find('.close').bind('click', function() {
                           methods.cancel.call($this, file);
                           return false;
                        });
                        var fileName = file.name,
                            maxLen=settings.truncateLength;
                        if(fileName.length > maxLen && maxLen > 0) {
                            fileName = fileName.substring(0, maxLen) + '...';
                        }
                        file.queueItem.find('.filename').html(fileName);
                        file.queueItem.data('file', file);
                        $data.queueEl.append(file.queueItem);
                    }

                    if (typeof settings.onAddQueueItem === 'function') {
                        settings.onAddQueueItem.call($this, file);
                    }

                    // 检查文件格式
                    if (settings.fileType) {
                        if ($.isArray(settings.fileType)) {
                            var isValidFileType = false;
                            for (var n = 0; n < settings.fileType.length; n++) {
                                if (file.type.indexOf(settings.fileType[n]) > -1) {
                                    isValidFileType = true;
                                }
                            }
                            if (!isValidFileType) {
                                $data.error('FORBIDDEN_FILE_TYPE', file);
                            }
                        } else {
                            if (file.type.indexOf(settings.fileType) < 0) {
                                $data.error('FORBIDDEN_FILE_TYPE', file);
                            }
                        }
                    }

                    // 检查文件规定大小
                    if (file.size > settings.fileSizeLimit && settings.fileSizeLimit > 0) {
                        $data.error('FILE_SIZE_LIMIT_EXCEEDED', file);
                    } else {
                        $data.queue.queued++;
                        $data.queue.count++;
                    }
                }

                // Remove an item from the queue
                $data.removeQueueItem = function(file, instant, delay) {
                    delay=delay||0;
                    var fadeTime = instant ? 0 : 500;
                    if (file.queueItem) {
                        file.queueItem.find('.fileinfo').html(' - Cancelled');
                        file.queueItem.find('.progress-bar').width(0);
                        file.queueItem.delay(delay).fadeOut(fadeTime, function() {
                           $(this).remove();
                        });
                        delete file.queueItem;
                        $data.queue.count--;
                    }
                }

                // 计算需要上传的文件数量
                $data.filesToUpload = function() {
                    var filesToUpload = 0,input,limit,file,key;
                    for (key in $data.inputs) {
                        input = $data.inputs[key];
                        limit = input.files.length;
                        for (var n = 0; n < limit; n++) {
                            file = input.files[n];
                            if (!file.skip && !file.complete) {
                                filesToUpload++;
                            }
                        }
                    }
                    return filesToUpload;
                }

                // 服务器检查上传文件是否存在
                $data.checkExists = function(file) {
                    if ($.inArray('onCheck', settings.overrideEvents) < 0) {
                        $.ajaxSetup({
                            'async' : false
                        });
                        var checkData = $.extend(settings.formData, {filename: file.name}),
                            isIn=false;
                        $.post(settings.checkScript, checkData, function(fileExists) {
                            file.exists = parseInt(fileExists);
                            if (file.exists) {
                                if (!confirm('服务器上已存在名为:[' + file.name + '] 请问是否重复取消上传?')) {
                                    // If not replacing the file, cancel the upload
                                    methods.cancel.call($this, file);
                                    isIn=true;
                                }
                            }
                        });
                    }

                    if (typeof settings.onCheck === 'function') {
                        settings.onCheck.call($this, file, file.exists);
                    }
                    $.ajaxSetup({ 'async' : true });        // TODO 这里是否有必要?
                    return isIn;
                }

                // 上传单个文件
                $data.uploadFile = function(file, uploadAll) {
                    if (!file.skip && !file.complete && !file.uploading) {
                        var xhr = file.xhr = new XMLHttpRequest();
                        file.uploading = true;
                        $data.uploads.current++;

                        if ('FormData' in window) {
                            var formData = new FormData();
                            formData.append(settings.fileObjName, file);
                            for (i in settings.formData) {
                                formData.append(i, settings.formData[i]);
                            }
                            xhr.open(settings.method, settings.uploadScript, true);
                            xhr.upload.addEventListener('progress', function(e) {
                                if (e.lengthComputable) {
                                    $data.progress(e, file);
                                }
                            }, false);
                            xhr.addEventListener('load', function(e) {
                                if (this.readyState == 4) {
                                    file.uploading = false;
                                    if (this.status == 200) {
                                        if (file.xhr.responseText !== 'Invalid file type.') {
                                            $data.uploadComplete(e, file, uploadAll);
                                        } else {
                                            $data.error(file.xhr.responseText, file, uploadAll);
                                        }
                                    } else if (this.status == 404) {
                                        $data.error('404_FILE_NOT_FOUND', file, uploadAll);
                                    } else if (this.status == 403) {
                                        $data.error('403_FORBIDDEN', file, uplaodAll);
                                    } else {
                                        $data.error('Unknown Error', file, uploadAll);
                                    }
                                }
                            });
                            xhr.send(formData);

                        } else if('FileReader' in window) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                // 设置一些文件生成器变量
                                var boundary = '-------------------------' + (new Date).getTime(),
                                    dashes   = '--',
                                    eol      = '\r\n',
                                    binFile  = '',
                                    key;

                                // Build an RFC2388 String 
                                binFile += dashes + boundary + eol;
                                // 生成文件头
                                binFile += 'Content-Disposition: form-data; name="' + settings.fileObjName + '"';
                                if (file.name) {
                                    binFile += '; filename="' + file.name + '"';
                                }
                                binFile += eol;
                                binFile += 'Content-Type: application/octet-stream' + eol + eol;
                                binFile += e.target.result + eol;

                                for (key in settings.formData) {
                                    binFile += dashes + boundary + eol;
                                    binFile += 'Content-Disposition: form-data; name="' + key + '"' + eol + eol;
                                    binFile += settings.formData[key] + eol;
                                }

                                binFile += dashes + boundary + dashes + eol;

                                xhr.upload.addEventListener('progress', function(e) {
                                    $data.progress(e, file);
                                }, false);

                                xhr.addEventListener('load', function(e) {
                                    file.uploading = false;
                                    var status = this.status;
                                    if (status == 404) {
                                        $data.error('404_FILE_NOT_FOUND', file, uploadAll);
                                    } else {
                                        if (file.xhr.responseText != 'Invalid file type.') {    
                                            $data.uploadComplete(e, file, uploadAll);
                                        } else {
                                            $data.error(file.xhr.responseText, file, uploadAll);
                                        } 
                                    }
                                }, false);

                                var url = settings.uploadScript;
                                if (settings.method == 'get') {
                                    var params = $(settings.formData).param();
                                    url += params;
                                }
                                xhr.open(settings.method, settings.uploadScript, true);
                                xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);


                                // Send the file for upload
                                xhr.sendAsBinary(binFile);
                            }
                            reader.readAsBinaryString(file);

                        }else{
                            throw " 你的浏览器不支持也 请换flash版本吧"
                        }
                        if (typeof settings.onUploadFile === 'function') {
                            settings.onUploadFile.call($this, file);
                        }
                    }
                }

                // 创建滚动条
                $data.progress = function(e, file) {
                    if ($.inArray('onProgress', settings.overrideEvents) < 0) {
                        if (e.lengthComputable) {
                            var percent = Math.round((e.loaded / e.total) * 100);
                        }
                        file.queueItem.find('.fileinfo').html(' - ' + percent + '%');
                        file.queueItem.find('.progress-bar').css('width', percent + '%');
                    }
                    // Trigger the progress event
                    if (typeof settings.onProgress === 'function') {
                        settings.onProgress.call($this, file, e);
                    }
                }

                // 出发一个错误
                $data.error = function(errorType, file, uploadAll) {
                    if ($.inArray('onError', settings.overrideEvents) < 0) {
                        var errorMsg={
                            '404_FILE_NOT_FOUND':'404 ERROR',
                            '403_FORBIDDEN':'403 Forbidden',
                            'FORBIDDEN_FILE_TYPE':'文件类型错误',
                            'FILE_SIZE_LIMIT_EXCEEDED':'伙计换个小点的'
                        }[errorType]||'未知错误';

                        file.queueItem.addClass('error').find('.fileinfo').html(' - ' + errorMsg).end().find('.progress').remove();
                    }
                    if (typeof settings.onError === 'function') {
                        settings.onError.call($this, errorType, file);
                    }
                    file.skip = true;
                    if (errorType == '404_FILE_NOT_FOUND') {
                        $data.uploads.errors++;
                    } else {
                        $data.queue.errors++;
                    }
                    if (uploadAll) {
                        methods.upload.call($this, null, true);
                    }
                }

                // 一个文件上传完毕
                $data.uploadComplete = function(e, file, uploadAll) {
                    if ($.inArray('onUploadComplete', settings.overrideEvents) < 0) {
                        file.queueItem.addClass('complete').find('.progress-bar').css('width', '100%').end().find('.fileinfo').html(' - Completed').end().find('.progress').slideUp(250);
                    }
                    if (typeof settings.onUploadComplete === 'function') {
                        settings.onUploadComplete.call($this, file, file.xhr.responseText);
                    }
                    if (settings.removeCompleted) {
                       window.setTimeout(function() { methods.cancel.call($this, file); }, 3000);
                    }
                    file.complete = true;
                    $data.uploads.successful++;
                    $data.uploads.count++;
                    $data.uploads.current--;
                    delete file.xhr;
                    if (uploadAll) {
                        methods.upload.call($this, null, true);
                    }
                }

                // 所有文件正在上传的时候,触发
                $data.queueComplete = function() {
                    // Trigger the queueComplete event
                    if (typeof settings.onQueueComplete === 'function') {
                        settings.onQueueComplete.call($this, $data.uploads);
                    }
                }

                if (window.File && window.FileList && window.Blob && (window.FileReader || window.FormData)) {

                    settings.id = 'uploadifive-' + $this.attr('id');

                    $data.button = $('<div id="' + settings.id + '" class="uploadifive-button">' + settings.buttonText + '</div>');
                    if (settings.buttonClass){ $data.button.addClass(settings.buttonClass);};
                    $data.button.css({
                        'height'      : settings.height,
                        'line-height' : settings.height + 'px', 
                        'overflow'    : 'hidden',
                        'position'    : 'relative',
                        'text-align'  : 'center', 
                        'width'       : settings.width
                    });

                    $this.before($data.button).appendTo($data.button).hide();

                    $data.createInput.call($this);

                    // 定位光标下的“浏览文件”按钮
                    $data.button.mousemove(function(e) {
                        var offset = $data.button.offset();
                        $data.currentInput.css({
                           'left' : e.pageX - offset.left - $this.width() + 10,
                           'top'  : e.pageY - offset.top - $this.height() + 10
                        });
                    });

                    // 创建队列容器
                    if (!settings.queueID) {
                        settings.queueID = settings.id + '-queue';
                        $data.queueEl = $('<div id="' + settings.queueID + '" class="uploadifive-queue" />');
                        $data.button.after($data.queueEl);
                    } else {
                        $data.queueEl = $('#' + settings.queueID);
                    }

                    // 创建拖拽容器
                    if (settings.dnd) {
                        var $dropTarget = settings.dropTarget ? $(settings.dropTarget) : $data.queueEl.get(0);
                        $dropTarget.addEventListener('dragleave', function(e) {
                            // Stop FireFox from opening the dropped file(s)
                            e.preventDefault();
                            e.stopPropagation();
                        }, false);
                        $dropTarget.addEventListener('dragenter', function(e) {
                            // Stop FireFox from opening the dropped file(s)
                            e.preventDefault();
                            e.stopPropagation();
                        }, false);
                        $dropTarget.addEventListener('dragover', function(e) {
                            // Stop FireFox from opening the dropped file(s)
                            e.preventDefault();
                            e.stopPropagation();
                        }, false);
                        $dropTarget.addEventListener('drop', $data.drop, false);
                    }

                    // 针对Chrome发送2进制文件  http://fred.easymorse.com/?p=1030
                    if (!('sendAsBinary' in XMLHttpRequest.prototype)) {
                        XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
                            function byteValue(x) {
                                return x.charCodeAt(0) & 0xff;
                            }
                            var ords = Array.prototype.map.call(datastr, byteValue);
                            var ui8a = new Uint8Array(ords);
                            this.send(ui8a.buffer);
                        }
                    }

                    // 触发初始化函数
                    if (typeof settings.onInit === 'function') {
                        settings.onInit.call($this);
                    }

                } else {
                    // 出发失败函数  不支持
                    if (typeof settings.onFallback === 'function') {
                        settings.onFallback.call($this);
                    }
                    return false;

                }

            });

        },

        debug : function() {
            return this.each(function() {
                console.log($(this).data('uploadifive'));
            });
        },

        // 清空所有上传队列
        clearQueue : function() {

            this.each(function() {

                var $this    = $(this),
                    $data    = $this.data('uploadifive'),
                    settings = $data.settings, input, limit, file;

                for (var key in $data.inputs) {
                    input = $data.inputs[key];
                    limit = input.files.length;
                    for (i = 0; i < limit; i++) {
                        file = input.files[i];
                        methods.cancel.call($this, file);
                    }
                }
                // Trigger the onClearQueue event
                if (typeof settings.onClearQueue === 'function') {
                    settings.onClearQueue.call($this, $('#' + $data.options.queueID));
                }

            });

        },

        // 取消一个上传事件
        cancel : function(file, fast) {

            this.each(function() {

                var $this    = $(this),
                    $data    = $this.data('uploadifive'),
                    settings = $data.settings,
                    fileID;

                // If user passed a queue item ID instead of file...
                if (typeof file === 'string') {
                    if (!isNaN(file)) {
                        fileID = 'uploadifive-' + $(this).attr('id') + '-file-' + file;
                    }
                    file = $('#' + fileID).data('file');
                }

                file.skip = true;
                $data.filesCancelled++;
                if (file.uploading) {
                    $data.uploads.current--;
                    file.uploading = false;
                    file.xhr.abort();
                    delete file.xhr;
                    methods.upload.call($this);
                }
                if ($.inArray('onCancel', settings.overrideEvents) < 0) {
                    $data.removeQueueItem(file, fast);
                }

                // Trigger the cancel event
                if (typeof settings.onCancel === 'function') {
                    settings.onCancel.call($this, file);
                }
            });
        },

        //开始上传队列中的文件
        upload : function(file, keepVars) {

            this.each(function() {

                var $this    = $(this),
                    $data    = $this.data('uploadifive'),
                    settings = $data.settings,_file,skipFile;

                if (file) {
                    $data.uploadFile.call($this, file);
                } else {
                    // Check if the upload limit was reached
                    if (($data.uploads.count + $data.uploads.current) < settings.uploadLimit || settings.uploadLimit == 0) {
                        if (!keepVars) {
                            $data.uploads.attempted   = 0;
                            $data.uploads.successsful = 0;
                            $data.uploads.errors      = 0;
                            var filesToUpload = $data.filesToUpload();
                            // Trigger the onUpload event
                            if (typeof settings.onUpload === 'function') {
                                settings.onUpload.call($this, filesToUpload);
                            }
                        }

                        // Loop through the files
                        $('#' + settings.queueID).find('.uploadifive-queue-item').not('.error, .complete').each(function() {
                            _file = $(this).data('file');
                            // Check if the simUpload limit was reached
                            if (($data.uploads.current >= settings.simUploadLimit && settings.simUploadLimit !== 0) || ($data.uploads.current >= settings.uploadLimit && settings.uploadLimit !== 0) || ($data.uploads.count >= settings.uploadLimit && settings.uploadLimit !== 0)) {
                                return false;
                            }
                            if (settings.checkScript) {
                                // Let the loop know that we're already processing this file
                                _file.checking = true;
                                skipFile = $data.checkExists(_file);
                                _file.checking = false;
                                if (!skipFile) {
                                    $data.uploadFile(_file, true);
                                }
                            } else {
                                $data.uploadFile(_file, true);
                            }
                        });
                        if ($('#' + settings.queueID).find('.uploadifive-queue-item').not('.error, .complete').size() == 0) {
                            $data.queueComplete();
                        }
                    } else {
                        if ($data.uploads.current == 0) {
                            if ($.inArray('onError', settings.overrideEvents) < 0) {
                                if ($data.filesToUpload() > 0 && settings.uploadLimit != 0) {
                                    alert('The maximum upload limit has been reached.');
                                }
                            }
                            // Trigger the onError event
                            if (typeof settings.onError === 'function') {
                                settings.onError.call($this, 'UPLOAD_LIMIT_EXCEEDED', $data.filesToUpload());
                            }
                        }
                    }

                }

            });

        },

        // Destroy an instance of UploadiFive
        destroy : function() {

            this.each(function() {

                var $this    = $(this),
                    $data    = $this.data('uploadifive'),
                    settings = $data.settings;
                methods.clearQueue.call($this);
                if (!settings.queueID) $('#' + settings.queueID).remove();
                $this.siblings('input').remove();
                $this.show()
                .insertBefore($data.button);
                $data.button.remove();
                // Trigger the destroy event
                if (typeof settings.onDestroy === 'function') {
                    settings.onDestroy.call($this);
                }

            });

        }

    }

    $.fn.uploadifive = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('The method ' + method + ' does not exist in $.uploadify');
        }

    }

})(jQuery);
