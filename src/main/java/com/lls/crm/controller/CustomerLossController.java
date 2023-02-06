package com.lls.crm.controller;

import com.lls.crm.base.BaseController;
import com.lls.crm.base.ResultInfo;
import com.lls.crm.query.CustomerLossQuery;
import com.lls.crm.service.CustomerLossService;
import com.lls.crm.vo.CustomerLoss;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("customer_loss")
public class CustomerLossController extends BaseController {

    @Resource
    private CustomerLossService customerLossService;

    /**进入流失客户管理页面*/
    @RequestMapping("index")
    public String index (){
        return "customerLoss/customer_loss";
    }

    /**多条件分页查询流失客户列表*/
    @RequestMapping("list")
    @ResponseBody
    public Map<String,Object> queryCustomerLossByParams(CustomerLossQuery customerLossQuery){
        return customerLossService.queryCustomerLossByParams(customerLossQuery);
    }

    /**打开添加暂缓/详情页面*/
    @RequestMapping("toCustomerLossPage")
    //根据流失客户id查询流失客户记录，并设置到请求域中
    public String toCustomerLossPage (Integer customerLossId, HttpServletRequest request){
        if (customerLossId != null){
            CustomerLoss customerLoss = customerLossService.selectByPrimaryKey(customerLossId);
            request.setAttribute("customerLoss",customerLoss);
        }
        return "customerLoss/customer_rep";
    }

    /**更新流失客户的流失状态，设置为流失客户*/
    @RequestMapping("updateCustomerLossStateById")
    @ResponseBody
    public ResultInfo updateCustomerLossStateById(Integer id,String lossReason){
        customerLossService.updateCustomerLossStateById(id,lossReason);
        return success("将客户设置为流失客户操作成功");
    }
}
