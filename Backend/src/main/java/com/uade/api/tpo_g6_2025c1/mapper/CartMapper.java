package com.uade.api.tpo_g6_2025c1.mapper;

import com.uade.api.tpo_g6_2025c1.model.Product;
import com.uade.api.tpo_g6_2025c1.model.ShoppingCart;
import com.uade.api.tpo_g6_2025c1.model.dto.CartItemResponse;
import com.uade.api.tpo_g6_2025c1.model.dto.ShoppingCartResponse;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Base64;
import java.util.List;

@Component
public class CartMapper {

    public ShoppingCartResponse mapToCartResponse(ShoppingCart cart) {
        ShoppingCartResponse response = new ShoppingCartResponse();

        List<CartItemResponse> itemResponses = cart.getItems().stream().map(item -> {
            CartItemResponse dto = new CartItemResponse();
            Product product = item.getProduct();

            dto.setProductId(product.getId());
            dto.setName(product.getName());
            dto.setPrice(product.getPrice());
            dto.setStock(product.getStock());
            dto.setQuantity(item.getQuantity());

            if (product.getImages() != null && !product.getImages().isEmpty()) {
                try {
                    InputStream is = product.getImages().getFirst().getImage().getBinaryStream();
                    byte[] bytes = is.readAllBytes();
                    dto.setImageBase64(Base64.getEncoder().encodeToString(bytes));
                } catch (Exception e) {
                    throw new RuntimeException("Error reading product image", e);
                }
            }

            return dto;
        }).toList();

        response.setItems(itemResponses);
        double total = itemResponses.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        response.setTotal(total);

        return response;
    }
}
