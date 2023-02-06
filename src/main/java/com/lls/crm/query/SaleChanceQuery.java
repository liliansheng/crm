package com.lls.crm.query;

import com.lls.crm.base.BaseQuery;

/**
 *营销机会的查询类
 */
public class SaleChanceQuery extends BaseQuery {

    //分页参数（由继承类获得）

    //营销机会管理    条件参数
    private String customerName;//客户名
    private String createMan;//创始人
    private Integer state;//分配状态

    //客户开发计划    条件参数（以及上面的三个）
    private String devResult; //开发状态
    private Integer assignMan; //指派人


    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCreateMan() {
        return createMan;
    }

    public void setCreateMan(String createMan) {
        this.createMan = createMan;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }



    public String getDevResult() {
        return devResult;
    }

    public void setDevResult(String devResult) {
        this.devResult = devResult;
    }

    public Integer getAssignMan() {
        return assignMan;
    }

    public void setAssignMan(Integer assignMan) {
        this.assignMan = assignMan;
    }
}
