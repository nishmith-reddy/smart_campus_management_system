package com.scms.controller;

import com.scms.model.Result;
import com.scms.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultRepository resultRepository;

    @GetMapping
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(@PathVariable String id) {
        return resultRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Result> getResultsByStudent(@PathVariable String studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<Result> getResultsByCourse(@PathVariable String courseId) {
        return resultRepository.findByCourseId(courseId);
    }

    @PostMapping
    public Result recordResult(@RequestBody Result result) {
        if (result.getId() == null || result.getId().isEmpty()) {
            result.setId("RST-" + System.currentTimeMillis());
        }
        return resultRepository.save(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result> updateResult(@PathVariable String id, @RequestBody Result resultDetails) {
        return resultRepository.findById(id)
                .map(result -> {
                    result.setExamType(resultDetails.getExamType());
                    result.setMarksObtained(resultDetails.getMarksObtained());
                    result.setMaxMarks(resultDetails.getMaxMarks());
                    result.setGrade(resultDetails.getGrade());
                    result.setRemarks(resultDetails.getRemarks());
                    return ResponseEntity.ok(resultRepository.save(result));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable String id) {
        if (resultRepository.existsById(id)) {
            resultRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
