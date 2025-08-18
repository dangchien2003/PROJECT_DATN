package com.example.notify.configuration;

import com.example.common.dto.other.ContextHolderDto;
import com.example.common.utils.context.UserContextHolder;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String userStr = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!userStr.equals("anonymousUser")) {
                ContextHolderDto context = objectMapper.readValue(userStr, ContextHolderDto.class);
                UserContextHolder.setContext(context);
            }
            filterChain.doFilter(request, response);
        } finally {
            UserContextHolder.clearContext(); // tránh memory leak
        }
    }
}