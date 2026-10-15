package com.srianjaneya.store.controller;

import com.srianjaneya.store.dto.ShopSettingDto;
import com.srianjaneya.store.service.ShopSettingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/shop")
public class AdminShopController {

    private final ShopSettingService shopSettingService;

    public AdminShopController(ShopSettingService shopSettingService) {
        this.shopSettingService = shopSettingService;
    }

    @PutMapping("/settings")
    public ResponseEntity<ShopSettingDto> updateSettings(@Valid @RequestBody ShopSettingDto request) {
        ShopSettingDto updated = shopSettingService.updateShopSettings(request);
        return ResponseEntity.ok(updated);
    }
}
