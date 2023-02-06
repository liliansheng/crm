package com.lls.crm.interceptor;

import com.lls.crm.dao.UserMapper;
import com.lls.crm.exceptions.NoLoginException;
import com.lls.crm.utils.CookieUtil;
import com.lls.crm.utils.LoginUserUtil;
import com.lls.crm.vo.User;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class NoLoginInterceptor extends HandlerInterceptorAdapter {
    @Resource
    private UserMapper userMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        Integer userId = LoginUserUtil.releaseUserIdFromCookie(request);
        User user = userMapper.selectByPrimaryKey(userId);

        if (userId == null || user == null ){
            throw new NoLoginException();
        }
        return true;
    }
}
