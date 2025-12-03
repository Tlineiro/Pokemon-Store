package com.uade.api.tpo_g6_2025c1.exceptions.cart;

public class ShoppingCartNotFoundException extends RuntimeException {
    public ShoppingCartNotFoundException(Long userId) {
        super("The user with ID " + userId + " does not have a shopping cart");
    }
}
