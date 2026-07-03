package com.scms.controller;

import com.scms.model.Attendance;
import com.scms.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable String id) {
        return attendanceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Attendance> getAttendanceByStudent(@PathVariable String studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<Attendance> getAttendanceByCourse(@PathVariable String courseId) {
        return attendanceRepository.findByCourseId(courseId);
    }

    @PostMapping
    public Attendance recordAttendance(@RequestBody Attendance attendance) {
        if (attendance.getId() == null || attendance.getId().isEmpty()) {
            attendance.setId("ATT-" + System.currentTimeMillis());
        }
        return attendanceRepository.save(attendance);
    }

    @PostMapping("/batch")
    public List<Attendance> recordAttendanceBatch(@RequestBody List<Attendance> attendanceList) {
        for (Attendance att : attendanceList) {
            if (att.getId() == null || att.getId().isEmpty()) {
                att.setId("ATT-" + System.nanoTime());
            }
        }
        return attendanceRepository.saveAll(attendanceList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(@PathVariable String id, @RequestBody Attendance attendanceDetails) {
        return attendanceRepository.findById(id)
                .map(attendance -> {
                    attendance.setDate(attendanceDetails.getDate());
                    attendance.setStatus(attendanceDetails.getStatus());
                    attendance.setRemarks(attendanceDetails.getRemarks());
                    return ResponseEntity.ok(attendanceRepository.save(attendance));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable String id) {
        if (attendanceRepository.existsById(id)) {
            attendanceRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
