package com.scms.repository;

import com.scms.model.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, String> {
    List<Fee> findByStudentId(String studentId);
    List<Fee> findByStatus(String status);
}
