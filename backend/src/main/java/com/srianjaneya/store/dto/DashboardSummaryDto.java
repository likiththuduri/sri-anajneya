package com.srianjaneya.store.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDto {
    private long totalProducts;
    private long activeProducts;
    private long inactiveProducts;
    private long outOfStockProducts;
    private long totalCategories;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalRevenue;
    private List<OrderResponseDto> recentOrders;

    public DashboardSummaryDto() {}

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getActiveProducts() { return activeProducts; }
    public void setActiveProducts(long activeProducts) { this.activeProducts = activeProducts; }

    public long getInactiveProducts() { return inactiveProducts; }
    public void setInactiveProducts(long inactiveProducts) { this.inactiveProducts = inactiveProducts; }

    public long getOutOfStockProducts() { return outOfStockProducts; }
    public void setOutOfStockProducts(long outOfStockProducts) { this.outOfStockProducts = outOfStockProducts; }

    public long getTotalCategories() { return totalCategories; }
    public void setTotalCategories(long totalCategories) { this.totalCategories = totalCategories; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<OrderResponseDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponseDto> recentOrders) { this.recentOrders = recentOrders; }
}
