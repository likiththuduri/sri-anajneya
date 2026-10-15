package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.OrderCreateRequestDto;
import com.srianjaneya.store.dto.OrderItemRequestDto;
import com.srianjaneya.store.dto.OrderResponseDto;
import com.srianjaneya.store.entity.Order;
import com.srianjaneya.store.entity.OrderItem;
import com.srianjaneya.store.entity.Product;
import com.srianjaneya.store.entity.ShopSetting;
import com.srianjaneya.store.exception.BadRequestException;
import com.srianjaneya.store.exception.ResourceNotFoundException;
import com.srianjaneya.store.repository.OrderRepository;
import com.srianjaneya.store.repository.ProductRepository;
import com.srianjaneya.store.repository.ShopSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ShopSettingRepository shopSettingRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            ShopSettingRepository shopSettingRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.shopSettingRepository = shopSettingRepository;
    }

    @Transactional
    public OrderResponseDto createOrder(OrderCreateRequestDto request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Your shopping cart is empty. Please add items before placing an order.");
        }

        // 1. Generate unique human-readable Order Number
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomPart = ThreadLocalRandom.current().nextInt(1000, 9999);
        String orderNumber = "SA-" + datePart + "-" + randomPart;

        BigDecimal totalAmount = BigDecimal.ZERO;
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setCustomerName(request.getCustomerName().trim());
        order.setCustomerMobile(request.getCustomerMobile().trim());
        order.setCustomerVillage(StringUtils.hasText(request.getCustomerVillage()) ? request.getCustomerVillage().trim() : "Telangana");
        order.setCustomerNotes(request.getCustomerNotes());
        order.setStatus("PENDING");

        // 2. Validate products and adjust stock atomically
        for (OrderItemRequestDto itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new BadRequestException("Product not found with ID: " + itemReq.getProductId()));

            if (!product.getActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is currently unavailable.");
            }

            if (product.getStock() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for '" + product.getName() +
                        "'. Requested: " + itemReq.getQuantity() + ", Available: " + product.getStock());
            }

            // Deduct stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = new OrderItem(
                    product.getId(),
                    product.getName(),
                    product.getBrand(),
                    product.getPackSize(),
                    product.getPrice(),
                    itemReq.getQuantity(),
                    subtotal
            );
            order.addItem(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // 3. Retrieve Shop Settings for WhatsApp formatting
        ShopSetting setting = shopSettingRepository.findById(1L).orElseGet(ShopSetting::new);
        String shopWhatsAppNumber = cleanPhoneNumber(setting.getWhatsapp());
        String shopPhone = setting.getPhone();

        // 4. Build WhatsApp order message
        String whatsAppMessage = buildWhatsAppMessage(savedOrder, setting);
        String encodedMessage = URLEncoder.encode(whatsAppMessage, StandardCharsets.UTF_8);
        String whatsAppUrl = "https://wa.me/" + shopWhatsAppNumber + "?text=" + encodedMessage;

        OrderResponseDto response = OrderResponseDto.fromEntity(savedOrder);
        response.setWhatsAppMessage(whatsAppMessage);
        response.setWhatsAppUrl(whatsAppUrl);

        return response;
    }

    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(OrderResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public OrderResponseDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        return OrderResponseDto.fromEntity(order);
    }

    public OrderResponseDto getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with Order Number: " + orderNumber));
        return OrderResponseDto.fromEntity(order);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        order.setStatus(newStatus.toUpperCase().trim());
        Order updated = orderRepository.save(order);
        return OrderResponseDto.fromEntity(updated);
    }

    private String buildWhatsAppMessage(Order order, ShopSetting setting) {
        StringBuilder sb = new StringBuilder();
        sb.append("*SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS*\n");
        sb.append("*Official Local Pickup Order*\n\n");
        sb.append("📋 *Order Number:* ").append(order.getOrderNumber()).append("\n");
        sb.append("👤 *Customer Name:* ").append(order.getCustomerName()).append("\n");
        sb.append("📱 *Mobile Number:* ").append(order.getCustomerMobile()).append("\n");
        if (StringUtils.hasText(order.getCustomerVillage())) {
            sb.append("📍 *Village/Town:* ").append(order.getCustomerVillage()).append("\n");
        }
        sb.append("\n🛒 *Order Items:*\n");

        int index = 1;
        for (OrderItem item : order.getItems()) {
            sb.append(index++).append(". ").append(item.getProductName())
              .append(" (").append(item.getPackSize()).append(")")
              .append(" x ").append(item.getQuantity())
              .append(" = ₹").append(item.getSubtotal()).append("\n");
        }

        sb.append("\n💰 *Total Amount:* ₹").append(order.getTotalAmount()).append("\n");

        if (StringUtils.hasText(order.getCustomerNotes())) {
            sb.append("📝 *Notes:* ").append(order.getCustomerNotes()).append("\n");
        }

        sb.append("\n🏬 *Store Pickup Instructions:*\n");
        sb.append("Please visit our shop for order collection:\n");
        sb.append("*SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS*\n");
        sb.append(setting.getAddress()).append("\n");
        sb.append("📞 Contact: +").append(setting.getPhone()).append("\n");
        sb.append("💵 Payment: Cash / UPI at the time of store pickup.\n");

        return sb.toString();
    }

    private String cleanPhoneNumber(String phone) {
        if (!StringUtils.hasText(phone)) return "917095891270";
        String cleaned = phone.replaceAll("[^0-9]", "");
        if (cleaned.length() == 10) {
            return "91" + cleaned;
        }
        return cleaned;
    }
}
