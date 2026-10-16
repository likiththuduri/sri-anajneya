package com.srianjaneya.store.dto;

import com.srianjaneya.store.entity.ShopSetting;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class ShopSettingDto {

    private String shopName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "WhatsApp number is required")
    private String whatsapp;

    // Full formatted address
    private String address;

    // Structured address fields
    private String buildingName;
    private String doorPlotNumber;
    private String streetRoad;
    private String landmark;
    private String villageLocality;
    private String mandalDistrict;
    private String state;
    private String pincode;
    private String country;

    // Google Maps Integration
    private String googleMapsUrl;
    private String directionsUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;

    // Opening Hours and Announcements
    private String openingHours;
    private String announcementText;
    private Boolean announcementEnabled;
    private String pickupInstructions;

    // Homepage Hero and Logo
    private String heroTitle;
    private String heroSubtitle;
    private String heroImageUrl;
    private String logoUrl;
    private String heroCtaText;
    private String heroBookCtaText;

    public ShopSettingDto() {}

    public static ShopSettingDto fromEntity(ShopSetting s) {
        ShopSettingDto dto = new ShopSettingDto();
        dto.setShopName(s.getShopName());
        dto.setPhone(s.getPhone());
        dto.setWhatsapp(s.getWhatsapp());
        dto.setAddress(s.getFormattedAddress());
        dto.setBuildingName(s.getBuildingName());
        dto.setDoorPlotNumber(s.getDoorPlotNumber());
        dto.setStreetRoad(s.getStreetRoad());
        dto.setLandmark(s.getLandmark());
        dto.setVillageLocality(s.getVillageLocality());
        dto.setMandalDistrict(s.getMandalDistrict());
        dto.setState(s.getState());
        dto.setPincode(s.getPincode());
        dto.setCountry(s.getCountry());

        dto.setGoogleMapsUrl(s.getGoogleMapsUrl());
        dto.setDirectionsUrl(s.getDirectionsUrl());
        dto.setLatitude(s.getLatitude());
        dto.setLongitude(s.getLongitude());

        dto.setOpeningHours(s.getOpeningHours());
        dto.setAnnouncementText(s.getAnnouncementText());
        dto.setAnnouncementEnabled(s.getAnnouncementEnabled());
        dto.setPickupInstructions(s.getPickupInstructions());

        dto.setHeroTitle(s.getHeroTitle());
        dto.setHeroSubtitle(s.getHeroSubtitle());
        dto.setHeroImageUrl(s.getHeroImageUrl());
        dto.setLogoUrl(s.getLogoUrl());
        dto.setHeroCtaText(s.getHeroCtaText());
        dto.setHeroBookCtaText(s.getHeroBookCtaText());
        return dto;
    }

    public void updateEntity(ShopSetting s) {
        if (this.shopName != null && !this.shopName.isBlank()) {
            s.setShopName(this.shopName.trim());
        }
        if (this.phone != null && !this.phone.isBlank()) {
            s.setPhone(this.phone.trim());
        }
        if (this.whatsapp != null && !this.whatsapp.isBlank()) {
            s.setWhatsapp(this.whatsapp.trim());
        }

        s.setBuildingName(this.buildingName);
        s.setDoorPlotNumber(this.doorPlotNumber);
        s.setStreetRoad(this.streetRoad);
        s.setLandmark(this.landmark);
        s.setVillageLocality(this.villageLocality);
        s.setMandalDistrict(this.mandalDistrict);
        s.setState(this.state != null ? this.state : "Telangana");
        s.setPincode(this.pincode);
        s.setCountry(this.country != null ? this.country : "India");

        // If structured fields were supplied, automatically update address
        s.setAddress(s.getFormattedAddress());

        s.setGoogleMapsUrl(this.googleMapsUrl);
        s.setDirectionsUrl(this.directionsUrl);
        s.setLatitude(this.latitude);
        s.setLongitude(this.longitude);

        s.setOpeningHours(this.openingHours);
        s.setAnnouncementText(this.announcementText);
        s.setAnnouncementEnabled(this.announcementEnabled != null ? this.announcementEnabled : true);
        s.setPickupInstructions(this.pickupInstructions);

        if (this.heroTitle != null) s.setHeroTitle(this.heroTitle);
        if (this.heroSubtitle != null) s.setHeroSubtitle(this.heroSubtitle);
        if (this.heroImageUrl != null) s.setHeroImageUrl(this.heroImageUrl);
        if (this.logoUrl != null) s.setLogoUrl(this.logoUrl);
        if (this.heroCtaText != null) s.setHeroCtaText(this.heroCtaText);
        if (this.heroBookCtaText != null) s.setHeroBookCtaText(this.heroBookCtaText);
    }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }

    public String getDoorPlotNumber() { return doorPlotNumber; }
    public void setDoorPlotNumber(String doorPlotNumber) { this.doorPlotNumber = doorPlotNumber; }

    public String getStreetRoad() { return streetRoad; }
    public void setStreetRoad(String streetRoad) { this.streetRoad = streetRoad; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getVillageLocality() { return villageLocality; }
    public void setVillageLocality(String villageLocality) { this.villageLocality = villageLocality; }

    public String getMandalDistrict() { return mandalDistrict; }
    public void setMandalDistrict(String mandalDistrict) { this.mandalDistrict = mandalDistrict; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getGoogleMapsUrl() { return googleMapsUrl; }
    public void setGoogleMapsUrl(String googleMapsUrl) { this.googleMapsUrl = googleMapsUrl; }

    public String getDirectionsUrl() { return directionsUrl; }
    public void setDirectionsUrl(String directionsUrl) { this.directionsUrl = directionsUrl; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }

    public String getAnnouncementText() { return announcementText; }
    public void setAnnouncementText(String announcementText) { this.announcementText = announcementText; }

    public Boolean getAnnouncementEnabled() { return announcementEnabled; }
    public void setAnnouncementEnabled(Boolean announcementEnabled) { this.announcementEnabled = announcementEnabled; }

    public String getPickupInstructions() { return pickupInstructions; }
    public void setPickupInstructions(String pickupInstructions) { this.pickupInstructions = pickupInstructions; }

    public String getHeroTitle() { return heroTitle; }
    public void setHeroTitle(String heroTitle) { this.heroTitle = heroTitle; }

    public String getHeroSubtitle() { return heroSubtitle; }
    public void setHeroSubtitle(String heroSubtitle) { this.heroSubtitle = heroSubtitle; }

    public String getHeroImageUrl() { return heroImageUrl; }
    public void setHeroImageUrl(String heroImageUrl) { this.heroImageUrl = heroImageUrl; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getHeroCtaText() { return heroCtaText; }
    public void setHeroCtaText(String heroCtaText) { this.heroCtaText = heroCtaText; }

    public String getHeroBookCtaText() { return heroBookCtaText; }
    public void setHeroBookCtaText(String heroBookCtaText) { this.heroBookCtaText = heroBookCtaText; }
}
