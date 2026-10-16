package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.WebsiteSectionDto;
import com.srianjaneya.store.dto.WebsiteSectionReorderRequest;
import com.srianjaneya.store.entity.WebsiteSection;
import com.srianjaneya.store.exception.BadRequestException;
import com.srianjaneya.store.exception.ResourceNotFoundException;
import com.srianjaneya.store.repository.WebsiteSectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WebsiteSectionService {

    private final WebsiteSectionRepository sectionRepository;

    public WebsiteSectionService(WebsiteSectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    @jakarta.annotation.PostConstruct
    @Transactional
    public void initDefaultSections() {
        if (sectionRepository.count() == 0) {
            List<WebsiteSection> defaults = List.of(
                new WebsiteSection("announcement_bar", "Announcement Banner", "Top agricultural notice and store updates", null, null, true, 1),
                new WebsiteSection("hero", "Hero Banner", "Main banner featuring actual shop photograph and store introduction", "Explore Products", "/products", true, 2),
                new WebsiteSection("categories", "Product Categories", "Fertilizers, Pesticides, Certified Seeds, and Micronutrients", "View Category", "/products", true, 3),
                new WebsiteSection("featured_products", "Featured Agricultural Inputs", "Top-selling fertilizers and crop protection inputs", "View All Products", "/products", true, 4),
                new WebsiteSection("benefits", "Why Choose Sri Anjaneya", "Govt approved inputs, genuine quality, and fair farmer pricing", null, null, true, 5),
                new WebsiteSection("booking_info", "Advance Product Booking", "Reserve scarce seasonal fertilizers and hybrid seeds in advance", "Book Online", "/products", true, 6),
                new WebsiteSection("pickup_instructions", "Local Counter Pickup Policy", "Fast counter verification, vehicle loading, and UPI/Cash payment", "View Instructions", "/contact", true, 7),
                new WebsiteSection("location_map", "Store Location & Directions", "Easy road access in Telangana for tractor and transport loading", "Get Directions", "/contact", true, 8),
                new WebsiteSection("contact_section", "Contact & Store Hours", "Store timings, Call Now, and WhatsApp Us links", "Contact Us", "/contact", true, 9),
                new WebsiteSection("footer", "Footer & Shop Information", "Agricultural disclaimer, quick links, and copyright", null, null, true, 10),
                new WebsiteSection("floating_whatsapp", "Quick WhatsApp Floating Button", "Instant chat with store counter for stock inquiries", "WhatsApp Us", null, true, 11)
            );
            sectionRepository.saveAll(defaults);
        }
    }

    public List<WebsiteSectionDto> getAllSections() {
        return sectionRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(WebsiteSectionDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<WebsiteSectionDto> getActiveSections() {
        return sectionRepository.findByEnabledTrueOrderByDisplayOrderAsc()
                .stream()
                .map(WebsiteSectionDto::fromEntity)
                .collect(Collectors.toList());
    }

    public WebsiteSectionDto getSectionByKey(String sectionKey) {
        WebsiteSection section = sectionRepository.findBySectionKey(sectionKey)
                .orElseThrow(() -> new ResourceNotFoundException("Website section not found: " + sectionKey));
        return WebsiteSectionDto.fromEntity(section);
    }

    @Transactional
    public WebsiteSectionDto updateSection(String sectionKey, WebsiteSectionDto dto) {
        WebsiteSection section = sectionRepository.findBySectionKey(sectionKey)
                .orElseThrow(() -> new ResourceNotFoundException("Website section not found: " + sectionKey));

        // Security check: Admin login or essential entry point must never be disabled
        if ("admin_login".equalsIgnoreCase(sectionKey) && Boolean.FALSE.equals(dto.getEnabled())) {
            throw new BadRequestException("Admin login section cannot be disabled.");
        }

        if (dto.getTitle() != null) section.setTitle(dto.getTitle().trim());
        if (dto.getSubtitle() != null) section.setSubtitle(dto.getSubtitle().trim());
        if (dto.getContent() != null) section.setContent(dto.getContent().trim());
        if (dto.getButtonLabel() != null) section.setButtonLabel(dto.getButtonLabel().trim());
        if (dto.getButtonLink() != null) section.setButtonLink(dto.getButtonLink().trim());
        if (dto.getEnabled() != null) section.setEnabled(dto.getEnabled());
        if (dto.getDisplayOrder() != null) section.setDisplayOrder(dto.getDisplayOrder());

        WebsiteSection saved = sectionRepository.save(section);
        return WebsiteSectionDto.fromEntity(saved);
    }

    @Transactional
    public List<WebsiteSectionDto> reorderSections(WebsiteSectionReorderRequest request) {
        if (request.getOrders() != null) {
            for (WebsiteSectionReorderRequest.SectionOrder order : request.getOrders()) {
                if (order.getSectionKey() != null && order.getDisplayOrder() != null) {
                    sectionRepository.findBySectionKey(order.getSectionKey())
                            .ifPresent(s -> {
                                s.setDisplayOrder(order.getDisplayOrder());
                                sectionRepository.save(s);
                            });
                }
            }
        }
        return getAllSections();
    }
}
