package com.uade.api.tpo_g6_2025c1.exceptions.user;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException() {
        super("A user with that username or email already exists");
    }
}
