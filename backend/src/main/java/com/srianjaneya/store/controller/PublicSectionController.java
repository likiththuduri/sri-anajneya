package com.srianjaneya.store.controller;

import com.srianjaneya.store.dto.WebsiteSectionDto;
import com.srianjaneya.store.service.WebsiteSectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class PublicSectionController {

    private final WebsiteSectionService sectionService;

    public PublicSectionController(WebsiteSectionService sectionService) {
        this.sectionService = sectionService;
    }

    @GetMapping
    public ResponseEntity<List<WebsiteSectionDto>> getActiveSections() {
        return ResponseEntity.ok(sectionService.getActiveSections());
    }

    @GetMapping("/{sectionKey}")
    public ResponseEntity<WebsiteSectionDto> getSectionByKey(@PathVariable String sectionKey) {
        return ResponseEntity.ok(sectionService.getSectionByKey(sectionKey));
    }
}
