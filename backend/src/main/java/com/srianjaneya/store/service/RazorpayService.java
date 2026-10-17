package com.srianjaneya.store.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.srianjaneya.store.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    @Value("${razorpay.key.id:}")
    private String keyId;

    @Value("${razorpay.key.secret:}")
    private String keySecret;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public boolean isConfigured() {
        return keyId != null && !keyId.isBlank()
                && keySecret != null && !keySecret.isBlank()
                && !keyId.startsWith("YOUR_")
                && !keySecret.startsWith("YOUR_");
    }

    public String getKeyId() {
        return keyId != null ? keyId.trim() : "";
    }

    /**
     * Creates an order with Razorpay in INR.
     * @param amount In rupees
     * @param receipt Our internal reference
     * @return razorpay_order_id (e.g. order_EKwxwp9A77qT8g)
     */
    public String createOrder(BigDecimal amount, String receipt) {
        if (!isConfigured()) {
            throw new BadRequestException("Online payment is not configured. Please use local counter pickup or configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend environment variables.");
        }

        try {
            long paise = amount.multiply(BigDecimal.valueOf(100)).longValue();

            Map<String, Object> bodyMap = new HashMap<>();
            bodyMap.put("amount", paise);
            bodyMap.put("currency", "INR");
            bodyMap.put("receipt", receipt);

            String requestBody = objectMapper.writeValueAsString(bodyMap);
            String authHeader = "Basic " + Base64.getEncoder().encodeToString(
                    (keyId.trim() + ":" + keySecret.trim()).getBytes(StandardCharsets.UTF_8)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.has("id")) {
                    return root.get("id").asText();
                }
            }

            log.error("Failed to create Razorpay order: status={}, body={}", response.statusCode(), response.body());
            throw new BadRequestException("Payment gateway could not initiate transaction. Response: " + response.body());
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Exception creating Razorpay order", e);
            throw new BadRequestException("Payment gateway communication failed: " + e.getMessage());
        }
    }

    /**
     * Verifies the cryptographic HMAC SHA256 signature from Razorpay.
     */
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        if (!isConfigured()) {
            log.warn("Cannot verify signature: Razorpay secret is not configured.");
            return false;
        }

        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.trim().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);

            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            String computedSignature = hexString.toString();
            return MessageDigest.isEqual(
                    computedSignature.getBytes(StandardCharsets.UTF_8),
                    razorpaySignature.trim().getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Error verifying Razorpay signature", e);
            return false;
        }
    }
}
