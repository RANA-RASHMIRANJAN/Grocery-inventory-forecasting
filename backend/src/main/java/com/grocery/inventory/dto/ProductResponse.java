package com.grocery.inventory.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String sku,
        String name,
        String category,
        BigDecimal price,
        String unit,
        String supplier,
        String description,
        Integer quantity,
        Integer minStock
) {
}
