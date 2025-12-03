package com.uade.api.tpo_g6_2025c1.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class ShoppingCartResponse {
    private List<CartItemResponse> items;
    private double total;
}
