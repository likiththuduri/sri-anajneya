package com.srianjaneya.store.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shop_settings")
public class ShopSetting {

    @Id
    private Long id = 1L;

    @Column(name = "shop_name", nullable = false, length = 255)
    private String shopName = "SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS";

    @Column(nullable = false, length = 20)
    private String phone = "917095891270";

    @Column(nullable = false, length = 20)
    private String whatsapp = "917095891270";

    // Backward-compatible full address string
    @Column(nullable = false, columnDefinition = "TEXT")
    private String address = "Main Road, Telangana, India";

    // Structured address fields for clean multi-line display & editing
    @Column(name = "building_name", length = 150)
    private String buildingName = "Sri Anjaneya Nilayam";

    @Column(name = "door_plot_number", length = 50)
    private String doorPlotNumber = "Shop No. 4-12/A";

    @Column(name = "street_road", length = 255)
    private String streetRoad = "Main Road";

    @Column(length = 255)
    private String landmark = "Near Rythu Bharosa Kendram & Bus Stand";

    @Column(name = "village_locality", length = 150)
    private String villageLocality = "Choutuppal";

    @Column(name = "mandal_district", length = 150)
    private String mandalDistrict = "Yadadri Bhuvanagiri District";

    @Column(length = 100)
    private String state = "Telangana";

    @Column(length = 20)
    private String pincode = "508252";

    @Column(length = 100)
    private String country = "India";

    // Google Maps integration
    @Column(name = "google_maps_url", columnDefinition = "TEXT")
    private String googleMapsUrl;

    @Column(name = "directions_url", columnDefinition = "TEXT")
    private String directionsUrl;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    // Opening Hours and Announcements
    @Column(name = "opening_hours", columnDefinition = "TEXT")
    private String openingHours = "Mon - Sat: 7:00 AM - 8:30 PM | Sunday: 7:00 AM - 2:00 PM";

    @Column(name = "announcement_text", columnDefinition = "TEXT")
    private String announcementText = "🌾 Kharif Season Fertilizer & Seed Booking Open! Book Online for Fast Counter Pickup.";

    @Column(name = "announcement_enabled")
    private Boolean announcementEnabled = true;

    @Column(name = "pickup_instructions", columnDefinition = "TEXT")
    private String pickupInstructions = "1. Add products to cart or click Book Now. 2. Show your Order/Booking Reference at our store counter. 3. Pay via Cash or UPI and collect genuine inputs immediately.";

    // Homepage Appearance & Hero customization
    @Column(name = "hero_title", length = 255)
    private String heroTitle = "Empowering Telangana Farmers with Genuine Agricultural Inputs";

    @Column(name = "hero_subtitle", columnDefinition = "TEXT")
    private String heroSubtitle = "Authorized dealer of premium Fertilizers, certified Seeds, trusted Pesticides, and high-yield Micronutrients. Book online for local store pickup.";

    @Column(name = "hero_image_url", columnDefinition = "TEXT")
    private String heroImageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80";

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=200&q=80";

    @Column(name = "hero_cta_text", length = 100)
    private String heroCtaText = "Explore Products";

    @Column(name = "hero_book_cta_text", length = 100)
    private String heroBookCtaText = "Book Online";

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
        // Automatically sync the composite formatted address if structured fields are present
        this.address = getFormattedAddress();
    }

    public ShopSetting() {}

    /**
     * Generates a clean, neatly formatted multi-line public address from structured fields
     */
    public String getFormattedAddress() {
        StringBuilder sb = new StringBuilder();
        if (buildingName != null && !buildingName.isBlank()) {
            sb.append(buildingName.trim()).append(", ");
        }
        if (doorPlotNumber != null && !doorPlotNumber.isBlank()) {
            sb.append(doorPlotNumber.trim()).append(", ");
        }
        if (streetRoad != null && !streetRoad.isBlank()) {
            sb.append(streetRoad.trim()).append(", ");
        }
        if (landmark != null && !landmark.isBlank()) {
            sb.append("Landmark: ").append(landmark.trim()).append(", ");
        }
        if (villageLocality != null && !villageLocality.isBlank()) {
            sb.append(villageLocality.trim()).append(", ");
        }
        if (mandalDistrict != null && !mandalDistrict.isBlank()) {
            sb.append(mandalDistrict.trim()).append(", ");
        }
        if (state != null && !state.isBlank()) {
            sb.append(state.trim());
        }
        if (pincode != null && !pincode.isBlank()) {
            sb.append(" - ").append(pincode.trim());
        }
        if (country != null && !country.isBlank() && !"India".equalsIgnoreCase(country.trim())) {
            sb.append(", ").append(country.trim());
        }
        String formatted = sb.toString().trim();
        if (formatted.endsWith(",")) {
            formatted = formatted.substring(0, formatted.length() - 1).trim();
        }
        return formatted.isEmpty() ? address : formatted;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
