package com.uade.api.tpo_g6_2025c1.exceptions.category;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException() {
        super("Category not found");
    }
}
