package com.uade.api.tpo_g6_2025c1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// Cambiamos el @Data por @Getter, @Setter, @ToString y @EqualsAndHashCode para evitar problemas de recursividad
@Getter
@Setter
@ToString(exclude = "cart")
@EqualsAndHashCode(exclude = "cart")
@Entity
@Table(name = "user")
public class User {

    public User() {}

    public User(
            String username, String email, String password,
            String firstName, String lastName, boolean isSeller
    ) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isSeller = isSeller;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private boolean isSeller;

    @JsonIgnore
    @OneToOne(mappedBy = "buyer", cascade = CascadeType.ALL)
    private ShoppingCart cart;
}
