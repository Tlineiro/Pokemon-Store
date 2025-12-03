package com.uade.api.tpo_g6_2025c1.service;

import com.uade.api.tpo_g6_2025c1.exceptions.cart.ProductNotInCartException;
import com.uade.api.tpo_g6_2025c1.exceptions.cart.ShoppingCartNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductOutOfStockException;
import com.uade.api.tpo_g6_2025c1.model.ShoppingCart;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.CartItemRequest;

public interface ShoppingCartService {
    ShoppingCart addItemToCart(User user, CartItemRequest request)
            throws ProductNotFoundException, ProductOutOfStockException;
    double calculateTotal(User user)
            throws ShoppingCartNotFoundException;
    ShoppingCart removeItemFromCart(User user, Long productId);
    void checkout(User user)
            throws ShoppingCartNotFoundException, ProductOutOfStockException;
    ShoppingCart updateItemInCart(User user, Long productId, int quantity)
            throws ProductNotFoundException, ProductOutOfStockException, ProductNotInCartException;
    ShoppingCart getCartForUser(User user)
            throws ShoppingCartNotFoundException;
}
