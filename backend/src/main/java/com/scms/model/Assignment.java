package com.scms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "course_id", length = 50)
    private String courseId;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "max_points")
    private Integer maxPoints;

    @Column(name = "created_by", length = 50)
    private String createdBy; // refers to faculty(id)
}
