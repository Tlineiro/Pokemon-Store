package com.uade.api.tpo_g6_2025c1.repository;

import com.uade.api.tpo_g6_2025c1.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductRepositoryCustom {
    Page<Product> findByCriteria(
            String name,
            List<String> categories,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    );
}
