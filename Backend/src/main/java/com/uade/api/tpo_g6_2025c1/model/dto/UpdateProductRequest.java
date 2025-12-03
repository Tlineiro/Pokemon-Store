package com.uade.api.tpo_g6_2025c1.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private List<Long> categoryIds;
    private List<String> images;
}
