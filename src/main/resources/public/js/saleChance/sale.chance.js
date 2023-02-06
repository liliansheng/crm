layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //用户列表展示(数据表格/渲染表格)
   var tableIns = table.render({
       //数据表格的id
        id:"saleChanceTable"
        //容器元素的ID属性值
        ,elem: '#saleChanceList'
        //容器的高度 full-125 ：差值
        ,height: 'full-125'
        //单元格最小宽度
        ,cellMinWidth:95
        //访问数据的URL（对应后台的参数接口）
        ,url: ctx + '/sale_chance/list' //数据接口
        ,page: true //开启分页
        //默认每页显示的数量
        ,limit:10
        //每页页数的可选项
        ,limits:[10,20,30]
        //开启头部工具栏（通过id绑定）
        ,toolbar:"#toolbarDemo"
        ,cols: [[ //表头
             //field：要求field属性值与返回的数据库中对应的属性字段名一致（也就是与实体类属性名一致）
             //title：设置列的标题
             //width：可不写，自动设置
             //sort：是否允许排序（默认false）
             //fixed:固定列
           //复选框
            {type:'checkbox',fixed: 'center'}
            ,{field: 'id', title: '编号', sort: true, fixed: 'left'}
            ,{field: 'chanceSource', title: '机会来源',align:"center"}
            ,{field: 'customerName', title: '客户名称',  align:'center'}
            ,{field: 'cgjl', title: '成功几率', align:'center'}
            ,{field: 'overview', title: '概要', align:'center'}
            ,{field: 'linkMan', title: '联系人',  align:'center'}
            ,{field: 'linkPhone', title: '联系电话', align:'center'}
            ,{field: 'description', title: '描述', align:'center'}
            ,{field: 'createMan', title: '创建人', align:'center'}
            ,{field: 'uname', title: '分配人', align:'center'}
            ,{field: 'createDate', title: '创建时间', align:'center'}
            ,{field: 'updateDate', title: '修改时间', align:'center'}
            ,{field: 'state', title: '分配状态', align:'center',templet: function (d){
                    //调用回调函数返回格式化结果（将状态码转成想要的类容格式输出）
                return formatState(d.state);
                }}
            ,{field: 'devResult', title: '开发状态', align:'center',templet:function (d){
                return formatDevResult(d.devResult);
                }}
           //绑定行工具栏
            ,{title: '操作',templet:'#saleChanceListBar',fixed: 'right',align: 'center',minWidth:150}

        ]]
    });

    /**
     * 格式化分配状态
     *  0 = 未分配
     *  1 = 已分配
     *  其他 = 未知
     * @param sdate
     * @returns {string}
     */
     function formatState(sdate){
         if (sdate == 0){
           return "<div style='color: #00b7ee'>未分配</div>"
         }else if (sdate == 1){
             return "<div style='color: #0db46e'>已分配</div>"
         }else {
             return "<div style='color: #cad96c'>未知</div>"
         }
     }

    /**
     * 格式化开发状态
     * * 0-未开发
     * 1-开发中
     * 2-开发成功
     * 3-开发失败
     * 4-未知
     * @param devResult
     */
     function  formatDevResult(devResult){
         if (devResult == 0){
             return "<div style='color: #00b7ee'>未开发</div>"
         }else if (devResult == 1){
             return "<div style='color: #0db46e'>开发中</div>"
         }else if (devResult ==2 ){
             return "<div style='color: #cad96c'>开发成功</div>"
         }else if (devResult ==3 ){
             return "<div style='color: #cad96c'>开发失败</div>"
         }else {
             return "<div style='color: #cad96c'>未知</div>"
         }
     }

    /**
     * 搜索按钮的点击事件
     */
     $(".search_btn").click(function (){
         /**
          * 表格重载
          *  多条件查询
          */
         tableIns.reload({
             //设置需要传递给后端的参数（依然是上面表格请求的路径）（用的是上面的表格对象）
             where: { //设定异步数据接口的额外参数，任意设
                 //参数名要与对应的控制器中对应的方法所需要的参数一致
                 //通过文本框/下拉框的值（搜索条件）设置传递参数
                 /*取表单中的值:通过name属性值，id属性值获取*/
                 customerName: $("[name = 'customerName']").val()//客户名
                 ,createMan: $("[name = 'createMan']").val()// 创始人
                 ,state:$("#state").val()//分配状态

             }
             ,page: {
                 curr: 1 //从第 1 页开始查
             }
         });
     })


    /**
 * 监听头部工具栏事件
 *   格式：table.on('toolbar(数据表格lay-filter的属性值)', function(data){}
 */
   table.on('toolbar(saleChances)', function(data) {
     //data.event : 对应元素上lay-event的属性值
     if (data.event == "add") {//判断对应的事件类型
         //执行添加事件
         openSaleChanceDialog();//方法打开一个添加用户信息的窗口
     } else if (data.event == "del") {
         //执行删除事件
         deleteSaleChance(data);
     }
 });

    /**
     * 打开添加/修改营销机会的窗口
     *   判断saleChanceId是否为空
     *        如果为空，则为添加操作
     *        如果不为空，则为修改操作
     */
    //参数由行工具栏监听传过来的
    function openSaleChanceDialog(saleChanceId){
        //打开iframe层
        var title = "<h4>营销机会管理——添加客户</h4>";
        var url = ctx + "/sale_chance/toSaleChancePage";
        if (saleChanceId != null && saleChanceId != ''){
            //如果不为空，则为修改操作,修改标题
            title = "<h4>营销机会管理——修改客户</h4>";
            //传递id获取后台数据
            url += "?saleChanceId="+saleChanceId;
        }
        layui.layer.open({//如果直接用layer.open，会在父级窗口打开，窗口太大，不合适
            //类型
            type: 2,//代表iframe层
            //标题
            title: title,
            /*title: 'layer mobile页',*/
            //宽高
            area: ['500px', '580px'],
            //URL地址（ iframe的url）
            content: url,//把url地址的页面放入弹出框中
            //上面打开的窗口可以最大最小化
            maxmin:true,
        });
    }

    /**
     * 删除营销机会记录（删除多条记录）
     * table：（表格实例）
     * saleChanceTable :上面数据表格的ID
     */
    function deleteSaleChance(data){
     //获取数据表格选中的行数据  格式：table.checkStatus("数据表格的ID属性值")
        var checkStatus = table.checkStatus("saleChanceTable")
        //console.log(checkStatus);//输出在浏览器控制台
        //获取所有被选中的记录对应的数据(每一个选中行中，列为id的数据)
        var saleChanceData = checkStatus.data;
        //判断用户是有否选择记录（如果选中行的length大于0）
        if (saleChanceData.length < 1 ){
            layer.msg("请选择要删除的记录",{icon:5})
            return;//不再往下执行
        }
        //弹出确认框，提示用户是否删除
        layer.confirm("确定要删除该记录吗？",{icon:3,title:"营销机会管理"},function (index){
            //关闭确认框
            layer.close(index);
            //传递的参数是数组   样式ids=1&ids=2&ids=3(后台ids接收参数)
            var ids = "ids=";
            //遍历参数数组
            for (var i = 0;i < saleChanceData.length;i++){
                if (i < saleChanceData.length-1){
                    ids = ids + saleChanceData[i].id + "&ids=";
                }else {
                    ids = ids + saleChanceData[i].id;
                }

            }
            //发送ajax请求，执行（多条）删除操作
            $.ajax({
                type:"post",
                url:ctx + "/user/delete",
                data:ids,//传递的参数是数组  （ids=1&ids=2&ids=3）
                success:function (result) {
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
        });

    }




    /**
     * 监听行工具栏事件(修改、删除操作)
     *  格式table.on('tool(数据表格lay-filter的属性值)',function (data){}
     */
    table.on('tool(saleChances)',function (data){
        //把data输出到控制台，可以查看data中的数据
        // console.log(data)
        //判断事件（是删除还是修改）
        if (data.event == "edit"){//编辑操作（与添加操作基本相同，多了一个主键id,判断是修改哪个客户的信息）
            //拿到主键id
            var saleChanceId = data.data.id
            //打开添加/修改营销机会的窗口
            openSaleChanceDialog(saleChanceId)//只是空窗口，还没有数据（如果是执行修改操作，进入页面时通过ID查询数据返回给要打开的修改页面）
        }else if (data.event == "del") {//删除操作
         //弹出提示框，询问用户是否确认删除
            layer.confirm("确定要删除该记录吗？",{icon:3,title:"营销机会管理"},function (index){
                //关闭弹出框
                layer.close(index);
                //改善ajax请求，执行删除操作
                $.ajax({
                    type:"post",
                    url: ctx + "/sale_chance/delete",
                    data:{
                        ids:data.data.id,
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
    })


/*
   老师原代码
    //营销机会列表展示
    var  tableIns = table.render({
        elem: '#saleChanceList',
        url : ctx+'/sale_chance/list',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "saleChanceListTable",
        cols : [[
            {type: "checkbox", fixed:"center"},
            {field: "id", title:'编号',fixed:"true"},
            {field: 'chanceSource', title: '机会来源',align:"center"},
            {field: 'customerName', title: '客户名称',  align:'center'},
            {field: 'cgjl', title: '成功几率', align:'center'},
            {field: 'overview', title: '概要', align:'center'},
            {field: 'linkMan', title: '联系人',  align:'center'},
            {field: 'linkPhone', title: '联系电话', align:'center'},
            {field: 'description', title: '描述', align:'center'},
            {field: 'createMan', title: '创建人', align:'center'},
            {field: 'createDate', title: '创建时间', align:'center'},
            {field: 'uname', title: '指派人', align:'center'},
            {field: 'assignTime', title: '分配时间', align:'center'},
            {field: 'state', title: '分配状态', align:'center',templet:function(d){
                    return formatterState(d.state);
                }},
            {field: 'devResult', title: '开发状态', align:'center',templet:function (d) {
                    return formatterDevResult(d.devResult);
                }},
            {title: '操作', templet:'#saleChanceListBar',fixed:"right",align:"center", minWidth:150}
        ]]
    });

    function formatterState(state){
        if(state==0){
            return "<div style='color:yellow '>未分配</div>";
        }else if(state==1){
            return "<div style='color: green'>已分配</div>";
        }else{
            return "<div style='color: red'>未知</div>";
        }
    }

    function formatterDevResult(value){
        /!**
         * 0-未开发
         * 1-开发中
         * 2-开发成功
         * 3-开发失败
         *!/
        if(value==0){
            return "<div style='color: yellow'>未开发</div>";
        }else if(value==1){
            return "<div style='color: #00FF00;'>开发中</div>";
        }else if(value==2){
            return "<div style='color: #00B83F'>开发成功</div>";
        }else if(value==3){
            return "<div style='color: red'>开发失败</div>";
        }else {
            return "<div style='color: #af0000'>未知</div>"
        }
    }



    // 多条件搜索
    $(".search_btn").on("click",function () {
        table.reload("saleChanceListTable",{
            page:{
                curr:1
            },
            where:{
                customerName:$("input[name='customerName']").val(),// 客户名
                createMan:$("input[name='createMan']").val(),// 创建人
                state:$("#state").val()    //分配状态
            }
        })
    });


    // 头工具栏事件
    table.on('toolbar(saleChances)',function (obj) {
        switch (obj.event) {
            case "add":
                openAddOrUpdateSaleChanceDialog();
                break;
            case "del":
                //console.log(table.checkStatus(obj.config.id).data);
                delSaleChance(table.checkStatus(obj.config.id).data);
                break;
        }
    });


    function delSaleChance(datas){
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
                url:ctx+"/sale_chance/delete",
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



    table.on('tool(saleChances)',function (obj) {
          var layEvent =obj.event;
          if(layEvent === "edit"){
              openAddOrUpdateSaleChanceDialog(obj.data.id);
          }else if(layEvent === "del"){
              layer.confirm("确认删除当前记录?",{icon: 3, title: "机会数据管理"},function (index) {
                  $.post(ctx+"/sale_chance/delete",{ids:obj.data.id},function (data) {
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



    /!**
     * 打开添加或更新对话框
     *!/
    function openAddOrUpdateSaleChanceDialog(sid) {
        var title="营销机会管理-机会添加";
        var url=ctx+"/sale_chance/addOrUpdateSaleChancePage";
        if(sid){
            title="营销机会管理-机会更新";
            url=url+"?id="+sid;
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