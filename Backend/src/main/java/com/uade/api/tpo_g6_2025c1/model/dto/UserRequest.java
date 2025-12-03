package com.uade.api.tpo_g6_2025c1.model.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private boolean isSeller;
}
