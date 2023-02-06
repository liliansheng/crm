layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    /**
     * 关闭弹出层
     */
    //关闭添加营销机会的窗口（窗口取消按钮的事件）
    $("#closeBtn").click(function (){
        //当你在iframe页面关闭自身时
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    })

    /**
     * 表单submit监听
     */
    form.on('submit(addOrUpdateCusDevPlan)',function (data){
        //提交数据的加载层   (top:在顶层显示出来提示)
        var index = top.layer.msg("数据提交中，请稍后...",{
            icon:16,//图标
            time:false,//不关闭
            state:0.8//设置遮罩的透明度
        });

        //拿到表单中的数据
        var formData = data.field;
        var url = ctx +　"/cus_dev_plan/add";

        //判断计划项id是为空（如果不为空则表示更新操作）
        if ($("[name = 'id']").val()){
            //$("[name = 'id']").val()如果取出的值为空，直接转为false，不用再和null值做比较
            url = ctx +　"/cus_dev_plan/update"
        }

        //data.field:从data中拿到所有数据
        //function (result):回调函数，从后台拿数据
        $.post(url,formData,function (result){
            //判断操作是否执行成功，200=成功
            if (result.code == 200){
                //如果成功，给出提示
                top.layer.msg("操作成功!",{icon:6});
                //关闭加载层
                top.layer.close(index);
                //关闭弹出层
                layer.closeAll("iframe");
                //刷新父窗口
                parent.location.reload();
            }else {
                layer.msg(result.msg,{icon: 5})
            }
        });
        //阻止表单提交
        return false;

    })




    /*form.on("submit(addOrUpdateCusDevPlan)", function (data) {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        //弹出loading
        var url=ctx + "/cus_dev_plan/save";
        if($("input[name='id']").val()){
            url=ctx + "/cus_dev_plan/update";
        }
        $.post(url, data.field, function (res) {
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
    });*/
});