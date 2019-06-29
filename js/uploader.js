// 初始化Web Uploader
function upload(box,name,num,type,inputName,inputIndex){
    
	var accept = {};
	if(type) {
        
    	accept = {  
            title: 'Files',  
            extensions: 'pdf,doc,docx',
            mimeTypes: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'  
                       +',application/pdf'  
        }
        if(type=='pj'){
            accept = {
                title: 'Images,Applications',
                extensions: 'jpg,jpeg,pdf',
                mimeTypes: 'image/jpg,image/jpeg,application/pdf'
            }
        }
    } else {
    	accept = {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif'
        }
    };
    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,
        swf:'/pc/libs/webuploader/Uploader.swf',
        // 文件接收服务端。
        server: "http://jk.szhan.com/up/hzcupload.php",
        fileNumLimit:num!=1?num:50,
        // fileSizeLimit:60000,
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick:{
            id:$('.filePicker_'+box),
            multiple : num==1?false:true 
        }, 
        // 只允许选择图片文件。
        formData:{'filetype': name},
        accept:accept,
        fileSingleSizeLimit: 8 * 1024 * 1024
    });
    function removeFile(file) {
        uploader.removeFile(file);
    }
    //上传成功后
    uploader.onUploadSuccess = function(file,response){
        var imgBoxClass = '.' +name; 
        $list= $('.'+file['id']);
        var count = $( '.' +inputName).length;
        if(inputIndex) {
            count = inputIndex;
        }
        if(num > 1) {
            $("<input type='hidden' class='"+inputName+"' name='"+inputName+"["+count+"]' >").appendTo($list);
        } else {
            $("<input type='hidden' class='"+inputName+"' name='"+inputName+"' >").appendTo($list);
        }
        if(response.status=='success') {
        	$list.children('input').val(response.data['file_url']);
        } else {
        	alert(response.msg)
        }
    }
    //超出数量或者大小
    uploader.onError = function(file){
        if(file=='Q_TYPE_DENIED'){
            alert('图片格式不正确！');
        }
        if(file == 'F_EXCEED_SIZE'){
            alert('图片大小超出限制！');
        }
        if(num != 1){
            var number = uploader.getStats()['successNum'];
            if(isNaN(num) === false && number>=num){
                alert('最多上传'+num+'张图片');
            }  
        } 
    }
    //当有文件添加进来的时候
    uploader.on( 'fileQueued', function(file) {
        var $li = $(
            '<span class="file-item '+file['id']+'">' +
                '<img src="" alt="" />' +
                '<div class="text-center fileName">' + file['name'] + '</div>' +
                '<div class="del"><i class="iconfont iconshanchu"></i></div>' +
            '</span>'
            ),
        $img = $li.find('img');
        $list= $('.fileList_'+box);
        var delwrap = $li.find(".del")
		$li.on("mouseenter", function() {
			delwrap.stop().animate({
				height: 25
			})
		})
		$li.on("mouseleave", function() {
			delwrap.stop().animate({
				height: 0
			})
		})
		var delbtn = delwrap.find("i")
		delbtn.on("click", function() {
			$(this).parent().parent().remove();
			uploader.removeFile(file);
		})

        if(num == 1){
            $list.children('span').remove();
            $list.html('');
        }
        // $list为容器jQuery实例
        $list.append($li);
        // 创建缩略图.
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        if(box<15||box>22){
            var thumbnailWidth = 200;
            var thumbnailHeight = 200;
        }else{
            var thumbnailWidth = 160;
            var thumbnailHeight = 112;
        }
        uploader.makeThumb(file,function(error,src) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr( 'src', src );
        },thumbnailWidth, thumbnailHeight );
        // $btns.on( 'click', 'span', function() {
        //         $(this).parents('.file-item').remove();
        //         removeFile(file,true);
        // })
        //文件上传过程中创建进度条实时显示
		uploader.on("uploadProgress", function(file, percentage) {
			var $li = $("." + file.id);
			var $percent = $li.find(".progress .progress-bar");
			//避免重复创建
			if (!$percent.length) {
				$percent = $('<div class="progress">' +
					'<div class="progress-bar">' +
					'</div>' +
					'</div>').appendTo($li).find(".progress .progress-bar");
			}
			// $li.find('span.state').text('上传中...')
			$percent.css('width', percentage * 100 + '%')
			$percent.text(percentage * 100 + '%')
		});
		uploader.on("uploadSuccess", function(file, response) {
			$('.' + file.id).append('<span class="uploaderSuccess"></span>');
		})
		uploader.on("uploadComplete", function(file) {
			$('.' + file.id).find('.progress').fadeOut();
		})
    });
    //删除图片
    $('.cancel').click(function(){
         $(this).parents('.file-item').remove();     
    })
    $('.file-item').on("mouseenter", function() {
        $('.cancel').stop().animate({
            height: 25
        })
    })
    $('.file-item').on("mouseleave", function() {
        $('.cancel').stop().animate({
            height: 0
        })
    })
    $('.del').click(function(){
         $(this).parents('.file-item').remove();     
    })
    $('body').on('click','.file-item img',function(){
        layer.photos({
            photos: '.file-item'
            ,anim: 5,
            closeBtn:1  
        });
    })
}

