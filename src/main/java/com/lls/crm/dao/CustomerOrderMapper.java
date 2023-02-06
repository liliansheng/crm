package com.lls.crm.dao;

import com.lls.crm.base.BaseMapper;
import com.lls.crm.vo.CustomerOrder;

public interface CustomerOrderMapper extends BaseMapper<CustomerOrder,Integer> {

    /**根据订单id查询对应的订单对象*/

    public CustomerOrder queryCustomerOrderByCustomerId(Integer orderId);

    /**通过客户id查询最后一条订单记录*/
    CustomerOrder queryLossCustomerOrderByCustomerId(Integer customerId);
}