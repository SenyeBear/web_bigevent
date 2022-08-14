$(function() {
    let layer = layui.layer;
    let form = layui.form;

    initArtCateList();


    // 获取文章分类列表数据
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        })
    }
    
    // 为添加类别按钮绑定点击事件
    let indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 监听表单注册事件
    // 注意：表单是动态创建的，绑定时还不存在，因此不能直接监听，要通过事件代理的形式
    $('body').on('submit', '#form-add', function(e) {
        // 阻止默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    // console.log(res);
                    return layer.msg('新增分类失败！');
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
    
        })
    })

    // 通过代理的形式为btn-edit按钮绑定点击事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        let id = $(this).attr('data-id');
        // 发起ajax请求 获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })

    })

    // 通过代理的形式 为修改分类的表单绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0 ) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                layer.close(indexEdit);
                // 重新获取分类数据
                initArtCateList();
            }
        })
    })
    
    // 通过代理的形式 为删除绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-id');
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();

                }
            })
            
            
          });
    })

})