package com.uade.api.tpo_g6_2025c1.controllers;

import com.uade.api.tpo_g6_2025c1.exceptions.category.CategoryDuplicateException;
import com.uade.api.tpo_g6_2025c1.exceptions.category.CategoryNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.category.InvalidCategoryNameException;
import com.uade.api.tpo_g6_2025c1.model.Category;
import com.uade.api.tpo_g6_2025c1.model.dto.CategoryRequest;
import com.uade.api.tpo_g6_2025c1.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("categories")
public class CategoriesController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody CategoryRequest categoryRequest
    ) throws InvalidCategoryNameException, CategoryDuplicateException {
        if (categoryRequest.getName() == null || categoryRequest.getName().isBlank())
            throw new InvalidCategoryNameException();

        Category result = categoryService.createCategory(categoryRequest.getName());

        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        if (categories.isEmpty()) return ResponseEntity.noContent().build();

        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long categoryId
    ) throws CategoryNotFoundException {
        Category result = categoryService.getCategoryById(categoryId);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryRequest request
    ) throws InvalidCategoryNameException, CategoryNotFoundException {
        if (request.getName() == null || request.getName().isBlank())
            throw new InvalidCategoryNameException();

        Category category = categoryService.getCategoryById(categoryId);
        category.setName(request.getName());

        return ResponseEntity.ok(categoryService.updateCategory(category));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Object> deleteCategory(
            @PathVariable Long categoryId
    ) throws CategoryNotFoundException {
        Category category = categoryService.getCategoryById(categoryId);
        categoryService.delete(category);

        return ResponseEntity.ok("Category deleted successfully");
    }
}
