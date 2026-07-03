package com.scms.controller;

import com.scms.model.Fee;
import com.scms.repository.FeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    @Autowired
    private FeeRepository feeRepository;

    @GetMapping
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFeeById(@PathVariable String id) {
        return feeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Fee> getFeesByStudent(@PathVariable String studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    @PostMapping
    public Fee createFee(@RequestBody Fee fee) {
        if (fee.getId() == null || fee.getId().isEmpty()) {
            fee.setId("FEE-" + System.currentTimeMillis());
        }
        return feeRepository.save(fee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable String id, @RequestBody Fee feeDetails) {
        return feeRepository.findById(id)
                .map(fee -> {
                    fee.setTitle(feeDetails.getTitle());
                    fee.setAmount(feeDetails.getAmount());
                    fee.setDueDate(feeDetails.getDueDate());
                    fee.setStatus(feeDetails.getStatus());
                    fee.setPaymentDate(feeDetails.getPaymentDate());
                    fee.setTransactionId(feeDetails.getTransactionId());
                    return ResponseEntity.ok(feeRepository.save(fee));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFee(@PathVariable String id) {
        if (feeRepository.existsById(id)) {
            feeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
