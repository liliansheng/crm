package com.lls.crm.controller;

import com.lls.crm.base.BaseController;
import com.lls.crm.query.CustomerOrderQuery;
import com.lls.crm.service.CustomerOrderService;
import com.lls.crm.service.CustomerService;
import com.lls.crm.utils.AssertUtil;
import com.lls.crm.vo.CustomerOrder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("order")
public class CustomerOrderController extends BaseController {

    @Resource
    private CustomerOrderService customerOrderService;

    /**分页多条件查询指定客户id的客户订单*/
    @RequestMapping("list")
    @ResponseBody
    public Map<String,Object> queryCustomerOrderByParams(CustomerOrderQuery customerOrderQuery){
        return customerOrderService.queryCustomerOrderByParams(customerOrderQuery);
    }

    /**进入订单详情页面（并根据订单id查询对应的订单对象，将结果设置到请求域中）*/
    @RequestMapping("orderDetailPage")
    public String orderDetailPage(Integer orderId, HttpServletRequest request){
        AssertUtil.isTrue(null == orderId,"订单id不能为空");
        /**根据订单id查询对应的订单对象*/
        CustomerOrder order = customerOrderService.queryCustomerOrderByCustomerId(orderId);
        if (order != null){
            request.setAttribute("order",order);
        }
        return "customer/customer_order_detail";
    }
}
