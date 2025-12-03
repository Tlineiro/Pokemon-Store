package com.uade.api.tpo_g6_2025c1.exceptions.user;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException() {
        super("You must be logged in to perform this action");
    }
}
