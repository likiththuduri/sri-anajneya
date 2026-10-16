package com.srianjaneya.store.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductRequestDto {

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Brand is required")
    @Size(max = 150, message = "Brand must not exceed 150 characters")
    private String brand;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    @NotBlank(message = "Pack size is required (e.g. 50 kg Bag, 1 Litre, 475 g Packet)")
    private String packSize;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock = 0;

    // Optional on initial creation so multipart file upload or default placeholder can be used
    private String imageUrl;

    private Boolean active = true;
    private Boolean featured = false;
    private Boolean bookingAvailable = true;
    private String bookingNotes;

    public ProductRequestDto() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getPackSize() { return packSize; }
    public void setPackSize(String packSize) { this.packSize = packSize; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getImageUrl() {
        if (imageUrl == null || imageUrl.isBlank()) {
            return "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80";
        }
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getActive() { return active != null ? active : true; }
    public void setActive(Boolean active) { this.active = active; }

    public Boolean getFeatured() { return featured != null ? featured : false; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Boolean getBookingAvailable() { return bookingAvailable != null ? bookingAvailable : true; }
    public void setBookingAvailable(Boolean bookingAvailable) { this.bookingAvailable = bookingAvailable; }

    public String getBookingNotes() { return bookingNotes; }
    public void setBookingNotes(String bookingNotes) { this.bookingNotes = bookingNotes; }
}
