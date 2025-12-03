package com.uade.api.tpo_g6_2025c1.exceptions.category;

public class InvalidCategoryNameException extends RuntimeException {
    public InvalidCategoryNameException() {
        super("Category name is required");
    }
}
