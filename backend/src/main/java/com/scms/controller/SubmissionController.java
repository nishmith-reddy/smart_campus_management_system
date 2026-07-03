package com.scms.controller;

import com.scms.model.Submission;
import com.scms.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable String id) {
        return submissionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Submission> getSubmissionsByStudent(@PathVariable String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getSubmissionsByAssignment(@PathVariable String assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @PostMapping
    public Submission createSubmission(@RequestBody Submission submission) {
        if (submission.getId() == null || submission.getId().isEmpty()) {
            submission.setId("SUB-" + System.currentTimeMillis());
        }
        return submissionRepository.save(submission);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Submission> updateSubmission(@PathVariable String id, @RequestBody Submission submissionDetails) {
        return submissionRepository.findById(id)
                .map(submission -> {
                    submission.setContent(submissionDetails.getContent());
                    submission.setStatus(submissionDetails.getStatus());
                    submission.setPointsObtained(submissionDetails.getPointsObtained());
                    submission.setGradeRemarks(submissionDetails.getGradeRemarks());
                    return ResponseEntity.ok(submissionRepository.save(submission));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable String id) {
        if (submissionRepository.existsById(id)) {
            submissionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
