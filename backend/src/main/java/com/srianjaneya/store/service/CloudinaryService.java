package com.srianjaneya.store.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.srianjaneya.store.config.CloudinaryConfig;
import com.srianjaneya.store.dto.ImageUploadResponse;
import com.srianjaneya.store.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

    private final Cloudinary cloudinary;
    private final CloudinaryConfig cloudinaryConfig;
    private final String localUploadDir;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"
    );

    public CloudinaryService(
            Cloudinary cloudinary,
            CloudinaryConfig cloudinaryConfig,
            @Value("${upload.local-dir:./uploads}") String localUploadDir) {
        this.cloudinary = cloudinary;
        this.cloudinaryConfig = cloudinaryConfig;
        this.localUploadDir = localUploadDir;
    }

    public ImageUploadResponse uploadImage(MultipartFile file, String folder) {
        validateFile(file);

        if (cloudinaryConfig.isConfigured()) {
            try {
                log.info("Uploading product image to Cloudinary (folder: {})...", folder);
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                        "folder", folder != null ? folder : "sri_anjaneya_products",
                        "resource_type", "image",
                        "unique_filename", true,
                        "overwrite", false
                ));

                String secureUrl = (String) uploadResult.get("secure_url");
                String publicId = (String) uploadResult.get("public_id");

                // Append cache-busting timestamp param to ensure cross-device updates reflect immediately
                String cacheBustedUrl = secureUrl.contains("?")
                        ? secureUrl + "&t=" + System.currentTimeMillis()
                        : secureUrl + "?t=" + System.currentTimeMillis();

                log.info("Cloudinary upload successful: {}", cacheBustedUrl);
                return ImageUploadResponse.success(cacheBustedUrl, publicId);

            } catch (IOException e) {
                log.error("Cloudinary upload error: ", e);
                throw new BadRequestException("Failed to upload image to Cloudinary: " + e.getMessage());
            }
        } else {
            // Development fallback when CLOUDINARY credentials are empty in environment
            log.warn("Cloudinary credentials not configured. Falling back to local storage for local development.");
            try {
                Path uploadPath = Paths.get(localUploadDir).toAbsolutePath().normalize();
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String ext = getFileExtension(file.getOriginalFilename());
                String filename = "prod-" + UUID.randomUUID() + (ext.isEmpty() ? ".jpg" : ext);
                Path targetLocation = uploadPath.resolve(filename);

                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                // Return URL relative to server or data URI
                String localUrl = "/uploads/" + filename + "?t=" + System.currentTimeMillis();
                return ImageUploadResponse.success(localUrl, filename);
            } catch (IOException e) {
                log.error("Local file storage fallback failed: ", e);
                throw new BadRequestException("Failed to save image locally: " + e.getMessage());
            }
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No image file was provided.");
        }

        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            throw new BadRequestException("Image file size exceeds maximum limit of 10MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file type: " + contentType + ". Only JPEG, PNG, WebP, GIF and SVG images are accepted.");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}
