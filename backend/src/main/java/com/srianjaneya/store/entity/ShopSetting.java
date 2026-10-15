package com.srianjaneya.store.entity;

import jakarta.persistence.*;
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

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address = "Main Road, Telangana, India";

    @Column(length = 100)
    private String state = "Telangana";

    @Column(name = "hero_title", length = 255)
    private String heroTitle = "Empowering Telangana Farmers with Genuine Agricultural Inputs";

    @Column(name = "hero_subtitle", columnDefinition = "TEXT")
    private String heroSubtitle = "Authorized dealer of premium Fertilizers, certified Seeds, trusted Pesticides, and high-yield Micronutrients. Book online for local store pickup.";

    @Column(name = "hero_image_url", columnDefinition = "TEXT")
    private String heroImageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80";

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=200&q=80";

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }

    public ShopSetting() {}

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
