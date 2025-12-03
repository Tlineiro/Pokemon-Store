package com.uade.api.tpo_g6_2025c1.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private double price;
    private int stock;
    private List<Long> categoryIds;
    private List<String> images;
}
