package com.uade.api.tpo_g6_2025c1.repository;

import com.uade.api.tpo_g6_2025c1.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, ProductRepositoryCustom {
    Page<Product> findByStockGreaterThan(int stock, Pageable pageable);
    List<Product> findBySellerId(Long sellerId);
}
