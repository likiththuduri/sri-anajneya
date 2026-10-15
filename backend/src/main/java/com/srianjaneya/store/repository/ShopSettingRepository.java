package com.srianjaneya.store.repository;

import com.srianjaneya.store.entity.ShopSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopSettingRepository extends JpaRepository<ShopSetting, Long> {
}
