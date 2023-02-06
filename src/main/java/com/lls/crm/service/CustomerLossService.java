package com.lls.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lls.crm.base.BaseService;
import com.lls.crm.dao.CustomerLossMapper;
import com.lls.crm.query.CustomerLossQuery;
import com.lls.crm.query.CustomerOrderQuery;
import com.lls.crm.utils.AssertUtil;
import com.lls.crm.vo.CustomerLoss;
import com.lls.crm.vo.CustomerOrder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class CustomerLossService extends BaseService<CustomerLoss,Integer> {

    @Resource
    private CustomerLossMapper customerLossMapper;

    /**多条件分页查询流失客户列表*/
    public Map<String, Object> queryCustomerLossByParams(CustomerLossQuery customerLossQuery) {
        Map<String,Object> map = new HashMap<>();
        //开启分页
        PageHelper.startPage(customerLossQuery.getPage(),customerLossQuery.getLimit());
        //得到分页对象(分页后的数据)
        PageInfo<CustomerLoss> pageInfo = new PageInfo<>(customerLossMapper.selectByParams(customerLossQuery));

        //返回的数据要放到layui的数据列表中，所以返回的数据要满足Layui数据列表的类型格式
        map.put("code",0);
        map.put("msg","success");
        map.put("count",pageInfo.getTotal());
        map.put("data",pageInfo.getList());
        return map;
    }


    /**更新流失客户的流失状态，设置为流失客户
     *  1、参数校验
     *          流失客户id 非空且数据存在
     *          流失原因   非空
     *  2、设置参数默认值
     *          流失状态state=1     0=暂缓流失  1=确认流失
     *          流失时间    系统当前时间
     *          更新时间    系统当前时间
     *          流失原因    设为参数lossReason
     *  3、执行更新操作，判断受影响的行数
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void updateCustomerLossStateById(Integer id, String lossReason) {
        AssertUtil.isTrue(id == null ,"待确认流失的客户不存在");
        CustomerLoss customerLoss = customerLossMapper.selectByPrimaryKey(id);
        AssertUtil.isTrue(customerLoss == null,"待确认流失的客户不存在");
        AssertUtil.isTrue(StringUtils.isBlank(lossReason),"流失原因不能为空");

        customerLoss.setState(1);
        customerLoss.setConfirmLossTime(new Date());
        customerLoss.setUpdateDate(new Date());
        customerLoss.setLossReason(lossReason);

        AssertUtil.isTrue(customerLossMapper.updateByPrimaryKeySelective(customerLoss) < 1,"将客户设置为流失客户操作失败");
    }
}
