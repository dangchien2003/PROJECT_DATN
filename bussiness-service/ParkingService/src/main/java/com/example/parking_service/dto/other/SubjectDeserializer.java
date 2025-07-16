package com.example.parking_service.dto.other;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class SubjectDeserializer extends JsonDeserializer<SubjectAccessToken> {
    @Override
    public SubjectAccessToken deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException {
        String subjectString = p.getValueAsString();
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(subjectString, SubjectAccessToken.class);
    }
}
