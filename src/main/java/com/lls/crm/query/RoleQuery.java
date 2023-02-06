package com.lls.crm.query;

import com.lls.crm.base.BaseQuery;

public class RoleQuery extends BaseQuery {

    /*有哪些查询条件就设置哪些属性，已继承分布属性*/
    private String roleName;//角色名

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}

