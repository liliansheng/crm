layui.use(['form', 'layer','formSelects'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    var  formSelects = layui.formSelects;


    /**
     * 监听表单的submit事件
     * form.on('submit(绑定元素的lay-filter属性值)',function (data){}
     *  addOrUpdateRole:（也就是确定按钮的）lay-filter属性值
     */
    form.on('submit(addOrUpdateRole)',function (data){ //function (data):监听拿到要提交的所有数据
        //提交数据的加载层
        var index = layer.msg("数据提交中，请稍后...",{
            icon:16,//图标
            time:false,//不关闭
            state:0.8//设置遮罩的透明度
        });
        //发送ajax请求

        //得到所有 表单元素 的值
        var formData = data.field;
        //请求的地址
        var url = ctx + "/role/add";//(请求到添加操作)

        //判断id是否为空，如果不为空，则为更新操作（判断隐藏域中是否存在角色id）
        if ($("[name = 'id']").val()){
            url = ctx + "/role/update";
        }

        //data.field:从data中拿到所有数据(得到所有表单元素的值),发送ajax请求
        //function (result):回调函数，从后台拿数据
        $.post(url,formData,function (result){
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

/*

    /!**
     * 加载角色下拉框
     *
     * 1、配置远程搜索，请求头，请求参数，请求类型等
     *
     * formSelects.comfig(ID,{Options},isJson)
     * @param ID        xm-select的值（对应的ftl页面文件里 对应的多选框的id）
     * @param Options   配置项
     * @param isJson    是否是传输json数据，true将添加请求头（Content-Type:application/Json;charset=UTF-8）
     *!/
    var userId = $("[name = 'id']").val();
     formSelects.config("selectId",{
         type:"post",//请求方式
         searchUrl:ctx + "/role/queryAllRoles?userId="+userId,//请求地址
         keyName: "roleName",//下拉框中的文本值，要与返回的数据中的key 对应一致
         keyVal: 'id',

     },true)
*/




    /*
         原代码
        var userId=$("input[name='id']").val();
        formSelects.config('selectId',{
            type:"post",
            searchUrl:ctx+"/role/queryAllRoles?userId="+userId,
            //自定义返回数据中name的key, 默认 name
            keyName: 'roleName',
            //自定义返回数据中value的key, 默认 value
            keyVal: 'id'
        },true);


        form.on('submit(addOrUpdateUser)',function (data) {
            var index= top.layer.msg("数据提交中,请稍后...",{icon:16,time:false,shade:0.8});
            var url = ctx+"/user/save";
            if($("input[name='id']").val()){
                url=ctx+"/user/update";
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
        });
    */


});