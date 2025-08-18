package com.example.common.utils.context;


import com.example.common.dto.other.ContextHolderDto;

public class UserContextHolder {
    private static final ThreadLocal<ContextHolderDto> userContext = new InheritableThreadLocal<>();

    public static ContextHolderDto getContext() {
        ContextHolderDto context = userContext.get();

        if (context == null) {
            context = createEmptyContext();
            userContext.set(context);

        }
        return userContext.get();
    }

    public static void setContext(ContextHolderDto context) {
        userContext.set(context);
    }

    public static ContextHolderDto createEmptyContext() {
        return new ContextHolderDto();
    }

    public static void clearContext() {
        userContext.remove();
    }
}
