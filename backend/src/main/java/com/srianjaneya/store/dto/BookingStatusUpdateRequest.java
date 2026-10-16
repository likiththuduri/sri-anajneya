package com.srianjaneya.store.dto;

import jakarta.validation.constraints.NotBlank;

public class BookingStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status; // PENDING, ACCEPTED, REJECTED, READY_FOR_PICKUP, COLLECTED, CANCELLED

    private String adminNotes;

    public BookingStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
