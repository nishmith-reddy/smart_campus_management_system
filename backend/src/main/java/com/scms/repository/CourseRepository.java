package com.scms.repository;

import com.scms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    Optional<Course> findByCode(String code);
    List<Course> findByDepartment(String department);
    List<Course> findByFacultyId(String facultyId);
}
