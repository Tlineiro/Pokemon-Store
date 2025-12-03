package com.uade.api.tpo_g6_2025c1.exceptions.product;

public class ProductOwnershipException extends RuntimeException {
    public ProductOwnershipException() {
        super("You are not the owner of this product");
    }
}
