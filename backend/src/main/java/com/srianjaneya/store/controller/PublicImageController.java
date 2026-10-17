package com.srianjaneya.store.controller;

import com.srianjaneya.store.entity.UploadedImage;
import com.srianjaneya.store.repository.UploadedImageRepository;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/images")
public class PublicImageController {

    private final UploadedImageRepository imageRepository;

    public PublicImageController(UploadedImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable String id) {
        return imageRepository.findById(id)
                .map(image -> {
                    MediaType mediaType;
                    try {
                        mediaType = MediaType.parseMediaType(image.getContentType());
                    } catch (Exception e) {
                        mediaType = MediaType.IMAGE_JPEG;
                    }

                    return ResponseEntity.ok()
                            .contentType(mediaType)
                            .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic().immutable())
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getFileName() + "\"")
                            .body(image.getImageData());
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
