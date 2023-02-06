package com.lls.crm.controller;

import com.lls.crm.annotation.RequiredPermission;
import com.lls.crm.base.BaseController;
import com.lls.crm.base.ResultInfo;
import com.lls.crm.enums.DevResult;
import com.lls.crm.enums.StateStatus;
import com.lls.crm.query.SaleChanceQuery;
import com.lls.crm.service.SaleChanceService;
import com.lls.crm.utils.CookieUtil;
import com.lls.crm.utils.LoginUserUtil;
import com.lls.crm.vo.SaleChance;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("sale_chance")
public class SaleChanceController extends BaseController {
    @Resource
    private SaleChanceService saleChanceService;

    /**多条件查询的数据  权限码：101001 */
    @RequestMapping("list")
    @ResponseBody
    @RequiredPermission(code = "101001")//登录用户有接口对应的权限（码）才能访问此接口
    public Map<String,Object> querySaleChanceByParams(SaleChanceQuery saleChanceQuery,
                                                      HttpServletRequest request,
                                                      Integer flag){
        //根据前台传递的flag的值，来判断是查询营销机会的数据还是查询开发计划(已分配)的数据
        if (null != flag && flag == 1){
            Integer userId = LoginUserUtil.releaseUserIdFromCookie(request);
            saleChanceQuery.setAssignMan(userId);
            saleChanceQuery.setState(StateStatus.STATED.getType());
            //saleChanceService.querySaleChanceByParams(saleChanceQuery);
        }
        return saleChanceService.querySaleChanceByParams(saleChanceQuery);
    }

    /**进入营销机会管理页面 权限码：1010  */
    @RequiredPermission(code = "1010")
    @RequestMapping("index")
    public String index(){
        return "saleChance/sale_chance";
    }

    /**添加营销机会数据  权限码：101002 */
    @RequiredPermission(code = "101002")
    @PostMapping("add")
    @ResponseBody
    public ResultInfo addSaleChance(SaleChance saleChance, HttpServletRequest request){
        //从Cookie中获取当前登录用户，（设置创建人默认值为当前登录用户名）
         String userName = CookieUtil.getCookieValue(request,"userName");
         saleChance.setCreateMan(userName);
         saleChanceService.addSaleChance(saleChance);
         return success("营销机会添加成功");
    }

    /**进入添加、修改营销机会页面 权限码： */
    @RequestMapping("toSaleChancePage")
    public String toSaleChancePage(Integer saleChanceId,HttpServletRequest request){
        if (saleChanceId != null){
            SaleChance saleChance = saleChanceService.selectByPrimaryKey(saleChanceId);
            request.setAttribute("saleChance",saleChance);
        }

        return "saleChance/add_update";
    }

    /**更新营销机会数据 权限码：101004 */
    @RequiredPermission(code = "101004")
    @RequestMapping("update")
    @ResponseBody
    public ResultInfo updateSaleChance(SaleChance saleChance){
        //执行更新操作，创建人有值，不需要设置（与添加营销机会的区别）
        saleChanceService.updateSaleChance(saleChance);
        return success("营销机会更新成功");
    }

    /**批量删除营销机会 权限码： 101003 */
    @RequiredPermission(code = "101003")
    @RequestMapping("delete")
    @ResponseBody
    public ResultInfo deleteSealChance(Integer[] ids){
        //执行更新操作，创建人有值，不需要设置（与添加营销机会的区别）
        saleChanceService.deleteSealChance(ids);
        return success("营销机会删除成功");
    }

    /**更改营销机会开发状态 权限码：   */
    @RequestMapping("updateSaleChanceDevResult")
    @ResponseBody
    public ResultInfo updateSaleChanceDevResult(Integer id,Integer devResult){
        saleChanceService.updateSaleChanceDevResult(id,devResult);
        return success("营销机会开发状态更新成功！");
    }
}
