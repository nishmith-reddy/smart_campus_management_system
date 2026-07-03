package com.scms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "user_id", unique = true, length = 50)
    private String userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "roll_number", unique = true, nullable = false, length = 50)
    private String rollNumber;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(name = "current_semester")
    private Integer currentSemester;

    @Column(precision = 3, scale = 2)
    private BigDecimal cgpa;

    @Column(length = 50)
    private String contact;

    @Column(name = "admission_year")
    private Integer admissionYear;
}
