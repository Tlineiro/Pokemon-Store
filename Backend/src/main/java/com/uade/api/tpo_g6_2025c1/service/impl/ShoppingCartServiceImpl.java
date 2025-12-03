package com.uade.api.tpo_g6_2025c1.service.impl;

import com.uade.api.tpo_g6_2025c1.exceptions.cart.ProductNotInCartException;
import com.uade.api.tpo_g6_2025c1.exceptions.cart.ShoppingCartNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductOutOfStockException;
import com.uade.api.tpo_g6_2025c1.model.CartItem;
import com.uade.api.tpo_g6_2025c1.model.Product;
import com.uade.api.tpo_g6_2025c1.model.ShoppingCart;
import com.uade.api.tpo_g6_2025c1.model.User;
import com.uade.api.tpo_g6_2025c1.model.dto.CartItemRequest;
import com.uade.api.tpo_g6_2025c1.repository.CartItemRepository;
import com.uade.api.tpo_g6_2025c1.repository.ProductRepository;
import com.uade.api.tpo_g6_2025c1.repository.ShoppingCartRepository;
import com.uade.api.tpo_g6_2025c1.repository.UserRepository;
import com.uade.api.tpo_g6_2025c1.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShoppingCartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    public ShoppingCart addItemToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(request.getProductId()));

        if (request.getQuantity() > product.getStock()) throw new ProductOutOfStockException();

        ShoppingCart cart = user.getCart();
        if (cart == null) {
            cart = new ShoppingCart();
            cart.setBuyer(user);
            cart.setItems(new ArrayList<>());
            cartRepository.save(cart);

            user.setCart(cart);
            userRepository.save(user);
        }

        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(product.getId())) {
                int totalRequested = item.getQuantity() + request.getQuantity();
                if (totalRequested > product.getStock()) throw new ProductOutOfStockException();
                item.setQuantity(totalRequested);
                cartItemRepository.save(item);

                return cartRepository.save(cart);
            }
        }

        CartItem newItem = new CartItem(product, request.getQuantity(), cart);
        cart.getItems().add(newItem);
        cartItemRepository.save(newItem);

        return cartRepository.save(cart);
    }

    public double calculateTotal(User user) {
        ShoppingCart cart = user.getCart();
        if (cart == null) throw new ShoppingCartNotFoundException(user.getId());

        return cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    public ShoppingCart removeItemFromCart(User user, Long productId) {
        ShoppingCart cart = user.getCart();
        if (cart != null) {
            cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));

            return cartRepository.save(cart);
        }

        return null;
    }

    public void checkout(User user) {
        ShoppingCart cart = user.getCart();
        if (cart == null) throw new ShoppingCartNotFoundException(user.getId());

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            int newStock = product.getStock() - item.getQuantity();
            if (newStock < 0) throw new ProductOutOfStockException();

            product.setStock(newStock);
            productRepository.save(product);
        }

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public ShoppingCart updateItemInCart(User user, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        if (quantity > product.getStock()) throw new ProductOutOfStockException();

        ShoppingCart cart = user.getCart();
        if (cart != null) {
            for (CartItem item : cart.getItems()) {
                if (item.getProduct().getId().equals(productId)) {
                    if (quantity <= 0) {
                        cart.getItems().remove(item);
                        cartItemRepository.delete(item);
                    } else {
                        item.setQuantity(quantity);
                        cartItemRepository.save(item);
                    }
                    return cartRepository.save(cart);
                }
            }
            throw new ProductNotInCartException();
        }
        return null;
    }

    public ShoppingCart getCartForUser(User user) {
        ShoppingCart cart = user.getCart();
        if (cart == null) throw new ShoppingCartNotFoundException(user.getId());
        return cart;
    }
}
