package com.srianjaneya.store.dto;

import com.srianjaneya.store.entity.Order;
import com.srianjaneya.store.entity.OrderItem;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponseDto {

    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerMobile;
    private String customerVillage;
    private String customerNotes;
    private BigDecimal totalAmount;
    private String status;
    private List<OrderItemDto> items;
    private LocalDateTime createdAt;
    private String whatsAppMessage;
    private String whatsAppUrl;

    public static class OrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String brand;
        private String packSize;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subtotal;

        public OrderItemDto() {}

        public static OrderItemDto fromEntity(OrderItem item) {
            OrderItemDto dto = new OrderItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProductId());
            dto.setProductName(item.getProductName());
            dto.setBrand(item.getBrand());
            dto.setPackSize(item.getPackSize());
            dto.setPrice(item.getPrice());
            dto.setQuantity(item.getQuantity());
            dto.setSubtotal(item.getSubtotal());
            return dto;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }
        public String getPackSize() { return packSize; }
        public void setPackSize(String packSize) { this.packSize = packSize; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    public OrderResponseDto() {}

    public static OrderResponseDto fromEntity(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerMobile(order.getCustomerMobile());
        dto.setCustomerVillage(order.getCustomerVillage());
        dto.setCustomerNotes(order.getCustomerNotes());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(OrderItemDto::fromEntity).collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }

    public String getCustomerVillage() { return customerVillage; }
    public void setCustomerVillage(String customerVillage) { this.customerVillage = customerVillage; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getWhatsAppMessage() { return whatsAppMessage; }
    public void setWhatsAppMessage(String whatsAppMessage) { this.whatsAppMessage = whatsAppMessage; }

    public String getWhatsAppUrl() { return whatsAppUrl; }
    public void setWhatsAppUrl(String whatsAppUrl) { this.whatsAppUrl = whatsAppUrl; }
}
