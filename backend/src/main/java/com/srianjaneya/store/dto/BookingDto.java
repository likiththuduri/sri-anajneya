package com.srianjaneya.store.dto;

import com.srianjaneya.store.entity.Booking;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDto {

    private Long id;
    private String bookingReference;
    private Long productId;
    private String productName;
    private String brand;
    private String packSize;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalAmount;
    private String customerName;
    private String customerMobile;
    private LocalDate preferredPickupDate;
    private String customerNotes;
    private String adminNotes;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String whatsAppUrl;

    public BookingDto() {}

    public static BookingDto fromEntity(Booking b, String shopWhatsApp) {
        BookingDto dto = new BookingDto();
        dto.setId(b.getId());
        dto.setBookingReference(b.getBookingReference());
        if (b.getProduct() != null) {
            dto.setProductId(b.getProduct().getId());
        }
        dto.setProductName(b.getProductName());
        dto.setBrand(b.getBrand());
        dto.setPackSize(b.getPackSize());
        dto.setUnitPrice(b.getUnitPrice());
        dto.setQuantity(b.getQuantity());
        dto.setTotalAmount(b.getTotalAmount());
        dto.setCustomerName(b.getCustomerName());
        dto.setCustomerMobile(b.getCustomerMobile());
        dto.setPreferredPickupDate(b.getPreferredPickupDate());
        dto.setCustomerNotes(b.getCustomerNotes());
        dto.setAdminNotes(b.getAdminNotes());
        dto.setStatus(b.getStatus());
        dto.setCreatedAt(b.getCreatedAt());
        dto.setUpdatedAt(b.getUpdatedAt());

        // Format WhatsApp booking slip message
        if (shopWhatsApp != null && !shopWhatsApp.isBlank()) {
            String cleanWhatsApp = shopWhatsApp.replaceAll("[^0-9]", "");
            StringBuilder sb = new StringBuilder();
            sb.append("*SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS*\n");
            sb.append("--------------------------------------------\n");
            sb.append("📋 *ADVANCE BOOKING REQUEST*\n");
            sb.append("--------------------------------------------\n");
            sb.append("*Booking Ref:* ").append(b.getBookingReference()).append("\n");
            sb.append("*Customer:* ").append(b.getCustomerName()).append(" (").append(b.getCustomerMobile()).append(")\n");
            if (b.getPreferredPickupDate() != null) {
                sb.append("*Preferred Pickup:* ").append(b.getPreferredPickupDate()).append("\n");
            }
            sb.append("--------------------------------------------\n");
            sb.append("*Product:* ").append(b.getProductName()).append("\n");
            if (b.getBrand() != null) sb.append("*Brand:* ").append(b.getBrand()).append("\n");
            if (b.getPackSize() != null) sb.append("*Pack Size:* ").append(b.getPackSize()).append("\n");
            sb.append("*Quantity:* ").append(b.getQuantity()).append("\n");
            sb.append("*Estimated Total:* ₹").append(b.getTotalAmount()).append("\n");
            if (b.getCustomerNotes() != null && !b.getCustomerNotes().isBlank()) {
                sb.append("*Notes:* ").append(b.getCustomerNotes().trim()).append("\n");
            }
            sb.append("--------------------------------------------\n");
            sb.append("📍 *Pickup Mode:* Local Store Counter Pickup Only\n");
            sb.append("📌 *Status:* ").append(b.getStatus()).append("\n");
            sb.append("Please confirm stock availability and pickup schedule.");

            String encoded = URLEncoder.encode(sb.toString(), StandardCharsets.UTF_8);
            dto.setWhatsAppUrl("https://wa.me/" + cleanWhatsApp + "?text=" + encoded);
        }

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getPackSize() { return packSize; }
    public void setPackSize(String packSize) { this.packSize = packSize; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }

    public LocalDate getPreferredPickupDate() { return preferredPickupDate; }
    public void setPreferredPickupDate(LocalDate preferredPickupDate) { this.preferredPickupDate = preferredPickupDate; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getWhatsAppUrl() { return whatsAppUrl; }
    public void setWhatsAppUrl(String whatsAppUrl) { this.whatsAppUrl = whatsAppUrl; }
}
