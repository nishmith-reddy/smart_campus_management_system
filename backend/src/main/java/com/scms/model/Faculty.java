package com.scms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faculty")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faculty {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "user_id", unique = true, length = 50)
    private String userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "employee_id", unique = true, nullable = false, length = 50)
    private String employeeId;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(length = 150)
    private String specialization;

    @Column(length = 50)
    private String contact;
}
