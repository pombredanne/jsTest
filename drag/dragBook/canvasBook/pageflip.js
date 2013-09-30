

(function() {

    // 整本书的尺寸
    var BOOK_WIDTH = 830,
        BOOK_HEIGHT = 260;

    // 这本书单页面的尺寸
    var PAGE_WIDTH = 400,
        PAGE_HEIGHT = 250;

    var PAGE_Y = ( BOOK_HEIGHT - PAGE_HEIGHT ) / 2;         // 书和论文的顶边之间的垂直间距

    var CANVAS_PADDING = 60;        // 画布的尺寸=书的尺寸+padding的尺寸

    var page = 0;   //页码

    var canvas = document.getElementById( "pageflip-canvas" ),
        context = canvas.getContext( "2d" ),
        book = document.getElementById( "book" ),
        pages = book.getElementsByTagName( "section" );

    var mouse = { x: 0, y: 0 };

    var flips = [];

    // 让每个页面都有自己的flip对象了
    for( var i = 0, len = pages.length; i < len; i++ ) {
        pages[i].style.zIndex = len - i;
        //flip对象最重要的属性是progress和target值。它们用来定义翻动页面折叠的大小，-1表示整页翻到左边，0表示翻到书的中间位置，+1表示整页翻到书的最右边。
        flips.push( {
            progress: 1,
            target: 1,
            page: pages[i],
            dragging: false
        } );
    }

    canvas.width = BOOK_WIDTH + ( CANVAS_PADDING * 2 );
    canvas.height = BOOK_HEIGHT + ( CANVAS_PADDING * 2 );

    // 让canvas布满 整本书
    canvas.style.top = -CANVAS_PADDING + "px";
    canvas.style.left = -CANVAS_PADDING + "px";

    // Render the page flip 60 times a second
    setInterval( render, 1000 / 60 );

    document.addEventListener( "mousedown", mouseDownHandler, false );
    document.addEventListener( "mousemove", mouseMoveHandler, false );
    document.addEventListener( "mouseup", mouseUpHandler, false );

    function mouseMoveHandler( event ) {
        // 得出偏移鼠标的位置 书中间爱你是0,0 (不会有翻书动作)
        mouse.x = event.clientX - book.offsetLeft - ( BOOK_WIDTH / 2 );
        mouse.y = event.clientY - book.offsetTop;
    }

    function mouseDownHandler( event ) {
        if (Math.abs(mouse.x) < PAGE_WIDTH) {
            if (mouse.x < 0 && page - 1 >= 0) {
                flips[page - 1].dragging = true;
            }else if (mouse.x > 0 && page + 1 < flips.length) {
                flips[page].dragging = true;
            }
        }
        event.preventDefault();
    }

    function mouseUpHandler( event ) {
        for( var i = 0; i < flips.length; i++ ) {
            // If this flip was being dragged, animate to its destination
            if( flips[i].dragging ) {
                // Figure out which page we should navigate to
                if( mouse.x < 0 ) {
                    flips[i].target = -1;
                    page = Math.min( page + 1, flips.length );
                }else {
                    flips[i].target = 1;
                    page = Math.max( page - 1, 0 );
                }
            }

            flips[i].dragging = false;
        }
    }

    function render() {

        context.clearRect( 0, 0, canvas.width, canvas.height );  //删除并重置画布

        for( var i = 0, len = flips.length; i < len; i++ ) {
            var flip = flips[i];

            //  关于canvas的 drag方法  http://rectangleworld.com/blog/archives/129
            if( flip.dragging ) {
                flip.target = Math.max( Math.min( mouse.x / PAGE_WIDTH, 1 ), -1 );
            }

            // Ease progress towards the target value
            flip.progress += ( flip.target - flip.progress ) * 0.2;

            // If the flip is being dragged or is somewhere in the middle of the book, render it
            if( flip.dragging || Math.abs( flip.progress ) < 0.997 ) {
                drawFlip( flip );
            }

        }

    }

    function drawFlip( flip ) {

        /*
            http://www.html5canvastutorials.com/kineticjs/html5-canvas-drag-and-drop-tutorial/
            http://rectangleworld.com/blog/archives/129
            http://html5.litten.com/how-to-drag-and-drop-on-an-html5-canvas/
            http://www.20thingsilearned.com/zh-CN/html/1
            http://www.html-5.cn/html5/jishu/573.html
        */
        var strength = 1 - Math.abs( flip.progress ),       // 翻书参照是 书的中间部分
            foldWidth = ( PAGE_WIDTH * 0.5 ) * ( 1 - flip.progress ),       //折叠的纸张的宽度
            foldX = PAGE_WIDTH * flip.progress + foldWidth; // 折叠的纸张的X位置

        // How far the page should outdent vertically due to perspective
        var verticalOutdent = 20 * strength;

        // The maximum width of the left and right side shadows
        var paperShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( 1 - flip.progress, 0.5 ), 0 );
        var rightShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( strength, 0.5 ), 0 );
        var leftShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( strength, 0.5 ), 0 );


        // Change page element width to match the x position of the fold
        flip.page.style.width = Math.max(foldX, 0) + "px";

        context.save();
        context.translate( CANVAS_PADDING + ( BOOK_WIDTH / 2 ), PAGE_Y + CANVAS_PADDING );


        // Draw a sharp shadow on the left side of the page
        context.strokeStyle = 'rgba(0,0,0,'+(0.05 * strength)+')';
        context.lineWidth = 30 * strength;
        context.beginPath();
        context.moveTo(foldX - foldWidth, -verticalOutdent * 0.5);
        context.lineTo(foldX - foldWidth, PAGE_HEIGHT + (verticalOutdent * 0.5));
        context.stroke();


        // Right side drop shadow
        var rightShadowGradient = context.createLinearGradient(foldX, 0, foldX + rightShadowWidth, 0);
        rightShadowGradient.addColorStop(0, 'rgba(0,0,0,'+(strength*0.2)+')');
        rightShadowGradient.addColorStop(0.8, 'rgba(0,0,0,0.0)');

        context.fillStyle = rightShadowGradient;
        context.beginPath();
        context.moveTo(foldX, 0);
        context.lineTo(foldX + rightShadowWidth, 0);
        context.lineTo(foldX + rightShadowWidth, PAGE_HEIGHT);
        context.lineTo(foldX, PAGE_HEIGHT);
        context.fill();


        // Left side drop shadow
        var leftShadowGradient = context.createLinearGradient(foldX - foldWidth - leftShadowWidth, 0, foldX - foldWidth, 0);
        leftShadowGradient.addColorStop(0, 'rgba(0,0,0,0.0)');
        leftShadowGradient.addColorStop(1, 'rgba(0,0,0,'+(strength*0.15)+')');

        context.fillStyle = leftShadowGradient;
        context.beginPath();
        context.moveTo(foldX - foldWidth - leftShadowWidth, 0);
        context.lineTo(foldX - foldWidth, 0);
        context.lineTo(foldX - foldWidth, PAGE_HEIGHT);
        context.lineTo(foldX - foldWidth - leftShadowWidth, PAGE_HEIGHT);
        context.fill();


        // Gradient applied to the folded paper (highlights & shadows)
        var foldGradient = context.createLinearGradient(foldX - paperShadowWidth, 0, foldX, 0);
        foldGradient.addColorStop(0.35, '#fafafa');
        foldGradient.addColorStop(0.73, '#eeeeee');
        foldGradient.addColorStop(0.9, '#fafafa');
        foldGradient.addColorStop(1.0, '#e2e2e2');

        context.fillStyle = foldGradient;
        context.strokeStyle = 'rgba(0,0,0,0.06)';
        context.lineWidth = 0.5;

        // Draw the folded piece of paper
        context.beginPath();
        context.moveTo(foldX, 0);
        context.lineTo(foldX, PAGE_HEIGHT);
        context.quadraticCurveTo(foldX, PAGE_HEIGHT + (verticalOutdent * 2), foldX - foldWidth, PAGE_HEIGHT + verticalOutdent);
        context.lineTo(foldX - foldWidth, -verticalOutdent);
        context.quadraticCurveTo(foldX, -verticalOutdent * 2, foldX, 0);

        context.fill();
        context.stroke();


        context.restore();
    }

})();


