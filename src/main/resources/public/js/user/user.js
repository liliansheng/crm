layui.use(['table', 'layer', "form"], function () {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //用户列表展示
    var tableIns = table.render({
        id: "userTable"
        //容器元素的id属性值
        , elem: '#userList'
        //访问数据的url，（后台数据的接口）
        , url: ctx + '/user/list'
        , cellMinWidth: 95
        //开启分页
        , page: true
        //容器的高度 fall：差值
        , height: "full-125"
        //每页页数可选数
        , limits: [10, 15, 20, 25]
        //每页默认的可选项
        , limit: 10
        //开启头部工具栏
        , toolbar: "#toolbarDemo"
        //表头
        , cols: [[
            //field:要求field的属性值与返回的数据中对应的属性名一致
            //title：标题
            //sort：是否允许排序
            //fixed固定列
            //templet：绑定行工具栏的id
            {type: "checkbox", fixed: "center"},
            {field: "id", title: '编号', fixed: "left", sort: true},
            {field: 'userName', title: '用户名称', align: "center"},
            {field: 'trueName', title: '真实姓名', align: 'center'},
            {field: 'email', title: '用户邮箱', align: 'center'},
            {field: 'phone', title: '手机号', align: 'center'},
            {field: 'createDate', title: '创建时间', align: 'center'},
            {field: 'updateDate', title: '更新时间', align: 'center'},
            {title: '操作', minWidth: 150, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    /**
     * 搜索按钮的点击事件
     * $(".search_btn")：根据 搜索 的class中设置的一个class类名绑定搜索
     */
    $(".search_btn").click(function () {
        /**
         * 表格重载
         *  多条件查询
         */
        tableIns.reload({
            //设置需要传递给后端的参数（依然是上面表格请求的路径）
            where: { //设定异步数据接口的额外参数，任意设
                //参数名要与对应的控制器中对应的方法所需要的参数一致
                //通过文本框/下拉框的值（搜索条件）设置传递参数
                /*取表单中的值:通过name属性值，id属性值获取*/
                userName: $("[name = 'userName']").val()//用户名
                , email: $("[name = 'email']").val()// 邮箱
                , phone: $("[name = 'phone']").val()//手机号
            }
            , page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    })

    /**
     * 头部工具栏监听事件
     */
    table.on('toolbar(users)', function (data) {
        if (data.event == "add") {//添加操作
            //打开添加或修改用户对话框
            openAddOrUpdateUserDialog();
        } else if (data.event == "del") {//删除操作
            //获取被选中数据的信息
            /*var checkStatus = table.checkStatus(data.config.id)//取配置中的id，就是上面数据表格中的id
            deleteUser(checkStatus.data);//这个 data是上面data中的‘data’数据 也就是id数组数据
            console.log(checkStatus.data);//可以把数据打印在控制台，看看要获取的值*/

            // deleteUser(table.checkStatus(data.config.id).data);
            deleteUsers(table.checkStatus(data.config.id)["data"]);
        }
    })

    //删除多条记录，测试用的
    /*function deleteUserss(userData){
        console.log(userData);
        //判断用户是否选择了要删除的数据
        if(userData.length == 0) {
            layer.msg("请选择要删除的数据", {icon: 5})
            return;
        }
        //弹出确认框，提示用户是否删除
        layer.confirm("确定要删除该记录吗？", {icon: 3, title: "用户管理"}, function (index) {
            //关闭确认框
            layer.close(index);
            //传递的参数是数组   样式ids=1&ids=2&ids=3(后台ids接收参数)
            var ids = "ids=";
            //遍历参数数组
            for(var i = 0; i < userData.length; i++) {
                if (i < userData.length - 1) {
                    ids = ids + userData[i].id + "&ids=";
                } else {   //注意(要带括号)
                    ids = ids + userData[i].id;
                }
            }
            console.log("ids===" + ids);
            //发送ajax请求，执行（多条）删除用户操作
            $.ajax({
                type:"post",
                url:ctx + "/user/delete",
                data:ids,//传递的参数是数组  （ids=1&ids=2&ids=3）
                success: function (result) {
                    //判断删除结果
                    if (result.code == 200) {
                        //提示删除成功
                        layer.msg("删除成功", {icon: 6},);
                        //刷新表格(用表格对象刷新)
                        tableIns.reload();
                    } else {
                        //提示删除失败
                        layer.msg(result.msg, {icon: 5});
                    }
                }
            })

        });
    }*/

    /*删除多条记录*/
    function deleteUsers(userData) {

        //判断用户是否选择了要删除的数据
        if(userData.length == 0) {
            layer.msg("请选择要删除的数据", {icon: 5})
            return;
        }
        //弹出确认框，提示用户是否删除
        layer.confirm("确定要删除该记录吗？", {icon: 3, title: "用户管理"}, function (index) {
            //关闭确认框
            layer.close(index);
            //传递的参数是数组   样式ids=1&ids=2&ids=3(后台ids接收参数)
            var ids = "ids=";
            //遍历参数数组
            for(var i = 0; i < userData.length; i++) {
                if (i < userData.length - 1) {
                    ids = ids + userData[i].id + "&ids=";
                } else {   //注意(要带括号)
                    ids = ids + userData[i].id;
                }
            }
            //发送ajax请求，执行（多条）删除用户操作
            $.ajax({
                type:"post",
                url:ctx + "/user/delete",
                data:ids,//传递的参数是数组  （ids=1&ids=2&ids=3）
                success: function (result) {
                    //判断删除结果
                    if (result.code == 200) {
                        //提示删除成功
                        layer.msg("删除成功", {icon: 6},);
                        //刷新表格(用表格对象刷新)
                        tableIns.reload();
                    } else {
                        //提示删除失败
                        layer.msg(result.msg, {icon: 5});
                    }
                }
            })

        });

    }


    /**
     * 行工具栏监听事件
     *   table.on('tool(users)',function (data){}
     *     data:拿到所有的数据
     */
    table.on('tool(users)', function (data){
        if (data.event == "edit") {//添加操作
            //打开添加/修改用户对话框
            openAddOrUpdateUserDialog(data.data.id);
        } else if(data.event == "del"){//删除操作
             //删除单条用户数据
            deleteUser(data.data.id)

        }
    })

    /**
     * 删除单条数据
     * @param userId
     */
    function deleteUser(id){
        //弹出提示框，询问用户是否确认删除
        layer.confirm("确定要删除该记录吗？",{icon:3,title:"用户管理"},function (index){
            //关闭弹出框
            layer.close(index);
            //改善ajax请求，执行删除操作
            $.ajax({
                type:"post",
                url: ctx + "/user/delete",
                data:{
                    ids:id,
                },
                success:function(result){
                    //判断删除结果
                    if (result.code == 200){
                        //提示删除成功
                        layer.msg("删除成功",{icon: 6},);
                        //刷新表格(用表格对象刷新)
                        tableIns.reload();
                    }else {
                        //提示删除失败
                        layer.msg(result.msg,{icon:5});
                    }
                }
            })
        })
    }


    /**
     * 打开添加或修改用户对话框 的方法
     * @param id
     */
    function openAddOrUpdateUserDialog(id) {
        //iframe层
        var title = "<h3>用户管理——添加用户</h3>"
        var url = ctx + "/user/toAddOrUpdateUserPage"
        if (id != null && id != '') {
            title = "<h3>用户管理——更新用户</h3>"
            url += "?id=" + id;//根据主键查询数据
        }

        layui.layer.open({//如果直接用layer.open，会在父级窗口打开，窗口太大，不合适
            //类型
            type: 2,//代表iframe层
            //标题
            title: title,
            /*title: 'layer mobile页',*/
            //宽高
            area: ['650px', '400px'],
            //URL地址（ iframe的url）
            content: url, //把url地址的页面放入弹出框中
            //上面打开的窗口可以最大最小化
            maxmin: true,
        });
    }


    /*  //原代码
    //用户列表展示
    var  tableIns = table.render({
        elem: '#userList',
        url : ctx+'/user/list',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "userListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: "id", title:'编号',fixed:"true", width:80},
            {field: 'userName', title: '用户名', minWidth:50, align:"center"},
            {field: 'email', title: '用户邮箱', minWidth:100, align:'center'},
            {field: 'phone', title: '手机号', minWidth:100, align:'center'},
            {field: 'trueName', title: '真实姓名', align:'center'},
            {field: 'createDate', title: '创建时间', align:'center',minWidth:150},
            {field: 'updateDate', title: '更新时间', align:'center',minWidth:150},
            {title: '操作', minWidth:150, templet:'#userListBar',fixed:"right",align:"center"}
        ]]
    });


    // 多条件搜索
    $(".search_btn").on("click",function () {
        table.reload("userListTable",{
            page:{
                curr:1
            },
            where:{
                userName:$("input[name='userName']").val(),// 用户名
                email:$("input[name='email']").val(),// 邮箱
                phone:$("input[name='phone']").val()    //手机号
            }
        })
    });


    // 头工具栏事件
    table.on('toolbar(users)',function (obj) {
        switch (obj.event) {
            case "add":
                openAddOrUpdateUserDialog();
                break;
            case "del":
                delUser(table.checkStatus(obj.config.id).data);
                break;
        }
    });



    function delUser(datas){
        /!**
         * 批量删除
         *   datas:选择的待删除记录数组
         *!/
        if(datas.length==0){
            layer.msg("请选择待删除记录!");
            return;
        }
        layer.confirm("确定删除选中的记录",{
            btn:['确定','取消']
        },function (index) {
            layer.close(index);
            // ids=10&ids=20&ids=30
            var ids="ids=";
            for(var i=0;i<datas.length;i++){
                if(i<datas.length-1){
                    ids=ids+datas[i].id+"&ids=";
                }else{
                    ids=ids+datas[i].id;
                }
            }
            $.ajax({
                type:"post",
                url:ctx+"/user/delete",
                data:ids,
                dataType:"json",
                success:function (data) {
                    if(data.code==200){
                        tableIns.reload();
                    }else{
                        layer.msg(data.msg);
                    }
                }
            })



        })
    }

    table.on('tool(users)',function (obj) {
        var layEvent =obj.event;
        if(layEvent === "edit"){
            openAddOrUpdateUserDialog(obj.data.id);
        }else if(layEvent === "del"){
            layer.confirm("确认删除当前记录?",{icon: 3, title: "用户管理"},function (index) {
                $.post(ctx+"/user/delete",{ids:obj.data.id},function (data) {
                    if(data.code==200){
                        layer.msg("删除成功");
                        tableIns.reload();
                    }else{
                        layer.msg(data.msg);
                    }
                })
            })
        }
    });


    function openAddOrUpdateUserDialog(id) {
        var title="用户管理-用户添加";
        var url=ctx+"/user/addOrUpdateUserPage";
        if(id){
            title="用户管理-用户更新";
            url=url+"?id="+id;
        }
        layui.layer.open({
            title:title,
            type:2,
            area:["700px","500px"],
            maxmin:true,
            content:url
        })
    }
*/


});
