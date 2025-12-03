package com.uade.api.tpo_g6_2025c1.exceptions;

import com.uade.api.tpo_g6_2025c1.exceptions.cart.ProductNotInCartException;
import com.uade.api.tpo_g6_2025c1.exceptions.cart.ShoppingCartNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.category.CategoryDuplicateException;
import com.uade.api.tpo_g6_2025c1.exceptions.category.CategoryNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.category.InvalidCategoryNameException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.InvalidRoleException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductNotFoundException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductOutOfStockException;
import com.uade.api.tpo_g6_2025c1.exceptions.product.ProductOwnershipException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.InvalidUserDataException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UnauthorizedException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserAlreadyExistsException;
import com.uade.api.tpo_g6_2025c1.exceptions.user.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<Map<String, Object>> buildErrorResponse(Exception ex, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", ex.getClass().getSimpleName());
        response.put("message", ex.getMessage());
        response.put("status", status.value());
        return new ResponseEntity<>(response, status);
    }

    @ExceptionHandler(ProductNotInCartException.class)
    public ResponseEntity<Map<String, Object>> handleProductNotInCartException(ProductNotInCartException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ShoppingCartNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleShoppingCartNotFoundException(ShoppingCartNotFoundException ex) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CategoryDuplicateException.class)
    public ResponseEntity<Map<String, Object>> handleCategoryDuplicateException(CategoryDuplicateException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleCategoryNotFoundException(CategoryNotFoundException ex) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidCategoryNameException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCategoryNameException(InvalidCategoryNameException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidRoleException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidRoleException(InvalidRoleException ex) {
        return buildErrorResponse(ex, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleProductNotFoundException(ProductNotFoundException ex) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductOutOfStockException.class)
    public ResponseEntity<Map<String, Object>> handleProductOutOfStockException(ProductOutOfStockException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ProductOwnershipException.class)
    public ResponseEntity<Map<String, Object>> handleProductOwnershipException(ProductOwnershipException ex) {
        return buildErrorResponse(ex, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InvalidUserDataException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidUserDataException(InvalidUserDataException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorizedException(UnauthorizedException ex) {
        return buildErrorResponse(ex, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFoundException(UserNotFoundException ex) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND);
    }
}
