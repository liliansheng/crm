layui.use(['form','jquery','jquery_cookie'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        $ = layui.jquery_cookie($);


    /**
     * 表单的submit监听
     *   form.on('submit(saveBtn)',function (data) {}
     *     saveBtn：lay-verify的属性值
     */
    form.on('submit(saveBtn)',function (data) {
        /*data =data.field;*/
        //表单所有参数的值
        console.log(data.field);

        $.ajax({
            type:"post",
            url:ctx+"/user/updatePwd",
            data:{
                oldPassword:data.field.old_password,
                newPassword:data.field.new_password,
                repeatPassword:data.field.again_password
            },
            dataType:"json",
            success:function (result) {
                //判断密码是否修改成功
                if(result.code==200){
                    //修改密码成功后清空cooking，重新登录
                    layer.msg("密码修改成功,系统将在3秒后自动退出...",function () {
                        //指定域名、路径下的cookie
                        $.removeCookie("userIdStr",{domain:"localhost",path:"/crm"});
                        $.removeCookie("userName",{domain:"localhost",path:"/crm"});
                        $.removeCookie("trueName",{domain:"localhost",path:"/crm"});
                        //设置重新登录页面及延时时间
                        setTimeout(function () {
                            //parent表示在父窗口跳转
                            window.parent.location.href=ctx+"/index";
                        },3000);
                    })
                }else{
                    layer.msg(result.msg,{icon:5});
                }
            }
        })

    })


});