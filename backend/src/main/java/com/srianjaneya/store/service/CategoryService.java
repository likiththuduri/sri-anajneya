package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.CategoryDto;
import com.srianjaneya.store.entity.Category;
import com.srianjaneya.store.exception.BadRequestException;
import com.srianjaneya.store.exception.ResourceNotFoundException;
import com.srianjaneya.store.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return CategoryDto.fromEntity(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        String slug = StringUtils.hasText(dto.getSlug())
                ? dto.getSlug().trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9-]+", "-")
                : dto.getName().trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9-]+", "-");

        if (categoryRepository.existsBySlugIgnoreCase(slug)) {
            throw new BadRequestException("Category slug already exists: " + slug);
        }

        Category category = new Category(
                dto.getName().trim(),
                slug,
                dto.getDescription(),
                dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0,
                dto.getActive() != null ? dto.getActive() : true
        );

        Category saved = categoryRepository.save(category);
        return CategoryDto.fromEntity(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        if (StringUtils.hasText(dto.getName())) {
            category.setName(dto.getName().trim());
        }

        if (StringUtils.hasText(dto.getSlug())) {
            String newSlug = dto.getSlug().trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9-]+", "-");
            if (!newSlug.equalsIgnoreCase(category.getSlug()) && categoryRepository.existsBySlugIgnoreCase(newSlug)) {
                throw new BadRequestException("Category slug already exists: " + newSlug);
            }
            category.setSlug(newSlug);
        }

        category.setDescription(dto.getDescription());
        if (dto.getDisplayOrder() != null) category.setDisplayOrder(dto.getDisplayOrder());
        if (dto.getActive() != null) category.setActive(dto.getActive());

        Category updated = categoryRepository.save(category);
        return CategoryDto.fromEntity(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        categoryRepository.delete(category);
    }
}
