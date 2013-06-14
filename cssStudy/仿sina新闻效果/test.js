$(function(){
    /**/
    $(".beforeafter").each(function(){

		/*
			项目不直接使用图片的宽和高来进行控制的原因  图片的样式不容易控制
		*/
        // 将div的宽、高设置成图片的宽高
        $(this).width($(this).find("img[rel=before]").attr("width"))
               .height($(this).find("img[rel=before]").attr("height"));

        // Convert the images into background images on layered divs
        $(this).append("<div class='after'></div>").find(".after").css({"background": "url(" + $(this).find("img[rel=after]").attr("src") + ")", "width": $(this).find("img[rel=after]").attr("width") + "px", "height": $(this).find("img[rel=after]").attr("height") + "px"});
        $(this).append("<div class='before'></div>").find(".before").css({"background": "url(" + $(this).find("img[rel=before]").attr("src") + ")", "width": $(this).find("img[rel=before]").attr("width") - 40 + "px", "height": $(this).find("img[rel=before]").attr("height") + "px"});

        // Add a helpful message
        $(this).append("<div class='help'>悬停切换图像</div>");

        // Remove the original images
        $(this).find("img").remove();

        // Event handler for the mouse moving over the image
        $(this).mousemove(function(event){

            var offset = $(this).offset().left;

            if ((event.clientX - offset) < ($(this).find(".after").width() -50) && (event.clientX - offset) > 50) {

                $(this).find(".before").width(event.clientX - offset);

            }

        });

            $(this).hover(function(){
                $(this).find(".help").animate({"opacity": 0}, 400, function(){ $(this).remove();  });
                $(this).unbind('hover')
            });
    });

});
