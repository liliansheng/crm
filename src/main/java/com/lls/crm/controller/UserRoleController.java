package com.lls.crm.controller;

import com.lls.crm.base.BaseController;
import com.lls.crm.service.UserRoleService;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;

@RequestMapping("user_role")
public class UserRoleController extends BaseController {

    @Resource
    private UserRoleService userRoleService;



}
