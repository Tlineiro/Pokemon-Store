package com.uade.api.tpo_g6_2025c1.exceptions.cart;

public class ProductNotInCartException extends RuntimeException {
    public ProductNotInCartException() {
        super("The product is not in the cart");
    }
}
