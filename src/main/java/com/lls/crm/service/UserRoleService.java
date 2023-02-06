package com.lls.crm.service;

import com.lls.crm.base.BaseService;
import com.lls.crm.dao.UserRoleMapper;
import com.lls.crm.vo.UserRole;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class UserRoleService extends BaseService<UserRole,Integer> {

    @Resource
    private UserRoleMapper userRoleMapper;
}
