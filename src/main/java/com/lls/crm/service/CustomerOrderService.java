package com.lls.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lls.crm.base.BaseService;
import com.lls.crm.dao.CustomerOrderMapper;
import com.lls.crm.query.CustomerOrderQuery;
import com.lls.crm.utils.AssertUtil;
import com.lls.crm.vo.Customer;
import com.lls.crm.vo.CustomerOrder;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerOrderService extends BaseService<CustomerOrder,Integer> {

    @Resource
    private CustomerOrderMapper customerOrderMapper;

    /**分页多条件查询指定客户id的客户订单*/
    public Map<String, Object> queryCustomerOrderByParams(CustomerOrderQuery customerOrderQuery) {
        Map<String,Object> map = new HashMap<>();
        //开启分页
        PageHelper.startPage(customerOrderQuery.getPage(),customerOrderQuery.getLimit());
        //得到分页对象(分页后的数据)
        PageInfo<CustomerOrder> pageInfo = new PageInfo<>(customerOrderMapper.selectByParams(customerOrderQuery));

        //返回的数据要放到layui的数据列表中，所以返回的数据要满足Layui数据列表的类型格式
        map.put("code",0);
        map.put("msg","success");
        map.put("count",pageInfo.getTotal());
        map.put("data",pageInfo.getList());
        return map;
    }

    /**根据订单id查询对应的订单对象*/
    public CustomerOrder queryCustomerOrderByCustomerId(Integer orderId) {
        return customerOrderMapper.queryCustomerOrderByCustomerId(orderId);
    }
}
