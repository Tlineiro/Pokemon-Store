package com.uade.api.tpo_g6_2025c1.model.dto;

import com.uade.api.tpo_g6_2025c1.model.Category;
import com.uade.api.tpo_g6_2025c1.model.User;
import lombok.Data;

import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private List<Category> categories;
    private User seller;
    private List<ProductImageResponse> images;
}
