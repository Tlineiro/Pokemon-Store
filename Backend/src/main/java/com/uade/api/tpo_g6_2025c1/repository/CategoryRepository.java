package com.uade.api.tpo_g6_2025c1.repository;

import com.uade.api.tpo_g6_2025c1.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByName(String name);
}
