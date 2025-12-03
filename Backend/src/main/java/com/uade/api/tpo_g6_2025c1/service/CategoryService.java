package com.uade.api.tpo_g6_2025c1.service;

import com.uade.api.tpo_g6_2025c1.exceptions.category.CategoryDuplicateException;
import com.uade.api.tpo_g6_2025c1.exceptions.category.CategoryNotFoundException;
import com.uade.api.tpo_g6_2025c1.model.Category;

import java.util.List;

public interface CategoryService {
    Category createCategory(String name)
            throws CategoryDuplicateException;
    List<Category> getAllCategories();
    Category getCategoryById(Long categoryId)
            throws CategoryNotFoundException;
    Category updateCategory(Category category);
    void delete(Category category);
}
