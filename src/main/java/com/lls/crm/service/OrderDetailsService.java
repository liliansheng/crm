package com.lls.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lls.crm.base.BaseService;
import com.lls.crm.dao.OrderDetailsMapper;
import com.lls.crm.query.CustomerOrderQuery;
import com.lls.crm.query.OrderDetailsQuery;
import com.lls.crm.vo.CustomerOrder;
import com.lls.crm.vo.OrderDetails;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Service
public class OrderDetailsService extends BaseService<OrderDetails,Integer> {

    @Resource
    private OrderDetailsMapper orderDetailsMapper;

    /**根据订单id（多作件分页）查询订单详情*/
    public Map<String, Object> queryOrderDetailsByParams(OrderDetailsQuery orderDetailsQuery) {
        Map<String,Object> map = new HashMap<>();
        //开启分页
        PageHelper.startPage(orderDetailsQuery.getPage(),orderDetailsQuery.getLimit());
        //得到分页对象(分页后的数据)
        PageInfo<OrderDetails> pageInfo = new PageInfo<>(orderDetailsMapper.selectByParams(orderDetailsQuery));

        //返回的数据要放到layui的数据列表中，所以返回的数据要满足Layui数据列表的类型格式
        map.put("code",0);
        map.put("msg","success");
        map.put("count",pageInfo.getTotal());
        map.put("data",pageInfo.getList());
        return map;
    }
}
