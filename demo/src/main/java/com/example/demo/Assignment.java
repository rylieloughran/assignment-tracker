package com.example.demo;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Assignment {

    private String id;
    private String title;
    private String courseName;
    private String dueDate;
    private boolean completed;
    
    // Set to Integer wrapper class for clean numeric sorting (1, 2, 3, 4)
    private Integer urgency; 
    private Integer estimatedTime;
    
    private List<Subtask> subtasks = new ArrayList<>();

    public Assignment() {
        this.id = UUID.randomUUID().toString();
    }

    public Assignment(String title, String courseName, String dueDate,
                      Integer urgency, Integer estimatedTime) {
        this.title = title;
        this.courseName = courseName;
        this.dueDate = dueDate;
        this.completed = false;
        this.urgency = urgency;
        this.estimatedTime = estimatedTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Integer getUrgency() {
        return urgency;
    }

    public void setUrgency(Integer urgency) {
        this.urgency = urgency;
    }

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public List<Subtask> getSubtasks() {
        return subtasks;
    }

    public void setSubtasks(List<Subtask> subtasks) {
        this.subtasks = subtasks;
    }
}