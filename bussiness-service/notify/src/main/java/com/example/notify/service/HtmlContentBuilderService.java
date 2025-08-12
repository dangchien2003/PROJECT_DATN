package com.example.notify.service;

import java.util.Map;

public interface HtmlContentBuilderService {
    String buildHtml(String templateName, Map<String, Object> variables);
}
