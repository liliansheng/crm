package com.lls.crm.dao;

import com.lls.crm.base.BaseMapper;
import com.lls.crm.vo.UserRole;

public interface UserRoleMapper extends BaseMapper<UserRole,Integer> {

    /**根据用户ID查询用户角色记录总数*/
    Integer queryUserRoleByUserId(Integer userId);

    /**根据用户ID删除用户角色表中用户关联的角色*/
    Integer deleteUserRoleByUserId(Integer userId);

    /**添加方法已有，这里就不写了，在mapper中写对应的方法就好了*/
}