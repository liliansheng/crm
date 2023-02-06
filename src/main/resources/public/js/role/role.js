layui.use(['table','layer'],function(){
       var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //用户列表展示(数据表格/渲染表格)
    var tableIns = table.render({
        id:"roleTable"   //（自定义）
        //容器元素的ID属性值
        ,elem: '#roleList'
        //容器的高度 full-20 ：差值
        ,height: 'full-20'
        //单元格最小宽度
        ,cellMinWidth:95
        //访问数据的URL（对应后台的参数接口）
        ,url: ctx + '/role/list' //数据接口
        ,page: true //开启分页
        //默认每页显示的数量
        ,limit:10
        //每页页数的可选项
        ,limits:[10,20,30]
        //开启头部工具栏
        ,toolbar:"#toolbarDemo"
        ,cols: [[ //表头
            //field：要求field属性值与返回的数据库中对应的属性字段名一致（实体类属性名一致）
            //title：设置列的标题
            //width：可不写，自动设置
            //sort：是否允许排序（默认false）
            //fixed:固定列
            {type:'checkbox',fixed: 'center'}
            ,{field: 'id', title: '编号', sort: true, fixed: 'left'}
            ,{field: 'roleName', title: '角色名称',align:"center"}
            ,{field: 'roleRemark', title: '角色备注',  align:'center'}
            ,{field: 'createDate', title: '创建时间', align:'center'}
            ,{field: 'updateDate', title: '更新时间', align:'center'}
            /*绑定行工具栏*/
            ,{title: '操作',templet:'#roleListBar',fixed: 'right',align: 'center',minWidth:150}

        ]]
    });

    /**绑定搜索按钮 （多条件查询）*/
    $(".search_btn").click(function () {
        /**
         * 表格重载
         *  多条件查询
         */
        tableIns.reload({
            //设置需要传递给后端的参数（依然是上面表格请求的路径）
            where: { //设定异步数据接口的额外参数，任意设置
                //参数名要与对应的控制器中对应的方法所需要的参数一致
                //通过文本框/下拉框的值（搜索条件）设置传递参数
                /*取表单中的值:通过name属性值，id属性值获取*/
                roleName: $("[name = 'roleName']").val()//用户名
            }
            , page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    })

    /**
     * 监听头部工具栏事件
     *   格式：table.on('toolbar(数据表格lay-filter的属性值)', function(data){}
     */
    table.on('toolbar(roles)', function(data) {
        //data.event : 对应元素上lay-event的属性值
        if (data.event == "add") {//判断对应的事件类型
            //打开添加/更新角色对话框 事件
            openAddOrUpdateRoleDialog();//方法打开一个添加用户信息的窗口
        } else if (data.event == "grant") {//执行角色授权事件
            //获取数据表格选中的记录数据(data.config.id 取的就是（上面）数据表格的id)
            var checkStatus = table.checkStatus(data.config.id);
            //打开授权的对话框
            openAddGrantDialog(checkStatus.data);//id数组

        }
    });




    /**
     * 监听行工具栏事件
     *  格式table.on('tool(数据表格lay-filter的属性值)',function (data){}
     */
    table.on('tool(roles)',function (data){
        //把data输出到控制台，可以查看data中的数据
        // console.log(data)
        //判断事件（是删除还是修改）
        if (data.event == "edit"){//编辑操作（与添加操作基本相同，多了一个主键id,判断是修改哪个客户的信息）
            //拿到主键id
            var roleId = data.data.id
            //打开添加/修改营销机会的窗口
            openAddOrUpdateRoleDialog(roleId)//只是空窗口，还没有数据
        }else if (data.event == "del") {//删除操作
           deleteRole(data.data.id);
        }
    })


    /**
     * 打开添加、更新角色对话框
     */
    function openAddOrUpdateRoleDialog(roleId){
        var title = "<h3>角色管理-- 添加角色</h3>";
        //请求到控制器（controller）里的toAddOrUpdateRolePage方法，此方法返回（跳转）到要打开的窗口页面
        var url = ctx + "/role/toAddOrUpdateRolePage"
         //如果roleId不为空，则表示修改信息
        if (roleId != null && roleId != ''){
            title = "<h3>角色管理-- 更新角色</h3>";
            url += "?roleId=" + roleId;
        }

        //iframe层
        layui.layer.open({
            title:title,
            content:url,
            area:["500px","300px"],
            type: 2,
            maxmin:true
        });
    }


    /**
     * 删除角色
     * @param roleId
     */
    function deleteRole(roleId){
        //弹出提示框，询问用户是否确认删除
        layer.confirm("确定要删除该记录吗？",{icon:3,title:"角色管理"},function (index){
            //关闭弹出框
            layer.close(index);
            //改善ajax请求，执行删除操作
            $.ajax({
                type:"post",
                url: ctx + "/role/delete",
                data:{
                    roleId:roleId,
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
     * 打开授权页面
     */
    function openAddGrantDialog(data){
        //参数校验
      if (data.length < 1){
          layer.msg("请选择授权的角色！",{icon:5});
          return;
      }
      if (data.length >1){
          layer.msg("请选择1个角色进行授权！",{icon:5});
          return;
      }
      //路径需要传参，data是一个数组，取第一个值就好了
        console.log(data[0].id)
      var url = ctx + "/module/toAddGrantPage?roleId="+data[0].id;
      var title = "<h3>角色管理——角色授权</h3>"
      //打开iframe窗口（点击授权按钮后弹出一个窗口）
        layui.layer.open({
            title:title,
            content: url,
            type:2,
            area: ["600px","400px"],
            maxmin: true,
        })

    }



  /*
       原代码
    //角色列表展示
    var  tableIns = table.render({
        elem: '#roleList',
        url : ctx+'/role/list',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "roleListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: "id", title:'编号',fixed:"true", width:80},
            {field: 'roleName', title: '角色名', minWidth:50, align:"center"},
            {field: 'roleRemark', title: '角色备注', minWidth:100, align:'center'},
            {field: 'createDate', title: '创建时间', align:'center',minWidth:150},
            {field: 'updateDate', title: '更新时间', align:'center',minWidth:150},
            {title: '操作', minWidth:150, templet:'#roleListBar',fixed:"right",align:"center"}
        ]]
    });

    // 多条件搜索
    $(".search_btn").on("click",function () {
        table.reload("roleListTable",{
            page:{
                curr:1
            },
            where:{
                // 角色名
                roleName:$("input[name='roleName']").val()
            }
        })
    });

    // 头工具栏事件
    table.on('toolbar(roles)',function (obj) {
        switch (obj.event) {
            case "add":
                openAddOrUpdateRoleDialog();
                break;
        }
    });


    table.on('tool(roles)',function (obj) {
        var layEvent =obj.event;
        if(layEvent === "edit"){
            openAddOrUpdateRoleDialog(obj.data.id);
        }else if(layEvent === "del"){
            layer.confirm("确认删除当前记录?",{icon: 3, title: "角色管理"},function (index) {
                $.post(ctx+"/role/delete",{id:obj.data.id},function (data) {
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




    function openAddOrUpdateRoleDialog(id) {
        var title="角色管理-角色添加";
        var url=ctx+"/role/addOrUpdateRolePage";
        if(id){
            title="角色管理-角色更新";
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
