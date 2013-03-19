
 parse:

    ``` javascript
    /*---- jQuery version -----*/
    var url = $.url(); // parse the current page URL
    var url = $.url('http://allmarkedup.com'); // pass in a URI as a string and parse that
    var url = $('#myElement').url(); // extract the URL from the selected element and parse that - will work on any element with a `src`, `href` or `action` attribute.

    /*---- plain JS version -----*/
    var url = purl(); // parse the current page URL
    var url = purl('http://allmarkedup.com'); // pass in a URI as a string and parse that
```

URL attributes  Attr():

    ``` javascript
        var url = $.url('http://allmarkedup.com/folder/dir/index.html?item=value'); // jQuery version
        var url = purl('http://allmarkedup.com/folder/dir/index.html?item=value'); // plain JS version
        url.attr('protocol'); // returns 'http'
        url.attr('path'); // returns '/folder/dir/index.html'
    ```

    The attributes available for querying are:

    * **source** - 整个URL
    * **protocol** - 协议: http, https, file, etc
    * **host** -  域名: www.mydomain.com, localhost etc
    * **port** -  端口号:80
    * **relative** - 相对路径  /folder/dir/index.html?item=value
    * **path** - 文件路径 (eg. /folder/dir/index.html)
    * **directory** - 目录路径的 (eg. /folder/dir/)
    * **file** - 文件名称 eg. index.html
    * **query** - 查询部分 eg. item=value&item2=value2
    * **fragment** 锚点链接 eg: # symbol


Query string parameters  .param()


    ``` javascript
        /*---- jQuery version -----*/
        $.url('http://allmarkedup.com?sky=blue&grass=green').param('sky'); // returns 'blue'

        /*---- plain JS version -----*/
        purl('http://allmarkedup.com?sky=blue&grass=green').param('sky'); // returns 'blue'
    ```

    ``` javascript
        /*---- jQuery version -----*/
        $.url('http://allmarkedup.com?sky=blue&grass=green').param(); // returns { 'sky':'blue', 'grass':'green' }

        /*---- plain JS version -----*/
        purl('http://allmarkedup.com?sky=blue&grass=green').param(); // returns { 'sky':'blue', 'grass':'green' }
    ```

URL segments
    ``` javascript
        var url = $.url('http://allmarkedup.com/folder/dir/example/index.html'); // jQuery version
        var url = purl('http://allmarkedup.com/folder/dir/example/index.html'); // plain JS version
        url.segment(1); // returns 'folder'
        url.segment(-2); // returns 'example'
    ```

    ``` javascript
        $.url('http://allmarkedup.com/folder/dir/example/index.html').segment(); // jQuery version - returns ['folder','dir','example','index.html']
        purl('http://allmarkedup.com/folder/dir/example/index.html').segment(); // plain JS version - returns ['folder','dir','example','index.html']
    ```

Fragment parameters and/or segments

    ``` javascript
        /*---- jQuery version -----*/
        $.url('http://test.com/#sky=blue&grass=green').fparam('grass'); // returns 'green'
        $.url('http://test.com/#/about/us/').fsegment(1); // returns 'about'

        /*---- plain JS version -----*/
        purl('http://test.com/#sky=blue&grass=green').fparam('grass'); // returns 'green'
        purl('http://test.com/#/about/us/').fsegment(1); // returns 'about'
    ```


Strict mode and relative URLs
    ``` javascript
    /*---- jQuery version -----*/
        var url = $.url(true); // parse the current page URL in strict mode
        var url = $.url('http://allmarkedup.com',true); // pass in a URI as a string and parse that in strict mode
        var url = $('#myElement').url(true); // extract the URL from the selected element and parse that in strict mode

        /*---- plain JS version -----*/
        var url = purl(true); // parse the current page URL in strict mode
        var url = purl('http://allmarkedup.com',true); // pass in a URI as a string and parse that in strict mode
    ```





