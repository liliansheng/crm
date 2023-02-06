package com.lls.crm.config;

import com.lls.crm.interceptor.NoLoginInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
@Configuration//加此注解表示当前类为配置类（相当于mapper文件）
public class MvcConfig extends WebMvcConfigurerAdapter {
    @Bean//交给IOC实例化此对象
    public NoLoginInterceptor getInterceptor(){
        return new NoLoginInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //需要一个实现了拦截器功能的实例对象，这里用的是上面的方法，getInterceptor()，
        registry.addInterceptor(getInterceptor())
                //拦截资源
                .addPathPatterns("/**")
                //放行的资源（不需要被拦截的资源）静态资源、首页、登录操作、注册页面
                .excludePathPatterns("/css/**","/js/**","/images/**","/lib/**","/index","/user/login","/user/enrollPage");
    }
}
