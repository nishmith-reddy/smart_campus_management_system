package com.scms.controller;

import com.scms.model.Faculty;
import com.scms.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @Autowired
    private FacultyRepository facultyRepository;

    @GetMapping
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getFacultyById(@PathVariable String id) {
        return facultyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Faculty> getFacultyByUserId(@PathVariable String userId) {
        return facultyRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Faculty createFaculty(@RequestBody Faculty faculty) {
        if (faculty.getId() == null || faculty.getId().isEmpty()) {
            faculty.setId("FAC-" + System.currentTimeMillis());
        }
        return facultyRepository.save(faculty);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> updateFaculty(@PathVariable String id, @RequestBody Faculty facultyDetails) {
        return facultyRepository.findById(id)
                .map(faculty -> {
                    faculty.setName(facultyDetails.getName());
                    faculty.setEmail(facultyDetails.getEmail());
                    faculty.setEmployeeId(facultyDetails.getEmployeeId());
                    faculty.setDepartment(facultyDetails.getDepartment());
                    faculty.setDesignation(facultyDetails.getDesignation());
                    faculty.setSpecialization(facultyDetails.getSpecialization());
                    faculty.setContact(facultyDetails.getContact());
                    return ResponseEntity.ok(facultyRepository.save(faculty));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculty(@PathVariable String id) {
        if (facultyRepository.existsById(id)) {
            facultyRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
