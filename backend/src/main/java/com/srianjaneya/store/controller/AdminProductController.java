package com.srianjaneya.store.controller;

import com.srianjaneya.store.dto.ImageUploadResponse;
import com.srianjaneya.store.dto.ProductRequestDto;
import com.srianjaneya.store.dto.ProductResponseDto;
import com.srianjaneya.store.service.CloudinaryService;
import com.srianjaneya.store.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    public AdminProductController(ProductService productService, CloudinaryService cloudinaryService) {
        this.productService = productService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllAdminProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductRequestDto request) {
        ProductResponseDto created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto request) {
        ProductResponseDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }

    /**
     * Upload product image directly to Cloudinary.
     * The returned secure HTTPS URL is then stored in MySQL,
     * ensuring immediate cross-device availability without redeployment!
     */
    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> uploadProductImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "sri_anjaneya_products") String folder) {
        ImageUploadResponse response = cloudinaryService.uploadImage(file, folder);
        return ResponseEntity.ok(response);
    }

    /**
     * Instantly replace a product's image URL in MySQL.
     */
    @PatchMapping("/{id}/image")
    public ResponseEntity<ProductResponseDto> updateProductImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String imageUrl = payload.get("imageUrl");
        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        ProductResponseDto updated = productService.updateProductImage(id, imageUrl);
        return ResponseEntity.ok(updated);
    }

    /**
     * Quick stock adjustment.
     */
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductResponseDto> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload) {
        Integer stock = payload.get("stock");
        if (stock == null) {
            return ResponseEntity.badRequest().build();
        }
        ProductResponseDto updated = productService.updateProductStock(id, stock);
        return ResponseEntity.ok(updated);
    }

    /**
     * Quick toggle for active/inactive status.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductResponseDto> toggleStatus(@PathVariable Long id) {
        ProductResponseDto updated = productService.toggleProductActive(id);
        return ResponseEntity.ok(updated);
    }
}
