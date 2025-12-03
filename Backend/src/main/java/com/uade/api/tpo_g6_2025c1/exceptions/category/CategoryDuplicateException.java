package com.uade.api.tpo_g6_2025c1.exceptions.category;

public class CategoryDuplicateException extends RuntimeException {
    public CategoryDuplicateException() {
        super("The category already exists");
    }
}
