package com.uade.api.tpo_g6_2025c1.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Blob;

@Data
@Entity
public class ProductImage {

    public ProductImage() {}

    public ProductImage(Blob image, Product product) {
        this.image = image;
        this.product = product;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private Blob image;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;
}
