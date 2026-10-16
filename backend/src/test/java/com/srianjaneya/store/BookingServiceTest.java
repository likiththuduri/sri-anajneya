package com.srianjaneya.store;

import com.srianjaneya.store.dto.BookingCreateRequest;
import com.srianjaneya.store.dto.BookingDto;
import com.srianjaneya.store.dto.BookingStatusUpdateRequest;
import com.srianjaneya.store.entity.Category;
import com.srianjaneya.store.entity.Product;
import com.srianjaneya.store.exception.BadRequestException;
import com.srianjaneya.store.repository.CategoryRepository;
import com.srianjaneya.store.repository.ProductRepository;
import com.srianjaneya.store.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class BookingServiceTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Product testProduct;

    @BeforeEach
    void setup() {
        Category category = categoryRepository.findAll().stream().findFirst()
                .orElseGet(() -> categoryRepository.save(new Category("Fertilizers", "fertilizers", "Nutrients", 1, true)));

        testProduct = new Product(
                "IFFCO Nano Urea",
                "IFFCO",
                category,
                "Liquid nitrogen fertilizer",
                new BigDecimal("225.00"),
                "500 ml",
                50,
                "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                true,
                true
        );
        testProduct.setBookingAvailable(true);
        testProduct = productRepository.save(testProduct);
    }

    @Test
    @DisplayName("Should successfully create advance booking with PENDING status")
    void testCreateBooking_Success() {
        BookingCreateRequest req = new BookingCreateRequest();
        req.setProductId(testProduct.getId());
        req.setQuantity(2);
        req.setCustomerName("Ramesh Kumar");
        req.setCustomerMobile("9876543210");
        req.setPreferredPickupDate(LocalDate.now().plusDays(2));
        req.setCustomerNotes("Need early morning pickup");

        BookingDto created = bookingService.createBooking(req);

        assertNotNull(created.getId());
        assertTrue(created.getBookingReference().startsWith("BK-"));
        assertEquals("PENDING", created.getStatus());
        assertEquals("Ramesh Kumar", created.getCustomerName());
        assertEquals("9876543210", created.getCustomerMobile());
        assertEquals(2, created.getQuantity());
        assertEquals(new BigDecimal("450.00"), created.getTotalAmount());
        assertNotNull(created.getWhatsAppUrl());
        assertTrue(created.getWhatsAppUrl().contains("wa.me"));
    }

    @Test
    @DisplayName("Should validate booking status transition and manage product stock accurately")
    void testBookingLifecycle_StockManagement() {
        BookingCreateRequest req = new BookingCreateRequest();
        req.setProductId(testProduct.getId());
        req.setQuantity(5);
        req.setCustomerName("Suresh Reddy");
        req.setCustomerMobile("9123456789");

        BookingDto created = bookingService.createBooking(req);
        assertEquals("PENDING", created.getStatus());
        assertEquals(50, productRepository.findById(testProduct.getId()).get().getStock());

        // Admin accepts booking -> stock deducted
        BookingStatusUpdateRequest acceptReq = new BookingStatusUpdateRequest();
        acceptReq.setStatus("ACCEPTED");
        acceptReq.setAdminNotes("Reserved 5 bottles in warehouse A");
        BookingDto accepted = bookingService.updateBookingStatus(created.getId(), acceptReq);

        assertEquals("ACCEPTED", accepted.getStatus());
        assertEquals(45, productRepository.findById(testProduct.getId()).get().getStock());

        // Mark ready for pickup
        BookingStatusUpdateRequest readyReq = new BookingStatusUpdateRequest();
        readyReq.setStatus("READY_FOR_PICKUP");
        BookingDto ready = bookingService.updateBookingStatus(created.getId(), readyReq);
        assertEquals("READY_FOR_PICKUP", ready.getStatus());

        // If customer cancels, stock is restored
        BookingStatusUpdateRequest cancelReq = new BookingStatusUpdateRequest();
        cancelReq.setStatus("CANCELLED");
        BookingDto cancelled = bookingService.updateBookingStatus(created.getId(), cancelReq);
        assertEquals("CANCELLED", cancelled.getStatus());
        assertEquals(50, productRepository.findById(testProduct.getId()).get().getStock());
    }

    @Test
    @DisplayName("Should prevent accepting booking when available stock is insufficient")
    void testBooking_InsufficientStock() {
        testProduct.setStock(2);
        productRepository.save(testProduct);

        BookingCreateRequest req = new BookingCreateRequest();
        req.setProductId(testProduct.getId());
        req.setQuantity(5);
        req.setCustomerName("Kavitha Rao");
        req.setCustomerMobile("9888877777");

        BookingDto created = bookingService.createBooking(req);

        BookingStatusUpdateRequest acceptReq = new BookingStatusUpdateRequest();
        acceptReq.setStatus("ACCEPTED");

        assertThrows(BadRequestException.class, () ->
                bookingService.updateBookingStatus(created.getId(), acceptReq)
        );
    }
}
