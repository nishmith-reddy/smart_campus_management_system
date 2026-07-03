package com.scms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @Column(length = 50)
    private String id;

    @Column(unique = true, nullable = false, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String department;

    private Integer credits;

    @Column(nullable = false)
    private Integer semester;

    @Column(columnDefinition = "TEXT")
    private String syllabus;

    @Column(name = "faculty_id", length = 50)
    private String facultyId;
}
