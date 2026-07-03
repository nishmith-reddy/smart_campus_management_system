package com.scms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "student_id", length = 50)
    private String studentId;

    @Column(name = "course_id", length = 50)
    private String courseId;

    @Column(name = "exam_type", nullable = false, length = 50)
    private String examType; // Midterm, Final Exam, Practical, Assignment Project

    @Column(name = "marks_obtained", nullable = false)
    private Integer marksObtained;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(nullable = false, length = 5)
    private String grade;

    @Column(length = 255)
    private String remarks;
}
