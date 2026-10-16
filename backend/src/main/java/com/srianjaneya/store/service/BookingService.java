package com.srianjaneya.store.service;

import com.srianjaneya.store.dto.BookingCreateRequest;
import com.srianjaneya.store.dto.BookingDto;
import com.srianjaneya.store.dto.BookingStatusUpdateRequest;
import com.srianjaneya.store.entity.Booking;
import com.srianjaneya.store.entity.Product;
import com.srianjaneya.store.entity.ShopSetting;
import com.srianjaneya.store.exception.BadRequestException;
import com.srianjaneya.store.exception.ResourceNotFoundException;
import com.srianjaneya.store.repository.BookingRepository;
import com.srianjaneya.store.repository.ProductRepository;
import com.srianjaneya.store.repository.ShopSettingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final ShopSettingRepository shopSettingRepository;

    public BookingService(
            BookingRepository bookingRepository,
            ProductRepository productRepository,
            ShopSettingRepository shopSettingRepository) {
        this.bookingRepository = bookingRepository;
        this.productRepository = productRepository;
        this.shopSettingRepository = shopSettingRepository;
    }

    private String getShopWhatsappNumber() {
        return shopSettingRepository.findById(1L)
                .map(ShopSetting::getWhatsapp)
                .orElse("919000000000");
    }

    @Transactional
    public BookingDto createBooking(BookingCreateRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProductId()));

        if (Boolean.FALSE.equals(product.getActive())) {
            throw new BadRequestException("This product is currently inactive and cannot be booked.");
        }

        if (Boolean.FALSE.equals(product.getBookingAvailable())) {
            throw new BadRequestException("Advance booking is not available for this product.");
        }

        if (request.getQuantity() == null || request.getQuantity() < 1) {
            throw new BadRequestException("Booking quantity must be at least 1.");
        }

        // Generate unique booking reference: BK-yyyyMMdd-XXXX
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randPart = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String bookingReference = "BK-" + datePart + "-" + randPart;

        BigDecimal unitPrice = product.getPrice();
        BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        Booking booking = new Booking();
        booking.setBookingReference(bookingReference);
        booking.setProduct(product);
        booking.setProductName(product.getName());
        booking.setBrand(product.getBrand());
        booking.setPackSize(product.getPackSize());
        booking.setUnitPrice(unitPrice);
        booking.setQuantity(request.getQuantity());
        booking.setTotalAmount(totalAmount);
        booking.setCustomerName(request.getCustomerName().trim());
        booking.setCustomerMobile(request.getCustomerMobile().trim());
        booking.setPreferredPickupDate(request.getPreferredPickupDate());
        booking.setCustomerNotes(request.getCustomerNotes() != null ? request.getCustomerNotes().trim() : null);
        booking.setStatus("PENDING");

        Booking saved = bookingRepository.save(booking);
        return BookingDto.fromEntity(saved, getShopWhatsappNumber());
    }

    public BookingDto getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Booking request not found for reference: " + reference));
        return BookingDto.fromEntity(booking, getShopWhatsappNumber());
    }

    public Page<BookingDto> getBookings(String status, String search, Pageable pageable) {
        String cleanStatus = (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status))
                ? status.trim().toUpperCase() : null;
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;

        String whatsapp = getShopWhatsappNumber();
        return bookingRepository.searchBookings(cleanStatus, cleanSearch, pageable)
                .map(b -> BookingDto.fromEntity(b, whatsapp));
    }

    public List<BookingDto> getAllBookings() {
        String whatsapp = getShopWhatsappNumber();
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(b -> BookingDto.fromEntity(b, whatsapp))
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDto updateBookingStatus(Long id, BookingStatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        String currentStatus = booking.getStatus();
        String newStatus = request.getStatus().trim().toUpperCase();

        if (!isValidStatus(newStatus)) {
            throw new BadRequestException("Invalid booking status: " + newStatus);
        }

        // Validate state transitions
        if ("COLLECTED".equals(currentStatus) || "REJECTED".equals(currentStatus) || "CANCELLED".equals(currentStatus)) {
            throw new BadRequestException("Cannot change status of a completed/terminal booking (" + currentStatus + ").");
        }

        // Stock revalidation on ACCEPTED transition
        if ("ACCEPTED".equals(newStatus) && !"ACCEPTED".equals(currentStatus)) {
            Product product = booking.getProduct();
            if (product != null) {
                if (product.getStock() < booking.getQuantity()) {
                    throw new BadRequestException("Cannot accept booking: Available stock (" + product.getStock()
                            + ") is less than booked quantity (" + booking.getQuantity() + "). Please replenish stock first.");
                }
                // Deduct stock upon accepting the advance booking
                product.setStock(product.getStock() - booking.getQuantity());
                productRepository.save(product);
            }
        }

        // If an ACCEPTED or READY_FOR_PICKUP booking gets CANCELLED or REJECTED, restore the stock
        if (("CANCELLED".equals(newStatus) || "REJECTED".equals(newStatus)) &&
                ("ACCEPTED".equals(currentStatus) || "READY_FOR_PICKUP".equals(currentStatus))) {
            Product product = booking.getProduct();
            if (product != null) {
                product.setStock(product.getStock() + booking.getQuantity());
                productRepository.save(product);
            }
        }

        booking.setStatus(newStatus);
        if (request.getAdminNotes() != null) {
            booking.setAdminNotes(request.getAdminNotes().trim());
        }

        Booking saved = bookingRepository.save(booking);
        return BookingDto.fromEntity(saved, getShopWhatsappNumber());
    }

    @Transactional
    public BookingDto updateAdminNotes(Long id, String notes) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        booking.setAdminNotes(notes != null ? notes.trim() : "");
        Booking saved = bookingRepository.save(booking);
        return BookingDto.fromEntity(saved, getShopWhatsappNumber());
    }

    private boolean isValidStatus(String status) {
        return List.of("PENDING", "ACCEPTED", "REJECTED", "READY_FOR_PICKUP", "COLLECTED", "CANCELLED")
                .contains(status);
    }
}
