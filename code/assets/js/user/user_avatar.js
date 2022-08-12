$(function() {
    let layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比 1 16/9 4/3
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)


// 为上传按钮绑定点击事件
$('#btnChooseImage').click(function() {
    $('#file').click();
})

// 为file文件选择框绑定change事件
$('#file').change(function(e) {
    // 通过e.target.files 获取用户所选择的文件
    // console.log(e);
    let filelist = e.target.files;
    // console.log(filelist);
    // 检测用户是否上传文件
    if(filelist.length === 0) {
        return layer.msg('请选择图片！');
    }

    // 1.拿到用户选择的文件
    let file = e.target.files[0];

    // 2.将文件转化为路径
    let newImgURL = URL.createObjectURL(file);

    // 3.重新初始化裁剪区域
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
})

// 将更新的图片上传到服务器
// 为确定按钮绑定点击事件
$('#btnUpload').click(function() {
    // 1.拿到用户裁剪后的图片
    let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 2.调用接口
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar:  dataURL
        },
        success: function(res) {
            if(res.status !== 0) {
                return layer.msg('更换头像失败！');
            }
            layer.msg('更换头像成功！');

            // 调用父页面方法 重新渲染头像
            window.parent.getUserInfo();
        }
    })
})
})