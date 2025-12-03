package com.uade.api.tpo_g6_2025c1.mapper;

import com.uade.api.tpo_g6_2025c1.model.Product;
import com.uade.api.tpo_g6_2025c1.model.dto.ProductResponse;
import com.uade.api.tpo_g6_2025c1.model.dto.ProductImageResponse;

import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Base64;
import java.util.List;

@Component
public class ProductMapper {

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
}
