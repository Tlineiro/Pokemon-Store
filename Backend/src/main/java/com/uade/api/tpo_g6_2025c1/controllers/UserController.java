package com.uade.api.tpo_g6_2025c1.controllers;

import com.uade.api.tpo_g6_2025c1.exceptions.user.InvalidUserDataException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UnauthorizedException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserAlreadyExistsException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserNotFoundException;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.LoginRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.UpdateUserRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.UserRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.UserResponse;
import com.uade.api.tpo_g6_2025c1.service.UserService;
import com.uade.api.tpo_g6_2025c1.utils.AuthUtil;
import com.uade.api.tpo_g6_2025c1.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @RequestBody UserRequest request
    ) throws InvalidUserDataException, UserAlreadyExistsException {
        if (isInvalidUserRequest(request)) throw new InvalidUserDataException();

        User user = userService.registerUser(request);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest loginRequest
    ) throws UserNotFoundException {
        User user = userService.login(loginRequest);
        String role = user.isSeller() ? "SELLER" : "BUYER";
        String token = jwtUtil.generateToken(loginRequest.getUsername(), role);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", role);
        response.put("username", loginRequest.getUsername());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/autoDelete")
    public ResponseEntity<String> deleteMyAccount(
            @RequestHeader("Authorization") String authHeader
    ) throws UnauthorizedException, UserNotFoundException {
        User user = authUtil.getUserFromHeader(authHeader);
        userService.delete(user);

        return ResponseEntity.ok("Account deleted successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateUserRequest request
    ) throws UnauthorizedException, UserNotFoundException {
        User user = authUtil.getUserFromHeader(authHeader);
        User updatedUser = userService.updateUser(user, request);

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping()
    public ResponseEntity<UserResponse> getUser(
            @RequestHeader("Authorization") String authHeader
    ) throws UnauthorizedException, UserNotFoundException {
        User user = authUtil.getUserFromHeader(authHeader);
        UserResponse response = new UserResponse(
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.isSeller()
        );

        return ResponseEntity.ok(response);
    }

    private boolean isInvalidUserRequest(UserRequest request) {
        return request.getUsername() == null || request.getUsername().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getFirstName() == null || request.getFirstName().isBlank()
                || request.getLastName() == null || request.getLastName().isBlank();
    }
}
