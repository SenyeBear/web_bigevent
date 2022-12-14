$(function() {
    getUserInfo();

    let layer = layui.layer;
    $('#btnLogout').click(function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1.清空本地存储中的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            location.href = './login.html';

            // 关闭 confirm 询问框
            layer.close(index);

          });
    })

    // 获取用户的基本信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            // 有权限的接口要在请求头配置authorization
            url: '/my/userinfo',
            // headers 是请求头配置对象
            // headers: {
            //     // 没有值则为空字符串
            //     Authorization: localStorage.getItem('token') || '',
            // },
            success: function(res) {
                if(res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                // 调用renderAvatar() 渲染用户头像
                renderAvatar(res.data);
            },
            /* // 无论成功还是失败 最终都会调用complete 回调函数
            complete: function(res) {
                // console.log('执行了 complete 回调');
                // console.log(res);
                // 在complete回调函数中 可以使用res.responseJSON拿到服务器响应回来的数据
                if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                    // 1.强制清空 token
                    localStorage.removeItem('token');
                    // 2.强制跳转到登录页面
                    location.href = './login.html';
                }
            } */
        })
    }

    // 渲染用户的头像
    function renderAvatar(user) {
        // 1.获取用户名称 以昵称优先级为高
        let name = user.nickname || user.username;
        // 2.设置欢迎的文本
        $('#welcome').html(`欢迎  ${name}`);
        // 3.按需渲染用户的头像
        if (user.user_pic !== null) {
            // 3.1 渲染图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text-avatar').hide();
        } else {
            // 3.2 渲染文本头像
            $('.layui-nav-img').hide();
            // str[0] 获取到第一个字符 转成大写
            let first = name[0].toUpperCase();
            $('.text-avatar').html(first).show();
        }

    }
})