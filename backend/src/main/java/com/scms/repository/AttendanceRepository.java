package com.scms.repository;

import com.scms.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findByCourseId(String courseId);
    List<Attendance> findByStudentIdAndCourseId(String studentId, String courseId);
    List<Attendance> findByCourseIdAndDate(String courseId, LocalDate date);
}
