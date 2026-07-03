package com.scms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "assignment_id", length = 50)
    private String assignmentId;

    @Column(name = "student_id", length = 50)
    private String studentId;

    @Column(name = "submission_date", nullable = false)
    private LocalDate submissionDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 20)
    private String status; // submitted, graded

    @Column(name = "points_obtained")
    private Integer pointsObtained;

    @Column(name = "grade_remarks", length = 255)
    private String gradeRemarks;
}
