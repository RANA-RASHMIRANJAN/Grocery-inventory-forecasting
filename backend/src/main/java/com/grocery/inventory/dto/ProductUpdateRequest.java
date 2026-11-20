package com.grocery.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductUpdateRequest(
        @NotBlank String sku,
        @NotBlank String name,
        @NotBlank String category,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotBlank String unit,
        String supplier,
        String description
) {
}
