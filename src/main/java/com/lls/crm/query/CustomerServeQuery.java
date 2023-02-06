package com.lls.crm.query;

import com.lls.crm.base.BaseQuery;

public class CustomerServeQuery extends BaseQuery {
    private String customer;//客户名称
    private Integer serveType;//服务类型
    private String state;//服务状态   服务创建=fw_001  服务分配=fw_002  服务处理=fw_003  服务反馈=fw_004  服务归档=fw_005

    private Integer assigner;//分配人 服务管理根据分配人来查询(因为获取cookie方法用的为整型，要么这里用带整型，要么重写方法转类型)

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public Integer getServeType() {
        return serveType;
    }

    public void setServeType(Integer serveType) {
        this.serveType = serveType;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getAssigner() {
        return assigner;
    }

    public void setAssigner(Integer assigner) {
        this.assigner = assigner;
    }
}
