package com.example.demo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private List<Assignment> assignments = new ArrayList<>();

    @GetMapping
    public List<Assignment> getAssignments() {
        return assignments;
    }

    @PostMapping
    public Assignment addAssignment(@RequestBody Assignment assignment) {
        assignments.add(assignment);
        return assignment;
    }
}