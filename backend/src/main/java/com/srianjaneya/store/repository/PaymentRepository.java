package com.srianjaneya.store.repository;

import com.srianjaneya.store.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentReference(String paymentReference);
    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
    Page<Payment> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
