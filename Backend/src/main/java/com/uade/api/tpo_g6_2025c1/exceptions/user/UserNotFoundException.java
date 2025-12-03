package com.uade.api.tpo_g6_2025c1.exceptions.user;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("Incorrect username or password");
    }
}
