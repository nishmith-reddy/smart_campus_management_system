package com.scms.controller;

import com.scms.model.Assignment;
import com.scms.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable String id) {
        return assignmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public List<Assignment> getAssignmentsByCourse(@PathVariable String courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    @PostMapping
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        if (assignment.getId() == null || assignment.getId().isEmpty()) {
            assignment.setId("ASM-" + System.currentTimeMillis());
        }
        return assignmentRepository.save(assignment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable String id, @RequestBody Assignment assignmentDetails) {
        return assignmentRepository.findById(id)
                .map(assignment -> {
                    assignment.setTitle(assignmentDetails.getTitle());
                    assignment.setDescription(assignmentDetails.getDescription());
                    assignment.setDueDate(assignmentDetails.getDueDate());
                    assignment.setMaxPoints(assignmentDetails.getMaxPoints());
                    return ResponseEntity.ok(assignmentRepository.save(assignment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable String id) {
        if (assignmentRepository.existsById(id)) {
            assignmentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
