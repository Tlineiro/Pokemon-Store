package com.uade.api.tpo_g6_2025c1.controllers;

import com.uade.api.tpo_g6_2025c1.exceptions.product.InvalidRoleException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UnauthorizedException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserNotFoundException;
import com.uade.api.tpo_g6_2025c1.mapper.ProductMapper;
import com.uade.api.tpo_g6_2025c1.model.Product;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.*;
import com.uade.api.tpo_g6_2025c1.service.ProductService;
import com.uade.api.tpo_g6_2025c1.utils.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private ProductMapper productMapper;

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ProductRequest request
    ) throws UnauthorizedException, UserNotFoundException, InvalidRoleException {
        User seller = authUtil.getUserFromHeader(authHeader);
        if (!seller.isSeller()) throw new InvalidRoleException();

        Product product = productService.createProduct(request, seller);

        return ResponseEntity.ok(product);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long productId,
            @RequestBody UpdateProductRequest request
    ) throws UnauthorizedException, UserNotFoundException {
        User seller = authUtil.getUserFromHeader(authHeader);
        Product updated = productService.updateProduct(productId, seller.getId(), request);
        ProductResponse response = productService.mapToProductResponse(updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long productId
    ) throws UnauthorizedException, UserNotFoundException {
        User seller = authUtil.getUserFromHeader(authHeader);
        productService.deleteProduct(productId, seller.getId());

        return ResponseEntity.ok("Product deleted successfully");
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage = productService.getAllProducts(pageable);

        if (productsPage.isEmpty()) return ResponseEntity.noContent().build();

        Page<ProductResponse> responsePage = productsPage.map(productMapper::mapToProductResponse);
        return ResponseEntity.ok(new PagedResponse<>(responsePage));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long productId
    ) throws ProductNotFoundException {
        Product product = productService.getProductById(productId);

        return ResponseEntity.ok(product);
    }

    @GetMapping("/available")
    public ResponseEntity<PagedResponse<ProductResponse>> getAvailableProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> availableProductsPage = productService.getAvailableProducts(pageable);

        if (availableProductsPage.isEmpty()) return ResponseEntity.noContent().build();

        Page<ProductResponse> responsePage = availableProductsPage.map(productMapper::mapToProductResponse);
        return ResponseEntity.ok(new PagedResponse<>(responsePage));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<ProductResponse>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        if (categories != null && categories.isEmpty()) {
            categories = null;
        }

        ProductSearchRequest request = new ProductSearchRequest();
        request.setName(name);
        request.setCategories(categories);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.searchProducts(request, pageable);

        if (products.isEmpty()) return ResponseEntity.noContent().build();

        Page<ProductResponse> responsePage = products.map(productMapper::mapToProductResponse);
        return ResponseEntity.ok(new PagedResponse<>(responsePage));
    }

    @GetMapping("/seller")
    public ResponseEntity<List<ProductResponse>> getSellerProducts(
            @RequestHeader("Authorization") String authHeader
    ) throws UnauthorizedException, UserNotFoundException {
        User seller = authUtil.getUserFromHeader(authHeader);
        List<Product> products = productService.getProductsBySellerId(seller.getId());
        List<ProductResponse> response = products.stream().map(productMapper::mapToProductResponse).toList();

        return ResponseEntity.ok(response);
    }
}
