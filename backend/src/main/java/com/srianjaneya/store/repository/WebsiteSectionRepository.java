package com.srianjaneya.store.repository;

import com.srianjaneya.store.entity.WebsiteSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebsiteSectionRepository extends JpaRepository<WebsiteSection, Long> {

    Optional<WebsiteSection> findBySectionKey(String sectionKey);

    List<WebsiteSection> findAllByOrderByDisplayOrderAsc();

    List<WebsiteSection> findByEnabledTrueOrderByDisplayOrderAsc();
}
