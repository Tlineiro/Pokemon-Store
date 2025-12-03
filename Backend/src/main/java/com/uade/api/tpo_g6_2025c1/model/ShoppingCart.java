package com.uade.api.tpo_g6_2025c1.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

// Cambiamos el @Data por @Getter, @Setter, @ToString y @EqualsAndHashCode para evitar problemas de recursividad
@Getter
@Setter
@ToString(exclude = "buyer")
@EqualsAndHashCode(exclude = "buyer")
@Entity
public class ShoppingCart {

    public ShoppingCart() {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "buyer_id")
    private User buyer;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items;
}
