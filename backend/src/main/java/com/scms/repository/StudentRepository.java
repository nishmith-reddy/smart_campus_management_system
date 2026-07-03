package com.scms.repository;

import com.scms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByUserId(String userId);
    List<Student> findByDepartment(String department);
}
