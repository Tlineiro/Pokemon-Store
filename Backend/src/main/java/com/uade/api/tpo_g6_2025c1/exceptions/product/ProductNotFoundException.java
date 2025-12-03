package com.uade.api.tpo_g6_2025c1.exceptions.product;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("Product with ID " + id + " not found");
    }
}
