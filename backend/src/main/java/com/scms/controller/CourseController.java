package com.scms.controller;

import com.scms.model.Course;
import com.scms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{department}")
    public List<Course> getCoursesByDepartment(@PathVariable String department) {
        return courseRepository.findByDepartment(department);
    }

    @GetMapping("/faculty/{facultyId}")
    public List<Course> getCoursesByFacultyId(@PathVariable String facultyId) {
        return courseRepository.findByFacultyId(facultyId);
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        if (course.getId() == null || course.getId().isEmpty()) {
            course.setId("CRS-" + System.currentTimeMillis());
        }
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course courseDetails) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setCode(courseDetails.getCode());
                    course.setName(courseDetails.getName());
                    course.setDepartment(courseDetails.getDepartment());
                    course.setCredits(courseDetails.getCredits());
                    course.setSemester(courseDetails.getSemester());
                    course.setSyllabus(courseDetails.getSyllabus());
                    course.setFacultyId(courseDetails.getFacultyId());
                    return ResponseEntity.ok(courseRepository.save(course));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
