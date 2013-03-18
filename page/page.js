//http://www.cnblogs.com/doug/archive/2012/06/23/2559568.html
function update_page(total_page/*总页数*/,current_page/*当前页*/,href/*链接前缀*/,father/*容器id*/){
    var total_page = parseInt( total_page),
        current_page = parseInt( current_page),
        pager_length = 11,    //不包next 和 prev 必须为奇数
        header_length = 2,
        tailer_length = 2,
        main_length = pager_length - header_length - tailer_length, //必须为奇数i,
        code = '';

    href=href||'/';
    if( total_page < current_page ){
        alert('总页数不能小于当前页数');
        return false;
    }
    //判断总页数是不是小于 分页的长度，若小于则直接显示
    if( total_page < pager_length ){
        for(i = 0; i <     total_page; i++){
            code += (i+1 != current_page) ? '<a href="'+ href+(i+1) +'">'+(i+1)+'</a>' : '<span class="current">'+(i+1)+'</span>';
        }
    }
    //如果总页数大于分页长度，则为一下函数
    else{
        //先计算中心偏移量
        var offset = ( pager_length - 1) / 2;
        //分三种情况，第一种左边没有...
        if( current_page <= offset + 1){
            var tailer = '';
            //前header_length + main_length 个直接输出之后加一个...然后输出倒数的    tailer_length 个
            for( i = 0; i < header_length + main_length; i ++){
                code += (i+1 != current_page) ? '<a href="'+ href+(i+1) +'">'+(i+1)+'</a>' : '<span class="current">'+(i+1)+'</span>';
            }
            code += '...';
            for(i = total_page; i > total_page - tailer_length; i --){
                tailer = '<a href="'+ href+(i+1) +'">'+(i+1)+'</a>' + tailer;
            }
            code += tailer;
        }
        //第二种情况是右边没有...
        else if( current_page >= total_page - offset ){
            var header = '';
            //后tailer_length + main_length 个直接输出之前加一个...然后拼接 最前面的 header_length 个
            for( i = total_page; i >= total_page-main_length - 1; i --){
                code = (( current_page != i ) ? '<a href="'+ href+i +'">'+i+'</a>' : '<span class="current">'+i+'</span>') + code;
            }
            code = '...' + code;
            for( i = 0; i < header_length ; i++){
                header +=  '<a href="'+ href+(i+1) +'">'+(i+1)+'</a>';
            }
            code = header + code;
        }
        //最后一种情况，两边都有...
        else
        {
            var header = '',
                tailer = '';
            //首先处理头部
            for( i = 0; i < header_length; i ++){
                header += '<a href="'+ href+(i+1) +'">'+(i+1)+'</a>';
            }
            header += '...';

            //处理尾巴
            for(i = total_page; i > total_page - tailer_length; i --)
                tailer = '<a href="'+ href+ i +'">'+i+'</a>' + tailer;
            tailer = '...' + tailer;

            //处理中间
            //计算main的中心点
            var offset_m = ( main_length - 1 ) / 2,
                partA = '',
                partB = '',
                j,
                counter = (parseInt(current_page) + parseInt(offset_m));
            for(i = j = current_page ; i <= counter; i ++, j --)
            {
                partA = (( i == j ) ? '' : '<a href="'+ href+ j +'">'+j+'</a>') + partA;
                partB += ( i == j ) ? '<span class="current">'+i+'</span>' :'<a href="'+ href+ i +'">'+i+'</a>';
            }
            //拼接
            code = header + partA + partB + tailer;
        }
    }

    //拼装 上 下页
    var prev = ( current_page == 1 ) ? '<span class="disabled">&lt;</span>' : '<a href="'+ href+(current_page-1) +'">&lt;</a>',
        next = ( current_page == total_page ) ? '<span class="disabled">&gt;</span>' : '<a href="'+ href+(current_page+1) +'">&gt;</a>';

    code = prev + code + next;
    document.getElementById(father).innerHTML=(code);
}