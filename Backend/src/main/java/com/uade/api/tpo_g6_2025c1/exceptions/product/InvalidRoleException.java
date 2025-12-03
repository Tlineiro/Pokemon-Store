package com.uade.api.tpo_g6_2025c1.exceptions.product;

public class InvalidRoleException extends RuntimeException {
    public InvalidRoleException() {
        super("Only sellers can create products");
    }
}
