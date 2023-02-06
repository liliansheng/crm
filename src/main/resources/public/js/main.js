layui.use(['element', 'layer', 'layuimini','jquery','jquery_cookie'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        $ = layui.jquery_cookie($);

    // 菜单初始化
    $('#layuiminiHomeTabIframe').html('<iframe width="100%" height="100%" frameborder="0"  src="welcome"></iframe>')
    layuimini.initTab();


    /**
     * 用户退出系统
     */
    $(".login-out").click(function () {
        //弹出提示框提示用户
        layer.confirm('确定要退出系统?', {icon: 3, title:'提示信息'}, function(index){
            //关闭提示框
            layer.close(index);

            //清空cooking数据
            $.removeCookie("userIdStr",{domain:"localhost",path:"/crm"});
            $.removeCookie("userName",{domain:"localhost",path:"/crm"});
            $.removeCookie("trueName",{domain:"localhost",path:"/crm"});

            //执行退出命令后，跳转到登录页面
            window.parent.location.href=ctx+"/index";
        });
    })

});

