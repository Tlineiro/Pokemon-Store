package com.uade.api.tpo_g6_2025c1.service;

import com.uade.api.tpo_g6_2025c1.exceptions.user.UserAlreadyExistsException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserNotFoundException;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.LoginRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.UpdateUserRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.UserRequest;

public interface UserService {
    User registerUser(UserRequest request)
            throws UserAlreadyExistsException;
    User login(LoginRequest loginRequest)
            throws UserNotFoundException;
    void delete(User user);
    User updateUser(User user, UpdateUserRequest request);
}
