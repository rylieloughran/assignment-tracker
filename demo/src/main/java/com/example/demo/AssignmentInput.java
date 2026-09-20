package com.example.demo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AssignmentInput {

    public String id;
    public String title;
    public String courseName;
    public String dueDate;
}