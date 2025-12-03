package com.uade.api.tpo_g6_2025c1.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean isSeller;
}
