package com.uade.api.tpo_g6_2025c1.controllers;

import com.uade.api.tpo_g6_2025c1.exceptions.cart.ProductNotInCartException;
import com.uade.api.tpo_g6_2025c1.exceptions.cart.ShoppingCartNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductOutOfStockException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UnauthorizedException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserNotFoundException;
import com.uade.api.tpo_g6_2025c1.mapper.CartMapper;
import com.uade.api.tpo_g6_2025c1.model.ShoppingCart;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.CartItemRequest;
import com.uade.api.tpo_g6_2025c1.model.dto.ShoppingCartResponse;
import com.uade.api.tpo_g6_2025c1.service.ShoppingCartService;
import com.uade.api.tpo_g6_2025c1.utils.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("cart")
public class CartController {

    @Autowired
    private ShoppingCartService cartService;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private CartMapper cartMapper;

    @PostMapping
    public ResponseEntity<ShoppingCartResponse> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CartItemRequest request
    ) throws UnauthorizedException, UserNotFoundException, ProductNotFoundException, ProductOutOfStockException {
        User user = authUtil.getUserFromHeader(authHeader);
        ShoppingCart updatedCart = cartService.addItemToCart(user, request);

        return ResponseEntity.ok(cartMapper.mapToCartResponse(updatedCart));
    }

    @GetMapping("/total")
    public ResponseEntity<Double> calculateTotal(
            @RequestHeader("Authorization") String authHeader
    ) throws UnauthorizedException, UserNotFoundException, ShoppingCartNotFoundException {
        User user = authUtil.getUserFromHeader(authHeader);
        double total = cartService.calculateTotal(user);

        return ResponseEntity.ok(total);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ShoppingCartResponse> removeFromCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long productId
    ) throws UnauthorizedException, UserNotFoundException {
        User user = authUtil.getUserFromHeader(authHeader);
        ShoppingCart updatedCart = cartService.removeItemFromCart(user, productId);

        return ResponseEntity.ok(cartMapper.mapToCartResponse(updatedCart));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Void> checkout(
            @RequestHeader("Authorization") String authHeader
    ) throws UnauthorizedException, UserNotFoundException, ShoppingCartNotFoundException, ProductOutOfStockException {
        User user = authUtil.getUserFromHeader(authHeader);
        cartService.checkout(user);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ShoppingCartResponse> updateCartItem(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long productId,
            @RequestBody int quantity
    ) throws UnauthorizedException, UserNotFoundException, ProductNotFoundException, ProductOutOfStockException, ProductNotInCartException {
        User user = authUtil.getUserFromHeader(authHeader);
        ShoppingCart updatedCart = cartService.updateItemInCart(user, productId, quantity);

        return ResponseEntity.ok(cartMapper.mapToCartResponse(updatedCart));
    }

    @GetMapping
    public ResponseEntity<ShoppingCartResponse> getCart(@RequestHeader("Authorization") String authHeader)
            throws UnauthorizedException, UserNotFoundException, ShoppingCartNotFoundException {
        User user = authUtil.getUserFromHeader(authHeader);
        ShoppingCart cart = cartService.getCartForUser(user);
        if (cart == null) {
            return ResponseEntity.ok(new ShoppingCartResponse());
        }
        return ResponseEntity.ok(cartMapper.mapToCartResponse(cart));
    }
}
