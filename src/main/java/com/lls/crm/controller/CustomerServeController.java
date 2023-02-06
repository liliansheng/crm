package com.lls.crm.controller;

import com.lls.crm.base.BaseController;
import com.lls.crm.base.ResultInfo;
import com.lls.crm.query.CustomerReprieveQuery;
import com.lls.crm.query.CustomerServeQuery;
import com.lls.crm.service.CustomerReprieveService;
import com.lls.crm.service.CustomerServeService;
import com.lls.crm.utils.LoginUserUtil;
import com.lls.crm.vo.CustomerServe;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RequestMapping("customer_serve")
@Controller
public class CustomerServeController extends BaseController {

    @Resource
    private CustomerServeService customerServeService;

    /**多条件分页查询客户服务数据列表*/
    @RequestMapping("list")
    @ResponseBody
    public Map<String,Object> queryCustomerServeByParams(CustomerServeQuery customerServeQuery,
                                                         Integer flag,
                                                         HttpServletRequest request){
        //判断是否是查询分配处理，如果是则进行查询当前登录用户对应的服务记录
        if (flag != null && flag == 1){
            //获取当前登录用户的cookie值，设置为（客户的）指派人
            customerServeQuery.setAssigner(LoginUserUtil.releaseUserIdFromCookie(request));
            return customerServeService.queryCustomerServeByParams(customerServeQuery);
        }
        return customerServeService.queryCustomerServeByParams(customerServeQuery);
    }

    /**通过不同的服务类型进入不同的服务页面(五个页面基本相同，写一个方法就好了，通过判断路径参数进入到不同的页面)*/
    @RequestMapping("index/{type}")//type为路径参数
    private String index(@PathVariable Integer type){
        if (type != null){
          if (type == 1){
              //服务创建
              return "customerServe/customer_serve";
          }else if (type == 2){
              //服务分配
              return "customerServe/customer_serve_assign";
          }else if (type == 3){
              //服务处理
              return "customerServe/customer_serve_proce";
          }else if (type == 4){
              //服务反馈
              return "customerServe/customer_serve_feed_back";
          }else if (type == 5){
              //服务归档
              return "customerServe/customer_serve_archive";
          }else {
              return "";
          }

        }else {
            return "";
        }
        //return "";
    }

    /**进入添加客户服务窗口*/
    @RequestMapping("toAddCustomerServePage")
    public String addCustomerServePage(){
        return "customerServe/customer_serve_add";
    }

    /**创建服务*/
    @RequestMapping("add")
    @ResponseBody
    public ResultInfo addCustomerServe(CustomerServe customerServe){
        customerServeService.addCustomerServe(customerServe);
        return success("添加服务-成功");
    }

    /**
     *  服务更新（三个操作共用一个方法）
     *    1、服务分配
     *    2、服务处理
     *    3、服务反馈
     * @param customerServe
     * @return
     */
    @RequestMapping("update")
    @ResponseBody
    public ResultInfo updateCustomerServe(CustomerServe customerServe){
        customerServeService.updateCustomerServe(customerServe);
        return success("服务更新-成功");
    }

     /**进入添加指派人页面*/
    @RequestMapping("toAddCustomerServeAssignPage")
    public String updateCustomerServe(Integer id, HttpServletRequest request){
        if (id != null){
            CustomerServe customerServe = customerServeService.selectByPrimaryKey(id);
            request.setAttribute("customerServe",customerServe);
        }
        return "customerServe/customer_serve_assign_add";
    }

    /**进入服务处理页面*/
    @RequestMapping("addCustomerServeProcePage")
    public String addCustomerServeProcePage(Integer id,Model model){
        if (id != null){
            CustomerServe customerServe = customerServeService.selectByPrimaryKey(id);
            model.addAttribute("customerServe",customerServe);
        }
        return "customerServe/customer_serve_proce_add";
    }

    /**进入服务反馈页面*/
    @RequestMapping("addCustomerServeBackPage")
    public String addCustomerServeBackPage(Integer id,Model model){
        if (id != null){
            CustomerServe customerServe = customerServeService.selectByPrimaryKey(id);
            model.addAttribute("customerServe",customerServe);
        }
        return "customerServe/customer_serve_feed_back_add";
    }
}
