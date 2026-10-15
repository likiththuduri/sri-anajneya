package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.ProductRequestDto;
import com.srianjaneya.store.dto.ProductResponseDto;
import com.srianjaneya.store.entity.Category;
import com.srianjaneya.store.entity.Product;
import com.srianjaneya.store.exception.ResourceNotFoundException;
import com.srianjaneya.store.repository.CategoryRepository;
import com.srianjaneya.store.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductResponseDto> getPublicProducts(String query, String categorySlug, Long categoryId, String sortParam) {
        Sort sort = resolveSort(sortParam);

        List<Product> products;
        boolean hasQuery = StringUtils.hasText(query);
        boolean hasCategorySlug = StringUtils.hasText(categorySlug);
        boolean hasCategoryId = categoryId != null;

        if (hasQuery && hasCategoryId) {
            products = productRepository.searchPublicProductsInCategory(categoryId, query.trim(), sort);
        } else if (hasQuery) {
            products = productRepository.searchPublicProducts(query.trim(), sort);
        } else if (hasCategorySlug) {
            products = productRepository.findByActiveTrueAndCategorySlugIgnoreCase(categorySlug.trim(), sort);
        } else if (hasCategoryId) {
            products = productRepository.findByActiveTrueAndCategoryId(categoryId, sort);
        } else {
            products = productRepository.findByActiveTrue(sort);
        }

        return products.stream().map(ProductResponseDto::fromEntity).collect(Collectors.toList());
    }

    public List<ProductResponseDto> getFeaturedProducts() {
        return productRepository.findByActiveTrueAndFeaturedTrueOrderByCreatedAtDesc()
                .stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return ProductResponseDto.fromEntity(product);
    }

    public List<ProductResponseDto> getAllAdminProducts() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(ProductResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        Product product = new Product(
                dto.getName().trim(),
                dto.getBrand().trim(),
                category,
                dto.getDescription(),
                dto.getPrice(),
                dto.getPackSize().trim(),
                dto.getStock() != null ? dto.getStock() : 0,
                dto.getImageUrl().trim(),
                dto.getActive() != null ? dto.getActive() : true,
                dto.getFeatured() != null ? dto.getFeatured() : false
        );

        Product saved = productRepository.save(product);
        return ProductResponseDto.fromEntity(saved);
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        if (dto.getCategoryId() != null && !dto.getCategoryId().equals(product.getCategory().getId())) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));
            product.setCategory(category);
        }

        product.setName(dto.getName().trim());
        product.setBrand(dto.getBrand().trim());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setPackSize(dto.getPackSize().trim());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (StringUtils.hasText(dto.getImageUrl())) product.setImageUrl(dto.getImageUrl().trim());
        if (dto.getActive() != null) product.setActive(dto.getActive());
        if (dto.getFeatured() != null) product.setFeatured(dto.getFeatured());

        Product updated = productRepository.save(product);
        return ProductResponseDto.fromEntity(updated);
    }

    @Transactional
    public ProductResponseDto updateProductImage(Long id, String imageUrl) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        product.setImageUrl(imageUrl.trim());
        Product updated = productRepository.save(product);
        return ProductResponseDto.fromEntity(updated);
    }

    @Transactional
    public ProductResponseDto updateProductStock(Long id, int newStock) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        product.setStock(Math.max(0, newStock));
        Product updated = productRepository.save(product);
        return ProductResponseDto.fromEntity(updated);
    }

    @Transactional
    public ProductResponseDto toggleProductActive(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        product.setActive(!product.getActive());
        Product updated = productRepository.save(product);
        return ProductResponseDto.fromEntity(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        productRepository.delete(product);
    }

    private Sort resolveSort(String sortParam) {
        if ("price-asc".equalsIgnoreCase(sortParam)) {
            return Sort.by(Sort.Direction.ASC, "price");
        } else if ("price-desc".equalsIgnoreCase(sortParam)) {
            return Sort.by(Sort.Direction.DESC, "price");
        } else if ("name-asc".equalsIgnoreCase(sortParam)) {
            return Sort.by(Sort.Direction.ASC, "name");
        } else if ("name-desc".equalsIgnoreCase(sortParam)) {
            return Sort.by(Sort.Direction.DESC, "name");
        } else if ("stock-desc".equalsIgnoreCase(sortParam)) {
            return Sort.by(Sort.Direction.DESC, "stock");
        }
        return Sort.by(Sort.Direction.DESC, "createdAt");
    }
}
