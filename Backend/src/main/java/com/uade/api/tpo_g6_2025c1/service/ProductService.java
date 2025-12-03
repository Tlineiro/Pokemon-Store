package com.uade.api.tpo_g6_2025c1.service;

import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductOwnershipException;
import com.uade.api.tpo_g6_2025c1.model.Product;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.ProductRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.ProductResponse;
import com.uade.api.tpo_g6_2025c1.model.dto.ProductSearchRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.UpdateProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    ProductResponse mapToProductResponse(Product product);
    Product createProduct(ProductRequest request, User seller);
    Product updateProduct(Long productId, Long sellerId, UpdateProductRequest request)
            throws ProductNotFoundException, ProductOwnershipException;
    void deleteProduct(Long productId, Long sellerId)
            throws ProductNotFoundException, ProductOwnershipException;
    Page<Product> getAllProducts(Pageable pageable);
    Product getProductById(Long productId)
            throws ProductNotFoundException;
    Page<Product> getAvailableProducts(Pageable pageable);
    Page<Product> searchProducts(ProductSearchRequest request, Pageable pageable);
    List<Product> getProductsBySellerId(Long id);
}
