package com.lls.crm.query;

import com.lls.crm.base.BaseQuery;

/**
 * 客户开发计划查询类
 */
public class CusDevPlanQuery extends BaseQuery {

    private Integer saleChanceId;//营销机会的主键

    public Integer getSaleChanceId() {
        return saleChanceId;
    }

    public void setSaleChanceId(Integer saleChanceId) {
        this.saleChanceId = saleChanceId;
    }
}
