package com.lls.crm.task;

import com.lls.crm.service.CustomerService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.SimpleFormatter;

@Component
public class JobTask {

    @Resource
    private CustomerService customerService;

    /**每2秒执行一次定时任务*/
    //@Scheduled(cron = "*/2 * * * * ?")
    public void job(){
        System.out.println("定时方法开始执行->" + new  SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        customerService.updateCustomerState();
    }

}
