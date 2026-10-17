package com.srianjaneya.store.repository;

import com.srianjaneya.store.entity.UploadedImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadedImageRepository extends JpaRepository<UploadedImage, String> {
}
