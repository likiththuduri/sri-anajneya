package com.srianjaneya.store;

import com.srianjaneya.store.dto.OrderCreateRequestDto;
import com.srianjaneya.store.dto.OrderItemRequestDto;
import com.srianjaneya.store.dto.OrderResponseDto;
import com.srianjaneya.store.entity.Category;
import com.srianjaneya.store.entity.Product;
import com.srianjaneya.store.exception.BadRequestException;
import com.srianjaneya.store.repository.CategoryRepository;
import com.srianjaneya.store.repository.OrderRepository;
import com.srianjaneya.store.repository.ProductRepository;
import com.srianjaneya.store.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    private Product testProduct;

    @BeforeEach
    void setup() {
        Category category = categoryRepository.findAll().stream().findFirst()
                .orElseGet(() -> categoryRepository.save(new Category("Fertilizers", "fertilizers", "Nutrients", 1, true)));

        testProduct = new Product(
                "Test Urea Bag",
                "TestBrand",
                category,
                "Quality fertilizer",
                new BigDecimal("266.50"),
                "45 kg Bag",
                50,
                "https://example.com/test.jpg",
                true,
                true
        );
        testProduct = productRepository.save(testProduct);
    }

    @Test
    @DisplayName("Should create order, deduct stock, and generate WhatsApp pickup link")
    void testOrderCreationAndStockDeduction() {
        OrderCreateRequestDto request = new OrderCreateRequestDto();
        request.setCustomerName("Ramesh Patel");
        request.setCustomerMobile("9876543210");
        request.setCustomerVillage("Nalgonda");
        request.setCustomerNotes("Please keep ready by 10 AM");
        request.setItems(List.of(new OrderItemRequestDto(testProduct.getId(), 2)));

        OrderResponseDto response = orderService.createOrder(request);

        assertNotNull(response);
        assertNotNull(response.getOrderNumber());
        assertTrue(response.getOrderNumber().startsWith("SA-"));
        assertEquals("Ramesh Patel", response.getCustomerName());
        assertEquals(new BigDecimal("533.00"), response.getTotalAmount());
        assertNotNull(response.getWhatsAppUrl());
        assertTrue(response.getWhatsAppUrl().contains("wa.me"));
        assertTrue(response.getWhatsAppMessage().contains("SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS"));

        // Verify stock deduction in database
        Product updatedProduct = productRepository.findById(testProduct.getId()).orElseThrow();
        assertEquals(48, updatedProduct.getStock());
    }

    @Test
    @DisplayName("Should throw BadRequestException when requested quantity exceeds available stock")
    void testInsufficientStockRejection() {
        OrderCreateRequestDto request = new OrderCreateRequestDto();
        request.setCustomerName("Suresh Kumar");
        request.setCustomerMobile("9876543211");
        request.setItems(List.of(new OrderItemRequestDto(testProduct.getId(), 100))); // exceeds stock of 50

        assertThrows(BadRequestException.class, () -> orderService.createOrder(request));

        // Verify stock remains untouched
        Product unchangedProduct = productRepository.findById(testProduct.getId()).orElseThrow();
        assertEquals(50, unchangedProduct.getStock());
    }
}
