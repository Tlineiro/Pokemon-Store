package com.uade.api.tpo_g6_2025c1.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductSearchRequest {
    private String name;
    private List<String> categories;
    private Double minPrice;
    private Double maxPrice;
}
