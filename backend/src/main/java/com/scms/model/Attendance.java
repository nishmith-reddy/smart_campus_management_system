package com.scms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "student_id", length = 50)
    private String studentId;

    @Column(name = "course_id", length = 50)
    private String courseId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 10)
    private String status; // present, absent

    @Column(length = 255)
    private String remarks;
}
