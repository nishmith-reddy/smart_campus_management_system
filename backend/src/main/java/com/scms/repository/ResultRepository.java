package com.scms.repository;

import com.scms.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, String> {
    List<Result> findByStudentId(String studentId);
    List<Result> findByCourseId(String courseId);
    List<Result> findByStudentIdAndCourseId(String studentId, String courseId);
}
