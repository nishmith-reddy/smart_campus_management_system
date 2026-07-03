package com.scms.controller;

import com.scms.model.Notice;
import com.scms.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    @Autowired
    private NoticeRepository noticeRepository;

    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByDateDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable String id) {
        return noticeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Notice createNotice(@RequestBody Notice notice) {
        if (notice.getId() == null || notice.getId().isEmpty()) {
            notice.setId("NTC-" + System.currentTimeMillis());
        }
        return noticeRepository.save(notice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable String id, @RequestBody Notice noticeDetails) {
        return noticeRepository.findById(id)
                .map(notice -> {
                    notice.setTitle(noticeDetails.getTitle());
                    notice.setContent(noticeDetails.getContent());
                    notice.setCategory(noticeDetails.getCategory());
                    notice.setDate(noticeDetails.getDate());
                    notice.setAuthor(noticeDetails.getAuthor());
                    return ResponseEntity.ok(noticeRepository.save(notice));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable String id) {
        if (noticeRepository.existsById(id)) {
            noticeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
