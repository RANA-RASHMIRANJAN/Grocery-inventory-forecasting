package com.grocery.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String sku,
        @NotBlank String name,
        @NotBlank String category,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotBlank String unit,
        String supplier,
        String description,
        @NotNull @PositiveOrZero Integer quantity,
        @NotNull @PositiveOrZero Integer minStock
) {
}
