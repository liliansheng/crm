layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    //加载指派人的下拉框（查询客户经理）
    $.post(ctx+"/user/queryAllCustomerManager",function (res) {
        //遍历查询到的结果
        for(var i=0;i<res.length;i++){
            if($("input[name='man']").val() == res[i].id){
                $("#assigner").append("<option value=\""+res[i].id+"\"  selected='selected' >"+res[i].uname+"</option>");
            }else{
                $("#assigner").append("<option value=\""+res[i].id+"\" >"+res[i].uname+"</option>");
            }

        }
        // 重新渲染下拉框内容
        layui.form.render("select");
    });


    form.on('submit(addOrUpdateCustomerServe)',function (data) {
        var index= top.layer.msg("数据提交中,请稍后...",{icon:16,time:false,shade:0.8});
        var url = ctx+"/customer_serve/update";
        $.post(url,data.field,function (res) {
            if(res.code==200){
                top.layer.msg("操作成功");
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