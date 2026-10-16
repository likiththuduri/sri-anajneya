package com.srianjaneya.store.dto;

import com.srianjaneya.store.entity.WebsiteSection;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class WebsiteSectionDto {

    private Long id;

    @NotBlank(message = "Section key is required")
    private String sectionKey;

    @NotBlank(message = "Title is required")
    private String title;

    private String subtitle;
    private String content;
    private String buttonLabel;
    private String buttonLink;
    private Boolean enabled;
    private Integer displayOrder;
    private LocalDateTime updatedAt;

    public WebsiteSectionDto() {}

    public static WebsiteSectionDto fromEntity(WebsiteSection s) {
        WebsiteSectionDto dto = new WebsiteSectionDto();
        dto.setId(s.getId());
        dto.setSectionKey(s.getSectionKey());
        dto.setTitle(s.getTitle());
        dto.setSubtitle(s.getSubtitle());
        dto.setContent(s.getContent());
        dto.setButtonLabel(s.getButtonLabel());
        dto.setButtonLink(s.getButtonLink());
        dto.setEnabled(s.getEnabled());
        dto.setDisplayOrder(s.getDisplayOrder());
        dto.setUpdatedAt(s.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSectionKey() { return sectionKey; }
    public void setSectionKey(String sectionKey) { this.sectionKey = sectionKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getButtonLabel() { return buttonLabel; }
    public void setButtonLabel(String buttonLabel) { this.buttonLabel = buttonLabel; }

    public String getButtonLink() { return buttonLink; }
    public void setButtonLink(String buttonLink) { this.buttonLink = buttonLink; }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
