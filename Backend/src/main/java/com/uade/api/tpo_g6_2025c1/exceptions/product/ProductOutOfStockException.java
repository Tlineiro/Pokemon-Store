package com.uade.api.tpo_g6_2025c1.exceptions.product;

public class ProductOutOfStockException extends RuntimeException {
    public ProductOutOfStockException() {
        super("You cant add more products to the cart than the available stock");
    }
}
