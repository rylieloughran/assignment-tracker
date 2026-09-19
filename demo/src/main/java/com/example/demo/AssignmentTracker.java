package com.example.demo;
import java.util.ArrayList;

public class AssignmentTracker {
    private ArrayList<Assignment> assignments;

    public AssignmentTracker() {
        assignments = new ArrayList<>();
    }

    public void addAssignment(Assignment assignment) {
        assignments.add(assignment);
    }

    public void removeAssignment(Assignment assignment) {
        assignments.remove(assignment);
    }

    public Assignment getAssignment(int index) {
        return assignments.get(index);
    }

}
