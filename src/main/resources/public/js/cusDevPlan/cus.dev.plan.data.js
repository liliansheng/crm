layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //用户列表展示(数据表格/渲染表格)
    var tableIns = table.render({
        id:"cusDevPlanTable"
        //容器元素的ID属性值
        ,elem: '#cusDevPlanList'
        //容器的高度 full-20 ：差值
        ,height: 'full-20'
        //单元格最小宽度
        ,cellMinWidth:95
        //访问数据的URL（对应后台的参数接口）
        ,url: ctx + '/cus_dev_plan/list?saleChanceId=' + $("[name = 'id']").val()
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
            ,{field: 'planItem', title: '计划项',align:"center"}
            ,{field: 'planDate', title: '计划时间',  align:'center'}
            ,{field: 'exeAffect', title: '执行效果', align:'center'}
            ,{field: 'createDate', title: '创建时间', align:'center'}
            ,{field: 'updateDate', title: '修改时间', align:'center'}
            ,{title: '操作',templet:'#cusDevPlanListBar',fixed: 'right',align: 'center',minWidth:150}

        ]]
    });

    /**
     * 监听头部工具栏
     */
     table.on('toolbar(cusDevPlans)',function (data){
         if (data.event == "add"){//添加计划项
             openOrUpdateCusDevPlanDialog();
         }else if (data.event == "success"){//开发成功
             //更新营销机会的开发状态
             //状态码为2表示成功
             updateSaleChanceDevResult(2);

         }else if (data.event == "failed"){//开发失败
             //状态码为3表示失败
             updateSaleChanceDevResult(3);
         }
     })


    /**
     * 监听行工具栏
     */
    table.on('tool(cusDevPlans)',function (data){
        //
        if (data.event == "edit"){//编辑客户开发计划
            openOrUpdateCusDevPlanDialog(data.data.id);//根据页面传递id有无，判断是更新还是添加操作

        }else if (data.event == "del"){//删除客户开发计划项
            //执行删除操作
            deleteCusDevPlan(data.data.id)//传id到后台，判断是删除哪条数据
        }
    })

    /**
     * 打开添加或修改计划项的页面
     */
    function openOrUpdateCusDevPlanDialog(id){
         var title = "计划项管理-添加计划项"
         var url = ctx + "/cus_dev_plan/toAddOrUpdateCusDevPlanDialog?sId=" + $("[name = id]").val();
         //判断计划项ID是否为空 （如果为空则为添加操作，不为空则表示更新操作）
         if (id != null && id != ''){
             title = "计划项管理-更新计划项"
             url += "&id=" + id;//用于传后台查数据，回显到页面
         }

         //iframe层(弹出的窗口)
         layui.layer.open({//如果直接用layer.open，会在父级窗口打开，窗口太大，不合适
             //类型
             type: 2,//代表iframe层
             //标题
             title: title,
             /*title: 'layer mobile页',*/
             //宽高
             area: ['500px', '300px'],
             //URL地址（ iframe的url）
             content: url,//把url地址的页面放入弹出框中
             //上面打开的窗口可以最大最小化
             maxmin:true,
         });
     }

     /**修改营销机会的开发状态*/
    function updateSaleChanceDevResult(devResult){
        //弹出确认框，询问用户是否更改
        layer.confirm("确认更改状态？",{icon:3,title:"营销机会管理"},function (index){
            //获取要更改数据的ID（从隐藏域中取）
            var sId = $("[name = 'id']").val();
            //发送ajax请求
            $.post(ctx + '/sale_chance/updateSaleChanceDevResult',{id:sId,devResult:devResult},function (result){
                //根据返回结果，判断是操作成功还是失败，再执行相应的操作
                if(result.code == 200){//操作成功
                    //提示信息
                    layer.msg("更改状态成功",{icon:6});
                    //关闭所有的iframe(关闭所有的弹出窗口);
                    layer.closeAll("iframe");
                    //刷新父窗口页面
                    parent.location.reload();
                }else{
                    //提示信息
                    layer.msg(result.msg(),{icon:5})
                }

            })
        })
    }




    /**
     * 删除计划项
     * @param id
     */
    function deleteCusDevPlan(id){
        //弹出确认框，询问用户是否删除(function是点击确认后执行的函数)
        layer.confirm("是否确认删除？",{icon:3},function (index){
            //改善ajax请求
            $.post(ctx + '/cus_dev_plan/delete',{id:id},function (result){
                //判断删除结果
                if (result.code == 200){//删除成功
                    //弹出的确认框会自动关闭，也可手动关闭
                    //提示信息
                    layer.msg("操作成功",{icon: 6})
                    //刷新页面
                    tableIns.reload();
                }else {
                    //删除失败提示信息
                    layer.msg(result.msg(),{icon:5})
                }

            })
        })
    }



    /* //原代码
     //计划项数据展示
     var  tableIns = table.render({
         elem: '#cusDevPlanList',
         url : ctx+'/cus_dev_plan/list?sid='+$("input[name='id']").val(),
         cellMinWidth : 95,
         page : true,
         height : "full-125",
         limits : [10,15,20,25],
         limit : 10,
         toolbar: "#toolbarDemo",
         id : "cusDevPlanListTable",
         cols : [[
             {type: "checkbox", fixed:"center"},
             {field: "id", title:'编号',fixed:"true"},
             {field: 'planItem', title: '计划项',align:"center"},
             {field: 'exeAffect', title: '执行效果',align:"center"},
             {field: 'planDate', title: '执行时间',align:"center"},
             {field: 'createDate', title: '创建时间',align:"center"},
             {field: 'updateDate', title: '更新时间',align:"center"},
             {title: '操作',fixed:"right",align:"center", minWidth:150,templet:"#cusDevPlanListBar"}
         ]]
     });


     //头工具栏事件
     table.on('toolbar(cusDevPlans)', function(obj){
         switch(obj.event){
             case "add":
                 openAddOrUpdateCusDevPlanDialog();
                 break;
             case "success":
                 updateSaleChanceDevResult($("input[name='id']").val(),2);
                 break;
             case "failed":
                 updateSaleChanceDevResult($("input[name='id']").val(),3);
                 break;
         };
     });



     /!**
      * 行监听
      *!/
     table.on("tool(cusDevPlans)", function(obj){
         var layEvent = obj.event;
         if(layEvent === "edit") {
             openAddOrUpdateCusDevPlanDialog(obj.data.id);
         }else if(layEvent === "del") {
             layer.confirm('确定删除当前数据？', {icon: 3, title: "开发计划管理"}, function (index) {
                 $.post(ctx+"/cus_dev_plan/delete",{id:obj.data.id},function (data) {
                     if(data.code==200){
                         layer.msg("操作成功！");
                         tableIns.reload();
                     }else{
                         layer.msg(data.msg, {icon: 5});
                     }
                 });
             })
         }

     });


     // 打开添加计划项数据页面
     function openAddOrUpdateCusDevPlanDialog(id){
         var url  =  ctx+"/cus_dev_plan/addOrUpdateCusDevPlanPage?sid="+$("input[name='id']").val();
         var title="计划项管理-添加计划项";
         if(id){
             url = url+"&id="+id;
             title="计划项管理-更新计划项";
         }
         layui.layer.open({
             title : title,
             type : 2,
             area:["700px","400px"],
             maxmin:true,
             content : url
         });
     }




     function updateSaleChanceDevResult(sid,devResult) {
         layer.confirm('确定执行当前操作？', {icon: 3, title: "计划项维护"}, function (index) {
             $.post(ctx+"/sale_chance/updateSaleChanceDevResult",
                 {
                     id:sid,
                     devResult:devResult
                 },function (data) {
                 if(data.code==200){
                     layer.msg("操作成功！");
                     layer.closeAll("iframe");
                     //刷新父页面
                     parent.location.reload();
                 }else{
                     layer.msg(data.msg, {icon: 5});
                 }
             });
         })
     }
 */



});
