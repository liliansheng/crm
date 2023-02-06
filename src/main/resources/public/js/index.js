layui.use(['form','jquery','jquery_cookie'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        $ = layui.jquery_cookie($);


    /**
     *表单提交
     *   form.on('submit(*)', function(data){}
     *  星号(*)：submit的lay-filter的属性值
     *
     *     return false; //阻止表单跳转
     */
    form.on('submit(login)', function(data){
     /* console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
      console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回*/
      console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}

     /*表单元素非空校验 页面中已经有layui元素进行校验了，这里就不再验证了*/

     /*发送ajax请求，执行用户登录操作*/
     $.ajax({
         type:"post",
         url:ctx + "/user/login",
         data:{
             userName:data.field.username,
             userPwd:data.field.password
             /*userPwd:后台controller层接收参数名
             data.field.password：表单提交的name属性值
             */
         },
         success:function (result){//是回调函数，用来接收返回的数据
             console.log(result);
             //判断登录是否成功，如果code=200，表示登录成功，否则登录失败
             if (result.code==200){
                 //登录成功
                 /**
                  * 设置用户是登录状态
                  *   1、利用session会话
                  *     保存用户信息，如果会话存在，则用户是登录状态，否则是非登录状态
                  *     缺点：服务器关闭，会话则会消失
                  *   2、利用cooking
                  *     保存用户信息，cooking未失效则用户是登录状态
                  *   （浏览器关闭，这两种都会消失，服务器关闭，cooking不消失 ）
                  */
                 layer.msg("登录成功",function (){//弹出提示信息后执行函数
                     //判断用户是否选中'记住我'（判断复选框是否被选中，如果选中，则设置cooking对象7天有效）
                     if ($("#rememberMe").prop("checked")){//id为rememberMe的复选框被选中
                         //如果选中，则设置cooking7天有效
                         //将用户信息设置到cooking中
                        // $.cookie("userId",result.result.userId,{expires:7})
                         $.cookie("userIdStr",result.result.userIdStr,{expires:7});
                         $.cookie("userName",result.result.userName,{expires:7});
                         $.cookie("trueName",result.result.trueName,{expires:7});
                     }else {
                         //将用户信息设置到cooking中
                        // $.cookie("userId",result.result.userId)
                         $.cookie("userIdStr",result.result.userIdStr);
                         $.cookie("userName",result.result.userName);
                         $.cookie("trueName",result.result.trueName);
                     }

                     //跳转到指定页面
                     window.location.href = ctx +"/main";
                 })

             }else {
                 //登录失败弹出提示信息和对应的图标
                 layer.msg(result.msg,{icon:5});
             }
         }
     });
        return false; //阻止表单(页面)跳转。如果需要表单跳转，去掉这段即可。

    });









    //资料里的源代码   layui 用户登录 表单提交
    /*form.on('submit(login)',function (data) {
        // 获取表单元素 用户名+密码
        data = data.field;
        console.log(data);

        /!**
         *  用户名 密码 非空校验
         *!/
        if(data.username=="undefined" || data.username=="" || data.username.trim()==""){
            layer.msg("用户名不能为空!");
            return false;
        }

        if(data.password=="undefined" || data.password=="" || data.password.trim()==""){
            layer.msg("用户密码不能为空!");
            return false;
        }

        $.ajax({
            type:"post",
            url:ctx+"/user/login",
            data:{
                userName:data.username,
                userPwd:data.password
            },
            dataType:"json",
            success:function (data) {
                if(data.code==200){
                    layer.msg("用户登录成功",function () {
                        var result =data.result;
                        $.cookie("userIdStr",result.userIdStr);
                        $.cookie("userName",result.userName);
                        $.cookie("trueName",result.trueName);
                        if($("input[type='checkbox']").is(":checked")){
                            $.cookie("userIdStr",result.userIdStr,{expires:7});
                            $.cookie("userName",result.userName,{expires:7});
                            $.cookie("trueName",result.trueName,{expires:7});
                        }
                        window.location.href=ctx+"/main";
                    })
                }else{
                    layer.msg(data.msg);
                }
            }
        });



        return false;


    })*/

});