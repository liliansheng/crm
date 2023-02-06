package com.lls.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lls.crm.base.BaseService;
import com.lls.crm.dao.CustomerMapper;
import com.lls.crm.dao.CustomerServeMapper;
import com.lls.crm.dao.UserMapper;
import com.lls.crm.enums.CustomerServeStatus;
import com.lls.crm.query.CustomerServeQuery;
import com.lls.crm.utils.AssertUtil;
import com.lls.crm.vo.Customer;
import com.lls.crm.vo.CustomerReprieve;
import com.lls.crm.vo.CustomerServe;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class CustomerServeService extends BaseService<CustomerServe,Integer> {

    @Resource
    private CustomerServeMapper customerServeMapper;
    @Resource
    private CustomerMapper customerMapper;
    @Resource
    private UserMapper userMapper;

    /**多条件分页查询客户服务数据列表*/
    public Map<String, Object> queryCustomerServeByParams(CustomerServeQuery customerServeQuery) {
        Map<String,Object> map = new HashMap<>();
        //开启分页
        PageHelper.startPage(customerServeQuery.getPage(),customerServeQuery.getLimit());
        //得到分页对象(分页后的数据)
        PageInfo<CustomerServe> pageInfo = new PageInfo<>(customerServeMapper.selectByParams(customerServeQuery));

        //返回的数据要放到layui的数据列表中，所以返回的数据要满足Layui数据列表的类型格式
        map.put("code",0);
        map.put("msg","success");
        map.put("count",pageInfo.getTotal());
        map.put("data",pageInfo.getList());
        return map;
    }

    /**添加服务
       1、参数校验
          客户名 customer
               非空且客户表中存在客户记录
          服务类型  serveType
               非空
          服务请求内容  serveRequest
               非空
       2、设置参数默认值
            服务状态
                 服务创建状态  fw_001
            是否有效     state=1
            创建时间     当前系统时间
            更新时间     当前系统时间
            创建人       前端页面中通过从cookie中获取，传递到后台
       3、执行添加操作，判断受影响的行数
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void addCustomerServe(CustomerServe customerServe) {
        AssertUtil.isTrue(customerServe.getCustomer() == null,"添加服务客户名不能为空");
        Customer customer = customerMapper.selectCustomerByCustomerName(customerServe.getCustomer());
        AssertUtil.isTrue(customer == null,"添加服务需要有对应的客户记录存在");
        AssertUtil.isTrue(StringUtils.isBlank(customerServe.getServeType()),"请选择服务类型");
        AssertUtil.isTrue(StringUtils.isBlank(customerServe.getServiceRequest()),"服务请求内容不能为空");

        customerServe.setState(CustomerServeStatus.CREATED.getState());
        customerServe.setIsValid(1);
        customerServe.setCreateDate(new Date());
        customerServe.setUpdateDate(new Date());

        AssertUtil.isTrue(customerServeMapper.insertSelective(customerServe) < 1,"服务添加失败");
    }

    /**
     * 服务分配/服务处理/服务反馈(前端三个按钮对客户服务不同字段的更新操作)
     *   1、参数校验与设置参数默认值
     *      客户服务ID
     *          非空，记录必须存在
     *      客户服务状态
     *          如果服务状态为  服务分配状态  fw_002
     *              分配人
     *                  非空，分配用户记录存在
     *              分配时间
     *                  系统当前时间
     *              更新时间
     *                  系统当前时间
     *
     *          如果服务状态为  服务处理状态  fw_003
     *              服务处理内容
     *                  非空
     *              服务处理时间
     *                  系统当前时间
     *              更新时间
     *                  系统当前时间
     *
     *          如果服务状态为  服务反馈状态  fw_004
     *              服务反馈内容
     *                  非空
     *              服务满意度
     *                  非空
     *              更新时间
     *                  系统当前时间
     *              服务状态
     *                  设置为 服务归档状态  fw_005
     *   2、执行更新操作，判断受影响的行数
     * @param customerServe
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void updateCustomerServe(CustomerServe customerServe) {
        AssertUtil.isTrue(customerServe.getId() == null
                || customerServeMapper.selectByPrimaryKey(customerServe.getId()) == null,"待更新服务记录不存在");
        if (CustomerServeStatus.ASSIGNED.getState().equals(customerServe.getState())){
            //服务分配操作
            AssertUtil.isTrue(customerServe.getAssigner() == null,"待分配用户不能为空");
            AssertUtil.isTrue(userMapper.selectByPrimaryKey(Integer.parseInt(customerServe.getAssigner())) == null,"待分配用户记录不存在");
            customerServe.setAssignTime(new Date());
            customerServe.setUpdateDate(new Date());
        }else if (CustomerServeStatus.PROCED.getState().equals(customerServe.getState())){
            //服务处理操作
            AssertUtil.isTrue(StringUtils.isBlank(customerServe.getServiceProce()),"服务处理内容不能为空");
            customerServe.setServiceProceTime(new Date());
            customerServe.setUpdateDate(new Date());
        }else if (CustomerServeStatus.FEED_BACK.getState().equals(customerServe.getState())){
            //服务反馈操作
            AssertUtil.isTrue(StringUtils.isBlank(customerServe.getServiceProceResult()),"服务反馈内容不能为空");
            AssertUtil.isTrue(StringUtils.isBlank(customerServe.getMyd()),"服务满意度不能为空");
            customerServe.setUpdateDate(new Date());
            customerServe.setState(CustomerServeStatus.ARCHIVED.getState());
        }
        AssertUtil.isTrue(customerServeMapper.updateByPrimaryKeySelective(customerServe) < 1,"服务更新操作失败（服务分配/服务处理/服务反馈）");

    }
}
