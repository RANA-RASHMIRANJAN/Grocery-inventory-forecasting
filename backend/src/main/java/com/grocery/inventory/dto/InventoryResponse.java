package com.grocery.inventory.dto;

import java.time.Instant;

public record InventoryResponse(
        Long id,
        Long productId,
        String productSku,
        String productName,
        Integer quantity,
        Integer minStock,
        Instant updatedAt
) {
}
