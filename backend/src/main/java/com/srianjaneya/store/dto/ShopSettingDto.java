package com.srianjaneya.store.dto;

import com.srianjaneya.store.entity.ShopSetting;
import jakarta.validation.constraints.NotBlank;

public class ShopSettingDto {

    private String shopName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "WhatsApp number is required")
    private String whatsapp;

    @NotBlank(message = "Shop address is required")
    private String address;

    private String state;
    private String heroTitle;
    private String heroSubtitle;
    private String heroImageUrl;
    private String logoUrl;

    public ShopSettingDto() {}

    public static ShopSettingDto fromEntity(ShopSetting s) {
        ShopSettingDto dto = new ShopSettingDto();
        dto.setShopName(s.getShopName());
        dto.setPhone(s.getPhone());
        dto.setWhatsapp(s.getWhatsapp());
        dto.setAddress(s.getAddress());
        dto.setState(s.getState());
        dto.setHeroTitle(s.getHeroTitle());
        dto.setHeroSubtitle(s.getHeroSubtitle());
        dto.setHeroImageUrl(s.getHeroImageUrl());
        dto.setLogoUrl(s.getLogoUrl());
        return dto;
    }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getHeroTitle() { return heroTitle; }
    public void setHeroTitle(String heroTitle) { this.heroTitle = heroTitle; }

    public String getHeroSubtitle() { return heroSubtitle; }
    public void setHeroSubtitle(String heroSubtitle) { this.heroSubtitle = heroSubtitle; }

    public String getHeroImageUrl() { return heroImageUrl; }
    public void setHeroImageUrl(String heroImageUrl) { this.heroImageUrl = heroImageUrl; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}
