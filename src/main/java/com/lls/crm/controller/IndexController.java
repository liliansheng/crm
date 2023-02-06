package com.lls.crm.controller;

import com.lls.crm.base.BaseController;
import com.lls.crm.dao.PermissionMapper;
import com.lls.crm.service.PermissionService;
import com.lls.crm.service.UserService;
import com.lls.crm.utils.LoginUserUtil;
import com.lls.crm.vo.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class IndexController extends BaseController {
    @Resource
    private UserService userService;
    @Resource
    private PermissionService permissionService;//用于查询当前登录用户拥有的权限码

    /**
     * 系统登录页
     * @return
     */
    @GetMapping("index")
    public String index(){
        return "index";
    }

    // 系统界面欢迎页
    @RequestMapping("welcome")
    public String welcome(){
        return "welcome";
    }
    /**
     * 后端管理主页面
     * @return
     */
    @RequestMapping("main")
    public String main(HttpServletRequest request){
        Integer userId = LoginUserUtil.releaseUserIdFromCookie(request);
        User user = userService.selectByPrimaryKey(userId);
        request.getSession().setAttribute("user",user);

        /**通过当前登录用户的ID查询当前登录用户拥有的资源列表（查询对应资源的权限码）*/
        List<String> permissions = permissionService.queryUserHasRoleHasPermissionByUserId(userId);
        request.getSession().setAttribute("permissions",permissions);
        return "main";
    }
}
