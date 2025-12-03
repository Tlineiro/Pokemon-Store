package com.uade.api.tpo_g6_2025c1.service.impl;

import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductOwnershipException;
import com.uade.api.tpo_g6_2025c1.model.Category;
import com.uade.api.tpo_g6_2025c1.model.Product;
import com.uade.api.tpo_g6_2025c1.model.ProductImage;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.*;
import com.uade.api.tpo_g6_2025c1.repository.CategoryRepository;
import com.uade.api.tpo_g6_2025c1.repository.ProductRepository;
import com.uade.api.tpo_g6_2025c1.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import java.io.InputStream;
import java.util.Base64;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public ProductResponse mapToProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setCategories(product.getCategories());
        response.setSeller(product.getSeller());

        if (product.getImages() != null) {
            List<ProductImageResponse> imageResponses = product.getImages().stream().map(image -> {
                ProductImageResponse imgResponse = new ProductImageResponse();
                imgResponse.setId(image.getId());
                try {
                    InputStream is = image.getImage().getBinaryStream();
                    byte[] bytes = is.readAllBytes();
                    String base64 = Base64.getEncoder().encodeToString(bytes);
                    imgResponse.setImageBase64(base64);
                } catch (Exception e) {
                    throw new RuntimeException("Error reading blob", e);
                }
                return imgResponse;
            }).toList();
            response.setImages(imageResponses);
        }

        return response;
    }

    public Product createProduct(ProductRequest request, User seller) {
        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());

        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getStock(),
                categories,
                seller
        );

        if (request.getImages() != null) {
            List<ProductImage> images = request.getImages().stream()
                    .map(base64 -> {
                        try {
                            byte[] imageBytes = Base64.getDecoder().decode(base64);
                            return new ProductImage(new SerialBlob(imageBytes), product);
                        } catch (Exception e) {
                            throw new RuntimeException("Error creating blob", e);
                        }
                    })
                    .toList();
            product.setImages(images);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, Long sellerId, UpdateProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        if (!product.getSeller().getId().equals(sellerId))
            throw new ProductOwnershipException();

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getCategoryIds() != null) {
            List<Category> newCategories = categoryRepository.findAllById(request.getCategoryIds());

            product.getCategories().clear();
            product.getCategories().addAll(newCategories);
        }
        if (request.getImages() != null) {
            List<ProductImage> newImages = request.getImages().stream()
                    .map(base64 -> {
                        try {
                            byte[] imageBytes = Base64.getDecoder().decode(base64);
                            return new ProductImage(new SerialBlob(imageBytes), product);
                        } catch (Exception e) {
                            throw new RuntimeException("Error creating blob", e);
                        }
                    })
                    .toList();

            if (product.getImages() != null) {
                product.getImages().clear();
                product.getImages().addAll(newImages);
            } else {
                product.setImages(newImages);
            }
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long productId, Long sellerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        if (!product.getSeller().getId().equals(sellerId))
            throw new ProductOwnershipException();

        productRepository.delete(product);
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
    }

    public Page<Product> getAvailableProducts(Pageable pageable) {
        return productRepository.findByStockGreaterThan(0, pageable);
    }

    public Page<Product> searchProducts(ProductSearchRequest request, Pageable pageable) {
        return productRepository.findByCriteria(
                request.getName(),
                request.getCategories(),
                request.getMinPrice(),
                request.getMaxPrice(),
                pageable
        );
    }

    public List<Product> getProductsBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
}
