package com.uade.api.tpo_g6_2025c1.repository;

import com.uade.api.tpo_g6_2025c1.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    // Custom query methods can be defined here if needed
}
