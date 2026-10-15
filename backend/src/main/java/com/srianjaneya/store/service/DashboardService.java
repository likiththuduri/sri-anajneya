package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.DashboardSummaryDto;
import com.srianjaneya.store.dto.OrderResponseDto;
import com.srianjaneya.store.entity.Order;
import com.srianjaneya.store.repository.CategoryRepository;
import com.srianjaneya.store.repository.OrderRepository;
import com.srianjaneya.store.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;

    public DashboardService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardSummaryDto getDashboardSummary() {
        DashboardSummaryDto summary = new DashboardSummaryDto();

        summary.setTotalProducts(productRepository.count());
        summary.setActiveProducts(productRepository.countByActiveTrue());
        summary.setInactiveProducts(productRepository.countByActiveFalse());
        summary.setOutOfStockProducts(productRepository.countByStockLessThanEqual(0));
        summary.setTotalCategories(categoryRepository.count());
        summary.setTotalOrders(orderRepository.count());
        summary.setPendingOrders(orderRepository.countByStatus("PENDING"));

        List<Order> allOrders = orderRepository.findAll();
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setTotalRevenue(totalRevenue);

        List<OrderResponseDto> recent = orderRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(OrderResponseDto::fromEntity)
                .collect(Collectors.toList());
        summary.setRecentOrders(recent);

        return summary;
    }
}
