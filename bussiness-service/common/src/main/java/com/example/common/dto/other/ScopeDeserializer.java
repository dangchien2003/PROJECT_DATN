package com.example.common.dto.other;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ScopeDeserializer extends JsonDeserializer<List<String>> {
    @Override
    public List<String> deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException {
        String scopeString = p.getValueAsString();

        // Nếu null hoặc rỗng trả về empty list
        if (scopeString == null || scopeString.isEmpty()) {
            return Collections.emptyList();
        }

        // Split và trim
        return Arrays.stream(scopeString.split(","))
                .map(String::trim)
                .collect(Collectors.toList());
    }
}