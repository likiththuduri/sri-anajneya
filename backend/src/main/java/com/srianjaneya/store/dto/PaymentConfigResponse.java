package com.srianjaneya.store.dto;

public class PaymentConfigResponse {
    private boolean onlinePaymentEnabled;
    private String razorpayKeyId;
    private String currency;
    private String shopName;

    public PaymentConfigResponse() {}

    public PaymentConfigResponse(boolean onlinePaymentEnabled, String razorpayKeyId, String currency, String shopName) {
        this.onlinePaymentEnabled = onlinePaymentEnabled;
        this.razorpayKeyId = razorpayKeyId;
        this.currency = currency;
        this.shopName = shopName;
    }

    public boolean isOnlinePaymentEnabled() { return onlinePaymentEnabled; }
    public void setOnlinePaymentEnabled(boolean onlinePaymentEnabled) { this.onlinePaymentEnabled = onlinePaymentEnabled; }

    public String getRazorpayKeyId() { return razorpayKeyId; }
    public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
}
