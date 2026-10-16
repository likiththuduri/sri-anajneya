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
