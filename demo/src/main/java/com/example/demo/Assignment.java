package com.example.demo;
public class Assignment {

    private String name;
    private String course;
    private String dueDate;
    private boolean isCompleted;
    private int urgency;
    private int estimatedTime;

    public Assignment() {
    }

    public Assignment(String name, String course, String dueDate, int urgency, int estimatedTime) {
        this.name = name;
        this.course = course;
        this.dueDate = dueDate;
        this.isCompleted = false;
        this.urgency = urgency;
        this.estimatedTime = estimatedTime;
    }

    public String getName() {
        return name;
    }

    public String getCourse() {
        return course;
    }

    public String getDueDate() {
        return dueDate;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public int getUrgency() {
        return urgency;
    }

    public int getEstimatedTime() {
        return estimatedTime;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }
}