package com.srianjaneya.store;

import com.srianjaneya.store.dto.ProductRequestDto;
import com.srianjaneya.store.dto.ProductResponseDto;
import com.srianjaneya.store.entity.Category;
import com.srianjaneya.store.repository.CategoryRepository;
import com.srianjaneya.store.repository.ProductRepository;
import com.srianjaneya.store.service.ProductService;
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
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    private Category testCategory;

    @BeforeEach
    void setup() {
        testCategory = categoryRepository.findAll().stream().findFirst()
                .orElseGet(() -> categoryRepository.save(new Category("Pesticides", "pesticides", "Crop chemicals", 2, true)));
    }

    @Test
    @DisplayName("Should successfully create product and retrieve by ID")
    void testCreateAndGetProduct() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Coragen Insecticide");
        dto.setBrand("FMC");
        dto.setCategoryId(testCategory.getId());
        dto.setDescription("High quality pest control");
        dto.setPrice(new BigDecimal("1850.00"));
        dto.setPackSize("150 ml");
        dto.setStock(30);
        dto.setImageUrl("https://res.cloudinary.com/demo/image/upload/sample.jpg");
        dto.setActive(true);
        dto.setFeatured(true);

        ProductResponseDto created = productService.createProduct(dto);
        assertNotNull(created.getId());
        assertEquals("Coragen Insecticide", created.getName());
        assertEquals(30, created.getStock());
        assertTrue(created.getActive());

        ProductResponseDto retrieved = productService.getProductById(created.getId());
        assertEquals(created.getId(), retrieved.getId());
        assertEquals("FMC", retrieved.getBrand());
    }

    @Test
    @DisplayName("Cross-device sync test: Image replacement must update imageUrl in database")
    void testProductImageReplacement() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("DAP 18:46:0");
        dto.setBrand("Coromandel");
        dto.setCategoryId(testCategory.getId());
        dto.setPrice(new BigDecimal("1350.00"));
        dto.setPackSize("50 kg Bag");
        dto.setStock(100);
        dto.setImageUrl("https://res.cloudinary.com/store/image/upload/v1/old_image.jpg");
        dto.setActive(true);

        ProductResponseDto created = productService.createProduct(dto);
        assertEquals("https://res.cloudinary.com/store/image/upload/v1/old_image.jpg", created.getImageUrl());

        // Simulate admin replacing the image via Cloudinary upload result
        String newCloudinaryUrl = "https://res.cloudinary.com/store/image/upload/v2/new_image.jpg?t=123456789";
        ProductResponseDto updated = productService.updateProductImage(created.getId(), newCloudinaryUrl);

        // Verify the database holds the new URL
        assertEquals(newCloudinaryUrl, updated.getImageUrl());
        ProductResponseDto freshFetch = productService.getProductById(created.getId());
        assertEquals(newCloudinaryUrl, freshFetch.getImageUrl());
    }

    @Test
    @DisplayName("Public catalog must only return active products")
    void testPublicActiveFilter() {
        ProductRequestDto activeDto = new ProductRequestDto();
        activeDto.setName("Active Seed Bag");
        activeDto.setBrand("Rasi");
        activeDto.setCategoryId(testCategory.getId());
        activeDto.setPrice(new BigDecimal("860.00"));
        activeDto.setPackSize("475 g");
        activeDto.setStock(20);
        activeDto.setImageUrl("https://example.com/active.jpg");
        activeDto.setActive(true);
        productService.createProduct(activeDto);

        ProductRequestDto inactiveDto = new ProductRequestDto();
        inactiveDto.setName("Discontinued Chemical");
        inactiveDto.setBrand("OldBrand");
        inactiveDto.setCategoryId(testCategory.getId());
        inactiveDto.setPrice(new BigDecimal("500.00"));
        inactiveDto.setPackSize("100 ml");
        inactiveDto.setStock(0);
        inactiveDto.setImageUrl("https://example.com/inactive.jpg");
        inactiveDto.setActive(false);
        productService.createProduct(inactiveDto);

        List<ProductResponseDto> publicList = productService.getPublicProducts("Discontinued Chemical", null, null, "newest");
        assertTrue(publicList.isEmpty(), "Inactive products must not be returned in public catalog search");
    }
}
