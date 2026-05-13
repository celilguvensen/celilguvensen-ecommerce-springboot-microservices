package com.commonsecurity;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Bean
    public FilterRegistrationBean<SecurityHeaderFilter> securityHeaderFilter() {
        FilterRegistrationBean<SecurityHeaderFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new SecurityHeaderFilter());
        registrationBean.addUrlPatterns("/api/*");  
        registrationBean.setOrder(1);  
        return registrationBean;
    }
}