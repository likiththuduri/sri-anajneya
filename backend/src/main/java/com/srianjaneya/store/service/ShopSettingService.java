package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.ShopSettingDto;
import com.srianjaneya.store.entity.ShopSetting;
import com.srianjaneya.store.repository.ShopSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShopSettingService {

    private final ShopSettingRepository shopSettingRepository;

    public ShopSettingService(ShopSettingRepository shopSettingRepository) {
        this.shopSettingRepository = shopSettingRepository;
    }

    public ShopSettingDto getShopSettings() {
        ShopSetting setting = shopSettingRepository.findById(1L).orElseGet(ShopSetting::new);
        return ShopSettingDto.fromEntity(setting);
    }

    @Transactional
    public ShopSettingDto updateShopSettings(ShopSettingDto dto) {
        ShopSetting setting = shopSettingRepository.findById(1L).orElseGet(ShopSetting::new);
        dto.updateEntity(setting);
        ShopSetting saved = shopSettingRepository.save(setting);
        return ShopSettingDto.fromEntity(saved);
    }
}
