package com.lls.crm.query;

import com.lls.crm.base.BaseQuery;

import javax.management.Query;

/**多条件分页查询订单表的封装类*/
public class CustomerOrderQuery extends BaseQuery {

    private Integer cusId;//客户id

    public Integer getCusId() {
        return cusId;
    }

    public void setCusId(Integer cusId) {
        this.cusId = cusId;
    }
}
