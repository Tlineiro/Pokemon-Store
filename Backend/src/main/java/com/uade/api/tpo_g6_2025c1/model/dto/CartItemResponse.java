package com.uade.api.tpo_g6_2025c1.model.dto;

import lombok.Data;

@Data
public class CartItemResponse {
    private Long productId;
    private String name;
    private double price;
    private int quantity;
    private int stock;
    private String imageBase64;
}
