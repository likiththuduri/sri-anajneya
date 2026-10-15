package com.srianjaneya.store.service;

import com.srianjaneya.store.config.JwtTokenProvider;
import com.srianjaneya.store.dto.AuthRequest;
import com.srianjaneya.store.dto.AuthResponse;
import com.srianjaneya.store.entity.Admin;
import com.srianjaneya.store.exception.ResourceNotFoundException;
import com.srianjaneya.store.repository.AdminRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AdminRepository adminRepository;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            AdminRepository adminRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.adminRepository = adminRepository;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Admin admin = adminRepository.findByUsernameIgnoreCase(request.getUsername().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        return new AuthResponse(jwt, admin.getUsername(), admin.getFullName(), admin.getRole());
    }

    public AuthResponse getCurrentAdmin(String username) {
        Admin admin = adminRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));
        return new AuthResponse(null, admin.getUsername(), admin.getFullName(), admin.getRole());
    }
}
