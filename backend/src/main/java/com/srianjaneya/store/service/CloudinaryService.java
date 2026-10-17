package com.srianjaneya.store.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.srianjaneya.store.config.CloudinaryConfig;
import com.srianjaneya.store.dto.ImageUploadResponse;
import com.srianjaneya.store.entity.UploadedImage;
import com.srianjaneya.store.exception.BadRequestException;
import com.srianjaneya.store.repository.UploadedImageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

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
    private final UploadedImageRepository imageRepository;
    private final String localUploadDir;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"
    );

    public CloudinaryService(
            Cloudinary cloudinary,
            CloudinaryConfig cloudinaryConfig,
            UploadedImageRepository imageRepository,
            @Value("${upload.local-dir:./uploads}") String localUploadDir) {
        this.cloudinary = cloudinary;
        this.cloudinaryConfig = cloudinaryConfig;
        this.imageRepository = imageRepository;
        this.localUploadDir = localUploadDir;
    }

    public ImageUploadResponse uploadImage(MultipartFile file, String folder) {
        validateFile(file);

        // 1. Try Cloudinary if credentials are configured
        if (cloudinaryConfig.isConfigured()) {
            try {
                log.info("Uploading image to Cloudinary (folder: {})...", folder);
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

            } catch (Exception e) {
                log.warn("Cloudinary upload failed ({}). Falling back smoothly to persistent MySQL database storage.", e.getMessage());
            }
        }

        // 2. Persistent Storage in MySQL (Guarantees survival on Render restarts, ephemeral disks, and all devices!)
        try {
            String imageId = "img_" + UUID.randomUUID().toString().replace("-", "");
            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
            String contentType = file.getContentType() != null ? file.getContentType() : "image/jpeg";
            byte[] bytes = file.getBytes();

            UploadedImage imageEntity = new UploadedImage(imageId, originalName, contentType, bytes, (long) bytes.length);
            imageRepository.save(imageEntity);
            log.info("Image saved persistently into MySQL database table 'uploaded_images' with id: {}", imageId);

            // Also save to local disk cache as secondary copy if possible
            try {
                Path uploadPath = Paths.get(localUploadDir).toAbsolutePath().normalize();
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                String ext = getFileExtension(originalName);
                String filename = imageId + (ext.isEmpty() ? ".jpg" : ext);
                Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception ex) {
                log.debug("Local disk backup write skipped or failed: {}", ex.getMessage());
            }

            // Return permanent public URL served by PublicImageController
            String dbImageUrl = "/api/images/" + imageId + "?t=" + System.currentTimeMillis();
            return ImageUploadResponse.success(dbImageUrl, imageId);

        } catch (IOException e) {
            log.error("Failed to read image bytes for database storage: ", e);
            throw new BadRequestException("Failed to process and store image: " + e.getMessage());
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
