package com.lls.crm.controller;

import com.lls.crm.base.BaseController;
import com.lls.crm.query.OrderDetailsQuery;
import com.lls.crm.service.OrderDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Map;

@Controller
@RequestMapping("order_details")
public class OrderDetailsController extends BaseController {

    @Resource
    private OrderDetailsService orderDetailsService;

    /*根据订单id（多作件分页）查询订单详情*/
    @RequestMapping("list")
    @ResponseBody
    public Map<String,Object> queryOrderDetailsByParams(OrderDetailsQuery orderDetailsQuery){
         return orderDetailsService.queryOrderDetailsByParams(orderDetailsQuery);
    }
}
