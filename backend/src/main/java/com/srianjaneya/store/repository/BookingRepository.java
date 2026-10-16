package com.srianjaneya.store.repository;

import com.srianjaneya.store.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findAllByOrderByCreatedAtDesc();

    Page<Booking> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Booking> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:search IS NULL OR LOWER(b.bookingReference) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.customerName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.customerMobile) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.productName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY b.createdAt DESC")
    Page<Booking> searchBookings(@Param("status") String status, @Param("search") String search, Pageable pageable);

    long countByStatus(String status);
}
