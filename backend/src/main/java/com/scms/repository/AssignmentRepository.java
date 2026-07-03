package com.scms.repository;

import com.scms.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, String> {
    List<Assignment> findByCourseId(String courseId);
    List<Assignment> findByCreatedBy(String createdBy);
}
