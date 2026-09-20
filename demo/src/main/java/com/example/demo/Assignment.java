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
    private int assignmentUrgency;
    private int estimatedTime;
    private List<Subtask> subtasks = new ArrayList<>();

    public Assignment() {
        this.id = UUID.randomUUID().toString();
    }

    public Assignment(String title, String courseName, String dueDate,
                      int assignmentUrgency, int estimatedTime) {
        this.title = title;
        this.courseName = courseName;
        this.dueDate = dueDate;
        this.completed = false;
        this.assignmentUrgency = assignmentUrgency;
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

    public int getAssignmentUrgency() {
        return assignmentUrgency;
    }

    public void setAssignmentUrgency(int assignmentUrgency) {
        this.assignmentUrgency = assignmentUrgency;
    }

    public int getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(int estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public List<Subtask> getSubtasks() {
        return subtasks;
    }

    public void setSubtasks(List<Subtask> subtasks) {
        this.subtasks = subtasks;
    }
}