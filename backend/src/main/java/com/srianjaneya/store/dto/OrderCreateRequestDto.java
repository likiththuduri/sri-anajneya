package com.srianjaneya.store.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public class OrderCreateRequestDto {

    @NotBlank(message = "Customer name is required")
    @Size(max = 150, message = "Customer name must not exceed 150 characters")
    private String customerName;

    @NotBlank(message = "Customer mobile number is required")
    @Pattern(regexp = "^[0-9]{10,12}$", message = "Please enter a valid 10-12 digit mobile number")
    private String customerMobile;

    @Size(max = 150, message = "Village / town must not exceed 150 characters")
    private String customerVillage;

    private String customerNotes;

    @NotEmpty(message = "Cart cannot be empty")
    @Valid
    private List<OrderItemRequestDto> items;

    public OrderCreateRequestDto() {}

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }

    public String getCustomerVillage() { return customerVillage; }
    public void setCustomerVillage(String customerVillage) { this.customerVillage = customerVillage; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public List<OrderItemRequestDto> getItems() { return items; }
    public void setItems(List<OrderItemRequestDto> items) { this.items = items; }
}
