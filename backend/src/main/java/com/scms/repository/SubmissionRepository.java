package com.scms.repository;

import com.scms.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByStudentId(String studentId);
    List<Submission> findByAssignmentId(String assignmentId);
    List<Submission> findByAssignmentIdAndStudentId(String assignmentId, String studentId);
}
