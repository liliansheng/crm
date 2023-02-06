layui.use(['form', 'layer','jquery_cookie'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
        $ = layui.jquery_cookie($);

    //加载指派人的下拉框（查询客户经理）
    // $.post(ctx+"/user/queryAllCustomerManager",function (res) {
    //     for (var i = 0; i < res.length; i++) {
    //         if($("input[name='man']").val() == res[i].id ){
    //             $("#assigner").append("<option value=\"" + res[i].id + "\" selected='selected' >" + res[i].uname + "</option>");
    //         }else {
    //             $("#assigner").append("<option value=\"" + res[i].id + "\">" + res[i].uname + "</option>");
    //         }
    //     }
    //     //重新渲染
    //     layui.form.render("select");
    // });

    //加载指派人的下拉框（查询客户经理）
    $.ajax({
        type:"get",
        url:ctx + "/user/queryAllCustomerManager",
        data:{},
        success:function (data){
            console.log(data)
            //判断返回的数据是否为空
            if (data != null){
                //获取隐藏域中设置的分配人
                var assigner = $("input[name='man']").val();
                console.log(assigner)
                //遍历返回的数据
                for (var i = 0; i < data.length; i++){
                    var opt = "";
                    //判断是否被选中，（如果指派人包含在查询到的用户中，则为选中状态）
                    if (assigner == data[i].id){
                        //设置下拉框选项
                        opt = "<option value='" + data[i].id + "' selected='selected' >" + data[i].uname + "</option>"
                    }else {
                        opt = "<option value='" + data[i].id + "'>" + data[i].uname + "</option>"
                    }
                    //将选项设置到下拉框中
                    $("#assigner").append(opt);
                }
                //重新渲染
                layui.form.render("select");
          }
        }
    });

    form.on("submit(addOrUpdateCustomerServe)", function (data) {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        //从cookie中获取用户真实姓名，作为（处理人）参数
        data.field.serviceProcePeople=$.cookie("trueName");
        //弹出loading
        $.post(ctx + "/customer_serve/update", data.field, function (res) {
            if (res.code == 200) {
                setTimeout(function () {
                    top.layer.close(index);
                    top.layer.msg("操作成功！");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
                }, 500);
            } else {
                layer.msg(
                    res.msg, {
                        icon: 5
                    }
                );
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