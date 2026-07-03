package com.scms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(length = 50)
    private String id;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String role; // admin, faculty, student

    @Column(length = 255)
    private String avatar;

    @Column(length = 100)
    private String department;

    @Column(length = 50)
    private String contact;

    @Column(name = "id_number", length = 50)
    private String idNumber;

    @Column(length = 20)
    private String status; // pending, approved
}
