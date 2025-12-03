package com.uade.api.tpo_g6_2025c1.repository;

import com.uade.api.tpo_g6_2025c1.model.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Product> findByCriteria(String name, List<String> categories, Double minPrice, Double maxPrice, Pageable pageable) {
        StringBuilder queryStr = new StringBuilder("SELECT DISTINCT p FROM Product p");
        Map<String, Object> parameters = new HashMap<>();

        if (categories != null && !categories.isEmpty()) {
            queryStr.append(" JOIN p.categories c");
        }

        queryStr.append(" WHERE 1=1");

        if (name != null && !name.isEmpty()) {
            queryStr.append(" AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))");
            parameters.put("name", name);
        }

        if (minPrice != null) {
            queryStr.append(" AND p.price >= :minPrice");
            parameters.put("minPrice", minPrice);
        }

        if (maxPrice != null) {
            queryStr.append(" AND p.price <= :maxPrice");
            parameters.put("maxPrice", maxPrice);
        }

        if (categories != null && !categories.isEmpty()) {
            queryStr.append(" AND c.name IN (:categories)");
            parameters.put("categories", categories);
        }

        TypedQuery<Product> query = entityManager.createQuery(queryStr.toString(), Product.class);
        parameters.forEach(query::setParameter);

        int totalRows = query.getResultList().size();
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(query.getResultList(), pageable, totalRows);
    }
}
