package com.uade.api.tpo_g6_2025c1.utils;

import com.uade.api.tpo_g6_2025c1.exceptions.user.UnauthorizedException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserNotFoundException;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthUtil(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    public User getUserFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException();
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            throw new UnauthorizedException();
        }

        String username = jwtUtil.getUsernameFromToken(token);
        return userRepository.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);
    }
}
