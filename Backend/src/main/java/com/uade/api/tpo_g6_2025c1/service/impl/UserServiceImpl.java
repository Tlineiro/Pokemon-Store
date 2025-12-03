package com.uade.api.tpo_g6_2025c1.service.impl;

import com.uade.api.tpo_g6_2025c1.exceptions.user.UserAlreadyExistsException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserNotFoundException;
import com.uade.api.tpo_g6_2025c1.model.Product;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.LoginRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.UpdateUserRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.UserRequest;
import com.uade.api.tpo_g6_2025c1.repository.ProductRepository;
import com.uade.api.tpo_g6_2025c1.repository.UserRepository;
import com.uade.api.tpo_g6_2025c1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProductRepository productRepository;

    public User registerUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())
                || userRepository.existsByEmail(request.getEmail()))
            throw new UserAlreadyExistsException();

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName(),
                request.isSeller()
        );

        return userRepository.save(user);
    }

    public User login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(UserNotFoundException::new);

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
            throw new UserNotFoundException();

        return user;
    }

    public void delete(User user) {
        List<Product> products = productRepository.findBySellerId(user.getId());
        for (Product product : products) {
            product.getCategories().clear();
            productRepository.delete(product);
        }

        userRepository.delete(user);
    }

    public User updateUser(User user, UpdateUserRequest request) {
        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPassword() != null) user.setPassword(passwordEncoder.encode(request.getPassword()));
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        user.setSeller(request.isSeller());

        return userRepository.save(user);
    }
}
