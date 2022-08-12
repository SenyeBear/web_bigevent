// 入口函数
$(function() {
    let form = layui.form;
    let layer = layui.layer;

    // 创建自定义表单验证规则
    form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '昵称长度必须在1~6个字符之间！'
            }
        }
    })

    initUserInfo();
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // console.log(res);
                // 调用layui的form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 快速实现表单重置
    $('#btnReset').click(function(e) {
        // 阻止表单的默认重置行为 防止登录名称也被重置
        e.preventDefault();
        // 再次调用initUserInfo() 重新获取用户信息
        initUserInfo();
    })

    // 监听表单提交事件 实现更新用户信息
    $('.layui-form').submit(function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 快速拿到表单数据
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                // console.log(res);
                // 调用父页面的方法 重新渲染用户头像和信息
                // 在iframe窗口里调用父页面方法
                window.parent.getUserInfo();
            }
        })
    })
})