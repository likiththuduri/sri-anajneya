package com.srianjaneya.store.controller;

import com.srianjaneya.store.dto.ShopSettingDto;
import com.srianjaneya.store.service.ShopSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shop")
public class PublicShopController {

    private final ShopSettingService shopSettingService;

    public PublicShopController(ShopSettingService shopSettingService) {
        this.shopSettingService = shopSettingService;
    }

    @GetMapping("/settings")
    public ResponseEntity<ShopSettingDto> getPublicSettings() {
        return ResponseEntity.ok(shopSettingService.getShopSettings());
    }
}
