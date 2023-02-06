layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;



    /**
     * 监听表单的submit事件
     */
     form.on('submit(addOrUpdateSaleChance)',function (data){//function (data):监听拿到要提交的所有数据
          //提交数据的加载层
         var index = layer.msg("数据提交中，请稍后...",{
             icon:16,//图标
             time:false,//不关闭
             state:0.8//设置遮罩的透明度
         });
         //发送ajax请求
         var url = ctx + "/sale_chance/add";//(请求到添加操作)
         //通过更新营销机会的id来判断当前执行更新操作还是修改操作
         //如果id为空，则为添加操作，如果不为空，则为修改操作
         //隐藏域中拿到id
         var saleChance = $("[name = 'id']").val();
         if (saleChance != null && saleChance != ''){
             //修改操作
             url = ctx + "/sale_chance/update";
         }
         //data.field:从data中拿到所有数据
         //function (result):回调函数，从后台拿数据
         $.post(url,data.field,function (result){
             //判断操作是否执行成功，200=成功
             if (result.code == 200){
                 //如果成功，给出提示
                 layer.msg("操作成功!",{icon:6});
                 //关闭加载层
                 layer.close(index);
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


    /**
     * 关闭弹出层
     */
    //关闭添加营销机会的窗口（窗口取消按钮的事件）
    $("#closeBtn").click(function (){
        //当你在iframe页面关闭自身时
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    })

   /*加载指派人的下拉框 (获取下拉框要显示的选项)*/
    $.ajax({
        type:"get",
        url: ctx + "/user/queryAllSales",
        data:{},//无参数上传
        success:function (data){
            //判断返回的数据是否为空(判断回调函数接收的数据是否为空)
            if (data != null){
                //获取隐藏域设置的指派人ID
                var assignManID = $("#assignManId").val();
                //遍历返回的数据（遍历接收到的集合）
                for (var i = 0; i < data.length; i++){
                    var opt = "";
                    //如果循环得到的id与隐藏域中的id相等，则表示被选中
                    if (assignManID == data[i].id){
                        opt = "<option value='"+data[i].id+"' selected>"+data[i].uname+"</option>"
                    }else {
                        //设置下拉选项
                        opt = "<option value='"+data[i].id+"'>"+data[i].uname+"</option>"
                    }
                     //将下拉选项设置到下拉框中(通过id拿到下拉框，通过append追加选项)
                    $("#assignMan").append(opt);
                }
            }
            //重新渲染下拉框的内容(如果不设置，即使option追加到了下拉框，也不显示出来)
            layui.form.render("select")
        }
    })




   /*
   原代码
   $.post(ctx+"/user/queryAllSales",function (res) {
        for(var i=0;i<res.length;i++){
            if($("input[name='man']").val() == res[i].id){
                $("#assignMan").append("<option value=\""+res[i].id+"\"  selected='selected' >"+res[i].uname+"</option>");
            }else{
                $("#assignMan").append("<option value=\""+res[i].id+"\"   >"+res[i].uname+"</option>");
            }

        }
        // 重新渲染下拉框内容
        layui.form.render("select");
    });

    form.on('submit(addOrUpdateSaleChance)',function (data) {
        var index= top.layer.msg("数据提交中,请稍后...",{icon:16,time:false,shade:0.8});
        var url = ctx+"/sale_chance/save";
        if($("input[name='id']").val()){
            url=ctx+"/sale_chance/update";
        }
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
    });*/

});