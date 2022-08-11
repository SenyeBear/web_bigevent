// 入口函数
$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').click(function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击“去登录”的链接
    $('#link_login').click(function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    // 从layui中获取form对象layer对象
    let form = layui.form;
    let layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个交pwd的校验规则 数组形式
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位之间且不能出现空格'],
        // 校验两次密码是否一致的规则 函数形式
        repwd: function(value) {
            // 通过形参拿到确认密码框中的内容 
            // 还需拿到密码框的内容
            // 进行等于判断
            // 判断失败 返回一个提示消息
            let pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').submit(function(e) {
        // 阻止提交按钮默认行为
        e.preventDefault();
        // 发起ajax的post请求
        let date = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！');
                // 注册成功后 模拟人的点击去登陆行为 自动跳到登录
                $('#link_login').click();

            });
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止提交按钮默认行为
        e.preventDefault();
        // 发起ajax的请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 利用jQuery的serialize() 快速获取表单对象的数据
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    layer.msg('登陆失败！');
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                // 将登录成功得到的token字符串保存到localStorage
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = './index.html';
            }
        })
    })
})