package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.ShopSettingDto;
import com.srianjaneya.store.entity.ShopSetting;
import com.srianjaneya.store.repository.ShopSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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

        if (StringUtils.hasText(dto.getPhone())) setting.setPhone(dto.getPhone().trim());
        if (StringUtils.hasText(dto.getWhatsapp())) setting.setWhatsapp(dto.getWhatsapp().trim());
        if (StringUtils.hasText(dto.getAddress())) setting.setAddress(dto.getAddress().trim());
        if (StringUtils.hasText(dto.getState())) setting.setState(dto.getState().trim());
        if (StringUtils.hasText(dto.getHeroTitle())) setting.setHeroTitle(dto.getHeroTitle().trim());
        if (StringUtils.hasText(dto.getHeroSubtitle())) setting.setHeroSubtitle(dto.getHeroSubtitle().trim());
        if (StringUtils.hasText(dto.getHeroImageUrl())) setting.setHeroImageUrl(dto.getHeroImageUrl().trim());
        if (StringUtils.hasText(dto.getLogoUrl())) setting.setLogoUrl(dto.getLogoUrl().trim());

        ShopSetting saved = shopSettingRepository.save(setting);
        return ShopSettingDto.fromEntity(saved);
    }
}
