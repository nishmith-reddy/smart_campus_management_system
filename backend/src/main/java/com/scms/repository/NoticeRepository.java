package com.scms.repository;

import com.scms.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, String> {
    List<Notice> findByCategory(String category);
    List<Notice> findAllByOrderByDateDesc();
}
