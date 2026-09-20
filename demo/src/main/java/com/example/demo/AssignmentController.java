package com.example.demo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AssignmentController {

    private List<Assignment> assignments = new ArrayList<>();

    @GetMapping
    public List<Assignment> getAssignments() {
        return assignments;
    }

    @PostMapping
    public Assignment addAssignment(@RequestBody Assignment assignment) {
        if (assignment.getId() == null || assignment.getId().isEmpty()) {
            assignment.setId(java.util.UUID.randomUUID().toString());
        }
        assignments.add(assignment);
        return assignment;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable String id, @RequestBody Assignment updated) {
        for (int i = 0; i < assignments.size(); i++) {
            if (assignments.get(i).getId().equals(id)) {
                updated.setId(id);
                assignments.set(i, updated);
                return ResponseEntity.ok(updated);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable String id) {
        boolean removed = assignments.removeIf(a -> a.getId().equals(id));
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}