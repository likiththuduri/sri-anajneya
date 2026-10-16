package com.srianjaneya.store.controller;

import com.srianjaneya.store.dto.WebsiteSectionDto;
import com.srianjaneya.store.dto.WebsiteSectionReorderRequest;
import com.srianjaneya.store.service.WebsiteSectionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sections")
public class AdminSectionController {

    private final WebsiteSectionService sectionService;

    public AdminSectionController(WebsiteSectionService sectionService) {
        this.sectionService = sectionService;
    }

    @GetMapping
    public ResponseEntity<List<WebsiteSectionDto>> getAllSections() {
        return ResponseEntity.ok(sectionService.getAllSections());
    }

    @PutMapping("/{sectionKey}")
    public ResponseEntity<WebsiteSectionDto> updateSection(
            @PathVariable String sectionKey,
            @Valid @RequestBody WebsiteSectionDto request) {
        return ResponseEntity.ok(sectionService.updateSection(sectionKey, request));
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<WebsiteSectionDto>> reorderSections(
            @RequestBody WebsiteSectionReorderRequest request) {
        return ResponseEntity.ok(sectionService.reorderSections(request));
    }
}
