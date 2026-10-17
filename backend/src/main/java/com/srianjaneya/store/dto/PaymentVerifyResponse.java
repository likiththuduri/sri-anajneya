package com.srianjaneya.store.dto;

public class PaymentVerifyResponse {
    private boolean success;
    private String message;
    private String paymentStatus;
    private String orderNumber;
    private String bookingReference;

    public PaymentVerifyResponse() {}

    public PaymentVerifyResponse(boolean success, String message, String paymentStatus, String orderNumber, String bookingReference) {
        this.success = success;
        this.message = message;
        this.paymentStatus = paymentStatus;
        this.orderNumber = orderNumber;
        this.bookingReference = bookingReference;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
}
