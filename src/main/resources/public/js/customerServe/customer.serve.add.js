layui.use(['form', 'layer','jquery_cookie'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        $ = layui.jquery_cookie($);



    form.on('submit(addCustomerServe)',function (data) {
        var index= top.layer.msg("数据提交中,请稍后...",{icon:16,time:false,shade:0.8});
        var url = ctx+"/customer_serve/add";
        // 设置创建人(从cookie中获取)  createPeople 参数名要与实体类中的属性名对应
        data.field.createPeople = $.cookie("trueName");
        //var formData = data.field;
        $.post(url,data.field,function (res) {
            if(res.code==200){
                top.layer.msg("服务添加成功");
                top.layer.close(index);
                layer.closeAll("iframe");
                // 刷新父页面
                parent.location.reload();
            }else{
                layer.msg(res.msg);
            }
        });
        return false;
    });

    /**
     * 关闭弹出层
     */
    //关闭添加营销机会的窗口（窗口取消按钮的事件）
    $("#closeBtn").click(function (){
        //当你在iframe页面关闭自身时
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    })

});