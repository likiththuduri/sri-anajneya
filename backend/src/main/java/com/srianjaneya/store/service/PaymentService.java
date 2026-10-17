package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.*;
import com.srianjaneya.store.entity.Booking;
import com.srianjaneya.store.entity.Order;
import com.srianjaneya.store.entity.Payment;
import com.srianjaneya.store.entity.ShopSetting;
import com.srianjaneya.store.exception.BadRequestException;
import com.srianjaneya.store.exception.ResourceNotFoundException;
import com.srianjaneya.store.repository.BookingRepository;
import com.srianjaneya.store.repository.OrderRepository;
import com.srianjaneya.store.repository.PaymentRepository;
import com.srianjaneya.store.repository.ShopSettingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final BookingRepository bookingRepository;
    private final ShopSettingRepository shopSettingRepository;
    private final RazorpayService razorpayService;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            BookingRepository bookingRepository,
            ShopSettingRepository shopSettingRepository,
            RazorpayService razorpayService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.bookingRepository = bookingRepository;
        this.shopSettingRepository = shopSettingRepository;
        this.razorpayService = razorpayService;
    }

    public PaymentConfigResponse getConfig() {
        boolean enabled = razorpayService.isConfigured();
        String keyId = razorpayService.getKeyId();
        String shopName = shopSettingRepository.findById(1L)
                .map(ShopSetting::getShopName)
                .orElse("SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS");
        return new PaymentConfigResponse(enabled, keyId, "INR", shopName);
    }

    @Transactional
    public PaymentInitiateResponse initiatePayment(PaymentInitiateRequest request) {
        if (!razorpayService.isConfigured()) {
            throw new BadRequestException("Online payments are currently in test/setup mode and not enabled. Please choose 'Pay on In-Store Counter Pickup'.");
        }

        BigDecimal amount = request.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ONE) < 0) {
            throw new BadRequestException("Payment amount must be at least ₹1.00");
        }

        // Generate unique payment reference: PAY-yyyyMMdd-XXXX
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randPart = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String paymentReference = "PAY-" + datePart + "-" + randPart;

        String receipt = request.getOrderNumber() != null ? request.getOrderNumber()
                : (request.getBookingReference() != null ? request.getBookingReference() : paymentReference);

        String razorpayOrderId = razorpayService.createOrder(amount, receipt);

        Payment payment = new Payment();
        payment.setPaymentReference(paymentReference);
        payment.setOrderNumber(request.getOrderNumber());
        payment.setBookingReference(request.getBookingReference());
        payment.setGateway("RAZORPAY");
        payment.setGatewayOrderId(razorpayOrderId);
        payment.setAmount(amount);
        payment.setCurrency("INR");
        payment.setStatus("CREATED");
        payment.setCustomerName(request.getCustomerName());
        payment.setCustomerMobile(request.getCustomerMobile());

        paymentRepository.save(payment);

        return new PaymentInitiateResponse(
                paymentReference,
                razorpayOrderId,
                amount,
                "INR",
                razorpayService.getKeyId(),
                request.getCustomerName(),
                request.getCustomerMobile()
        );
    }

    @Transactional
    public PaymentVerifyResponse verifyPayment(PaymentVerifyRequest request) {
        Payment payment = paymentRepository.findByPaymentReference(request.getPaymentReference())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found: " + request.getPaymentReference()));

        if ("SUCCESS".equals(payment.getStatus())) {
            return new PaymentVerifyResponse(
                    true,
                    "Payment already successfully verified.",
                    "SUCCESS",
                    payment.getOrderNumber(),
                    payment.getBookingReference()
            );
        }

        boolean isValid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValid) {
            payment.setStatus("FAILED");
            payment.setGatewayPaymentId(request.getRazorpayPaymentId());
            payment.setGatewaySignature(request.getRazorpaySignature());
            paymentRepository.save(payment);
            throw new BadRequestException("Cryptographic payment verification failed. Invalid gateway signature.");
        }

        // Mark payment successful
        payment.setStatus("SUCCESS");
        payment.setGatewayPaymentId(request.getRazorpayPaymentId());
        payment.setGatewaySignature(request.getRazorpaySignature());
        paymentRepository.save(payment);

        // Update Order if present
        if (payment.getOrderNumber() != null && !payment.getOrderNumber().isBlank()) {
            Optional<Order> orderOpt = orderRepository.findByOrderNumber(payment.getOrderNumber());
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                order.setStatus("CONFIRMED");
                orderRepository.save(order);
            }
        }

        // Update Booking if present
        if (payment.getBookingReference() != null && !payment.getBookingReference().isBlank()) {
            Optional<Booking> bookingOpt = bookingRepository.findByBookingReference(payment.getBookingReference());
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                // Advance booking paid online
                bookingRepository.save(booking);
            }
        }

        return new PaymentVerifyResponse(
                true,
                "Payment successfully verified and confirmed via Razorpay gateway.",
                "SUCCESS",
                payment.getOrderNumber(),
                payment.getBookingReference()
        );
    }

    public Page<PaymentDto> getPayments(Pageable pageable) {
        return paymentRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(PaymentDto::fromEntity);
    }
}
