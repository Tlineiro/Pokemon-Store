package com.uade.api.tpo_g6_2025c1.service.impl;

import com.uade.api.tpo_g6_2025c1.exceptions.category.CategoryDuplicateException;
import com.uade.api.tpo_g6_2025c1.exceptions.category.CategoryNotFoundException;
import com.uade.api.tpo_g6_2025c1.model.Category;
import com.uade.api.tpo_g6_2025c1.repository.CategoryRepository;
import com.uade.api.tpo_g6_2025c1.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(String name) throws CategoryDuplicateException {
        List<Category> categories = categoryRepository.findByName(name);
        if (categories.isEmpty())
            return categoryRepository.save(new Category(name));
        throw new CategoryDuplicateException();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(CategoryNotFoundException::new);
    }

    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void delete(Category category) {
        categoryRepository.delete(category);
    }
}
