$(function () {

    var files = [];

    /**
     * dataURL to blob, ref to https://gist.github.com/fupslot/5015897
     * @param dataURI
     * @returns {Blob}
     */
    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    }

    /**
     * upload
     * @param {Object} file: file.name, file.dataURL
     */
    function upload(file){
        var fd = new FormData();
        fd.append('file', dataURItoBlob(file.dataURL), file.name);
        $.ajax({
            type: 'POST',
            url: '/upload',
            data: fd,
            processData: false,
            contentType: false,
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        // 本地 server 速度会很快, 可以在 Chrome 开发者工具限制网速来模拟
                        console.log('进度', percentComplete);
                    }
                }, false);

                return xhr;
            }
        }).success(function (res) {
            console.log(res);
        }).error(function (err) {
            console.log(err);
        });
    }

    $('#file').on('change', function (e) {
        var file = e.target.files[0];

        if (file) {
            if (/^image\//i.test(file.type)) {

                var reader = new FileReader();

                reader.onloadend = function () {
                    var img = new Image();

                    img.onload = function () {
                        // 当图片宽度超过 400px 时, 就压缩成 400px, 高度按比例计算
                        var w = Math.min(400, img.width);
                        var h = img.height * (w / img.width);
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');

                        // 设置 canvas 的宽度和高度
                        canvas.width = w;
                        canvas.height = h;

                        // 把图片绘制到 canvas 中
                        ctx.drawImage(img, 0, 0, w, h);

                        // 取出 base64 格式数据
                        var dataURL = canvas.toDataURL('image/png');

                        $('<li class="weui_uploader_file" style="background-image:url(' + dataURL + ')"></li>').appendTo('.weui_uploader_files');
                        files.push({
                            name: file.name,
                            dataURL: dataURL
                        });

                        // 压缩后大小
                        var after = dataURItoBlob(dataURL);
                        console.log('压缩后', after.size / 1024);
                    };

                    // 压缩前大小

                    var before = dataURItoBlob(reader.result);
                    console.log('压缩前', before.size / 1024);

                    img.src = reader.result;

                };

                reader.onerror = function () {
                    console.error('reader error');
                };

                // 读出base64格式
                reader.readAsDataURL(file);
            } else {
                throw '只能上传图片';
            }
        }
    });

    $('#upload').on('click', function (e) {

        if (files.length === 0) {
            return;
        }

        files.forEach(upload);
    });

});
