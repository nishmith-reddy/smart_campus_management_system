package com.scms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fee {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "student_id", length = 50)
    private String studentId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal amount;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(length = 10)
    private String status; // paid, unpaid

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;
}
