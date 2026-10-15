package com.srianjaneya.store.dto;

public class ImageUploadResponse {
    private String url;
    private String publicId;
    private String message;
    private boolean success;

    public ImageUploadResponse() {}

    public ImageUploadResponse(String url, String publicId, String message, boolean success) {
        this.url = url;
        this.publicId = publicId;
        this.message = message;
        this.success = success;
    }

    public static ImageUploadResponse success(String url, String publicId) {
        return new ImageUploadResponse(url, publicId, "Image uploaded successfully to Cloudinary", true);
    }

    public static ImageUploadResponse error(String message) {
        return new ImageUploadResponse(null, null, message, false);
    }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
