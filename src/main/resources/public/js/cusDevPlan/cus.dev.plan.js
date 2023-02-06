layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;


    //用户列表展示(数据表格/渲染表格)
    var tableIns = table.render({
        id:"saleChanceTable"
        //容器元素的ID属性值
        ,elem: '#saleChanceList'
        //容器的高度 full-20 ：差值
        ,height: 'full-20'
        //单元格最小宽度
        ,cellMinWidth:95
        //访问数据的URL（对应后台的参数接口）  设置flag参数，表示查询的是客户开发计划数据
        ,url: ctx + '/sale_chance/list?flag=1'
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
            ,{field: 'chanceSource', title: '机会来源',align:"center"}
            ,{field: 'customerName', title: '客户名称',  align:'center'}
            ,{field: 'cgjl', title: '成功几率', align:'center'}
            ,{field: 'overview', title: '概要', align:'center'}
            ,{field: 'linkMan', title: '联系人',  align:'center'}
            ,{field: 'linkPhone', title: '联系电话', align:'center'}
            ,{field: 'description', title: '描述', align:'center'}
            ,{field: 'createMan', title: '创建人', align:'center'}
            ,{field: 'createDate', title: '创建时间', align:'center'}
            ,{field: 'updateDate', title: '修改时间', align:'center'}
            ,{field: 'devResult', title: '开发状态', align:'center',templet:function (d){
                    return formatDevResult(d.devResult);
                }}
            ,{title: '操作',templet:'#op',fixed: 'right',align: 'center',minWidth:150}

        ]]
    });


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
            //设置需要传递给后端的参数（依然是上面表格请求的路径）
            where: { //设定异步数据接口的额外参数，任意设
                //参数名要与对应的控制器中对应的方法所需要的参数一致
                //通过文本框/下拉框的值（搜索条件）设置传递参数
                /*取表单中的值:通过name属性值，id属性值获取*/
                customerName: $("[name = 'customerName']").val()//客户名
                ,createMan: $("[name = 'createMan']").val()// 创始人
                ,devResult:$("#devResult").val()//开发状态

            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    })

    /**
     * 行工具栏监听
     */
     table.on('tool(saleChances)',function (data){//data  是表格中每一行的数据
         //判断类型
         if (data.event == "dev"){//开发
             //打开计划项开发与详情页面
             openCusDevPlanDialog("计划项数据开发",data.data.id)//id 是根据表格中field为'id'的，（在js列表展示中查看）

         }else if (data.event == "info"){//详情
             //打开计划项开发与详情页面
             openCusDevPlanDialog("计划项数据维护",data.data.id)
         }
     })


    function openCusDevPlanDialog(title,id){
         //iframe层
        layui.layer.open({//如果直接用layer.open，会在父级窗口打开，窗口太大，不合适
            //类型
            type: 2,//代表iframe层
            //标题
            title: title,
            /*title: 'layer mobile页',*/
            //宽高
            area: ['750px', '550px'],
            //URL地址（ iframe的url）
            content: ctx + "/cus_dev_plan/toCusDevPlanPage?id="+ id,//把url地址的页面放入弹出框中
            //上面打开的窗口可以最大最小化
            maxmin:true,
        });
    }








    /*
          原代码
        //用户列表展示
        var  tableIns = table.render({
            elem: '#saleChanceList',
            url : ctx+'/sale_chance/list?state=1&flag=1',
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
                {field: 'devResult', title: '开发状态', align:'center',templet:function (d) {
                        return formatterDevResult(d.devResult);
                    }},
                {title: '操作',fixed:"right",align:"center", minWidth:150,templet:"#op"}
            ]]
        });
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
        $(".search_btn").on("click",function(){
            table.reload("saleChanceListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    customerName: $("input[name='customerName']").val(),  //客户名
                    createMan: $("input[name='createMan']").val(), //创建人
                    devResult:$("#devResult").val()  //开发状态
                }
            })
        });
        /!**
         * 行监听
         *!/
        table.on("tool(saleChances)", function(obj){
            var layEvent = obj.event;
            if(layEvent === "dev") {
                openCusDevPlanDialog("计划项数据维护",obj.data.id);
            }else if(layEvent === "info") {
                openCusDevPlanDialog("计划项数据详情",obj.data.id);
            }

        });
        // 打开开发计划对话框
        function openCusDevPlanDialog(title,sid){
            layui.layer.open({
                title : title,
                type : 2,
                area:["750px","550px"],
                maxmin:true,
                content : ctx+"/cus_dev_plan/toCusDevPlanDataPage?sid="+sid
            });
        }*/




});
