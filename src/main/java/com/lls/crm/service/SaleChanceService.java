package com.lls.crm.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lls.crm.base.BaseQuery;
import com.lls.crm.base.BaseService;
import com.lls.crm.dao.SaleChanceMapper;
import com.lls.crm.enums.DevResult;
import com.lls.crm.enums.StateStatus;
import com.lls.crm.query.SaleChanceQuery;
import com.lls.crm.utils.AssertUtil;
import com.lls.crm.utils.PhoneUtil;
import com.lls.crm.vo.SaleChance;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SaleChanceService extends BaseService<SaleChance,Integer> {
    @Resource
    private SaleChanceMapper saleChanceMapper;

    //多条件分页查询营销机会数据
    public Map<String,Object> querySaleChanceByParams(SaleChanceQuery saleChanceQuery){
        Map<String,Object> map = new HashMap<>();
        //开启分页
        PageHelper.startPage(saleChanceQuery.getPage(),saleChanceQuery.getLimit());
        //得到分页对象(分页后的数据)
        PageInfo<SaleChance> pageInfo = new PageInfo<>(saleChanceMapper.selectByParams(saleChanceQuery));

        //返回的数据要放到layui的数据列表中，所以返回的数据要满足Layui数据列表的类型格式
        map.put("code",0);
        map.put("msg","success");
        map.put("count",pageInfo.getTotal());
        map.put("data",pageInfo.getList());
        return map;
    }

    /**
     * 添加营销机会记录
     *     1、参数校验
     *     2、设置默认值
     *     3、执行添加操作
     * @param saleChance
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void addSaleChance(SaleChance saleChance){
        // 1、参数校验(用户名、联系人、联系电话)
        checkSaleChanceParams(saleChance.getCustomerName(),saleChance.getLinkMan(),saleChance.getLinkPhone());
        //2、设置默认值
        //设置创建人默认值为当前登录用户(从cookie中获取，所以这个默认值就在controller层设置)
        saleChance.setIsValid(1);//是否有效
        saleChance.setCreateDate(new Date());//创建时间
        saleChance.setUpdateDate(new Date());//更新时间
        //是否设置分配人
        if (StringUtils.isBlank(saleChance.getAssignMan())){
            //未设置分配人
            saleChance.setState(StateStatus.UNSTATE.getType());//分配状态（0=未分配；1=已分配）
            saleChance.setAssignTime(null);//分配时间
            saleChance.setDevResult(DevResult.UNDEV.getStatus());//开发状态（0=未开发；1=已开发；2=开发成功；3=开发失败）默认未开发
        }else {
            //设置了分配人
            saleChance.setState(StateStatus.STATED.getType());//分配状态（0=未分配；1=已分配）
            saleChance.setAssignTime(new Date());//分配时间
            saleChance.setDevResult(DevResult.DEVING.getStatus());
        }
        //3、执行添加操作
        AssertUtil.isTrue(saleChanceMapper.insertSelective(saleChance) != 1,"营销机会添加失败");
    }

    /*添加营销机会-参数校验*/
    private void checkSaleChanceParams(String customerName, String linkMan, String linkPhone) {
        AssertUtil.isTrue(StringUtils.isBlank(customerName),"客户名不能为空");
        AssertUtil.isTrue(StringUtils.isBlank(linkMan),"联系人不能为空");
        AssertUtil.isTrue(StringUtils.isBlank(linkPhone),"联系号码不能为空");
        //手机号需满足规定的格式
        AssertUtil.isTrue(!PhoneUtil.isMobile(linkPhone),"手机号码格式不正确");

    }

    /**更新营销机会
     *    1、参数校验
     *        比添加多校验一个参数-要修改记录的id，并查询数据库中有无对应的记录
     *    2、相关参数默认值
     *        1、更新时间为系统当前时间
     *        2、分配人是否设置的4情况（以及其他对应的值：指派时间、分配状态、开发状态）
     *          原始数据未设置
     *              修改后未设置
     *              修改后已设置
     *          原始数据已设置
     *              修改后未设置
     *              修改后已设置
     *                 判断修改后是否是同一个分配人
     *                   如果是，设置默认指派时间（如果指派时间没有传值，则为原指派时间）
     *                   如果不是，则需要更新
     *
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void updateSaleChance(SaleChance saleChance){
        //1、参数校验
        AssertUtil.isTrue(null == saleChance.getId() ,"待更新记录不存在");
        SaleChance temp = saleChanceMapper.selectByPrimaryKey(saleChance.getId());
        AssertUtil.isTrue(null == temp,"待更新记录不存在");
        checkSaleChanceParams(saleChance.getCustomerName(),saleChance.getLinkMan(),saleChance.getLinkPhone());
        /*2、设置默认值*/
        //1、更新时间为系统当前时间
        saleChance.setUpdateDate(new Date());
        //2、分配人是否设置的4情况（以及其他对应的值：指派时间、分配状态、开发状态）
        if(StringUtils.isBlank(temp.getAssignMan())){
            if (!StringUtils.isBlank(saleChance.getAssignMan())){//修改前未设置、修改后有值
                saleChance.setState(StateStatus.STATED.getType());
                saleChance.setAssignTime(new Date());
                saleChance.setDevResult(DevResult.DEVING.getStatus());
            }//修改前后都为空，则不需要操作
        }else {
            if (StringUtils.isBlank(saleChance.getAssignMan())){//修改前已设置、修改后为空
                saleChance.setState(StateStatus.UNSTATE.getType());
                saleChance.setAssignTime(null);
                saleChance.setDevResult(DevResult.UNDEV.getStatus());
            }else {//修改前已设置、修改后又设置
                //判断修改后是否是同一个分配人
                if (!temp.getAssignMan().equals(saleChance.getAssignMan())){
                    saleChance.setUpdateDate(new Date());
                }else {//修改前已设置、修改后未设置（修改后未设置，则不会传递修改时间这个值，所以用原指派时间的值）
                    saleChance.setAssignTime(temp.getAssignTime());
                }
            }
        }
        //3、执行修改操作
        AssertUtil.isTrue(saleChanceMapper.updateByPrimaryKeySelective(saleChance) != 1,"营销机会更新失败！");
    }

    /*批量删除营销机会*/
    @Transactional(propagation = Propagation.REQUIRED)
    public void deleteSealChance(Integer[] ids){
        AssertUtil.isTrue(ids ==null && ids.length < 0,"待删除记录不存在");
        AssertUtil.isTrue(saleChanceMapper.deleteBatch(ids) < ids.length,"营销机会删除失败");
    }

    /**更改营销机会开发状态*/
    public void updateSaleChanceDevResult(Integer id, Integer devResult) {

        AssertUtil.isTrue(id == null,"待修改记录不存在");
        SaleChance saleChance = saleChanceMapper.selectByPrimaryKey(id);
        AssertUtil.isTrue(saleChance == null,"待修改记录不存在");
        AssertUtil.isTrue(devResult == null,"修改状态不能为空");
        saleChance.setDevResult(devResult);
        saleChanceMapper.updateByPrimaryKeySelective(saleChance);
    }
}
