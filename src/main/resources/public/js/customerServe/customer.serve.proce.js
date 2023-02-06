layui.use(['table','layer',"form"],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //服务列表展示
    table.render({
        elem: '#customerServeList',
        //后台根据flat这个参数来判断是查询所有的数据还是当前登录用户对应的数据
        //如果有flat这个参数且值为1，则表示只查询当前登录用户对应的数据，
        url : ctx+'/customer_serve/list?state=fw_002&flag=1',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "customerServeListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: "id", title:'编号',fixed:"true", width:80},
            {field: 'customer', title: '客户名', minWidth:50, align:"center"},
            {field: 'dicValue', title: '服务类型', minWidth:100, align:'center'},
            {field: 'overview', title: '概要信息', align:'center'},
            {field: 'createPeople', title: '创建人', minWidth:100, align:'center'},
            {field: 'assignTime', title: '分配时间', minWidth:50, align:"center"},
            {field: 'assigner', title: '分配人', minWidth:100, align:'center'},
            {field: 'createDate', title: '创建时间', align:'center',minWidth:150},
            {field: 'updateDate', title: '更新时间', align:'center',minWidth:150},
            {title: '操作', minWidth:150, templet:'#customerServeListBar',fixed:"right",align:"center"}
        ]]
    });

    // 多条件搜索
    $(".search_btn").on("click",function(){
        table.reload("customerServeListTable",{
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                customer: $("input[name='customer']").val(),  //客户名
                serveType: $("#type").val()  //服务类型
            }
        })
    });


    table.on('tool(customerServes)',function (obj) {
        var layEvent =obj.event;
        if(layEvent === "proce"){
            openCustomerProceDialog(obj.data.id);
        }
    });


    function openCustomerProceDialog(id) {
        var title="服务管理-服务处理";
        var url=ctx+"/customer_serve/addCustomerServeProcePage?id="+id;
        layui.layer.open({
            title:title,
            type:2,
            area:["700px","500px"],
            maxmin:true,
            content:url
        })
    }


});
