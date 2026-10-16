package com.srianjaneya.store.controller;

import com.srianjaneya.store.dto.ImageUploadResponse;
import com.srianjaneya.store.dto.ShopSettingDto;
import com.srianjaneya.store.service.CloudinaryService;
import com.srianjaneya.store.service.ShopSettingService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/shop")
public class AdminShopController {

    private final ShopSettingService shopSettingService;
    private final CloudinaryService cloudinaryService;

    public AdminShopController(ShopSettingService shopSettingService, CloudinaryService cloudinaryService) {
        this.shopSettingService = shopSettingService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/settings")
    public ResponseEntity<ShopSettingDto> getSettings() {
        return ResponseEntity.ok(shopSettingService.getShopSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<ShopSettingDto> updateSettings(@Valid @RequestBody ShopSettingDto request) {
        ShopSettingDto updated = shopSettingService.updateShopSettings(request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> uploadShopAsset(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "sri_anjaneya_shop") String folder) {
        ImageUploadResponse response = cloudinaryService.uploadImage(file, folder);
        return ResponseEntity.ok(response);
    }
}
