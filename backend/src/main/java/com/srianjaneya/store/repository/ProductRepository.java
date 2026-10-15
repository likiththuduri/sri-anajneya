package com.srianjaneya.store.repository;

import com.srianjaneya.store.entity.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue(Sort sort);

    List<Product> findByActiveTrueAndCategoryId(Long categoryId, Sort sort);

    List<Product> findByActiveTrueAndCategorySlugIgnoreCase(String categorySlug, Sort sort);

    List<Product> findByActiveTrueAndFeaturedTrueOrderByCreatedAtDesc();

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchPublicProducts(@Param("query") String query, Sort sort);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.category.id = :categoryId AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchPublicProductsInCategory(@Param("categoryId") Long categoryId, @Param("query") String query, Sort sort);

    long countByActiveTrue();

    long countByActiveFalse();

    long countByStockLessThanEqual(int stockThreshold);
}
