package com.grocery.inventory.controller;

import com.grocery.inventory.dto.InventoryResponse;
import com.grocery.inventory.dto.RestockRequest;
import com.grocery.inventory.service.InventoryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<InventoryResponse> getInventory() {
        return inventoryService.getInventory();
    }

    @GetMapping("/{productId}")
    public InventoryResponse getInventoryForProduct(@PathVariable Long productId) {
        return inventoryService.getInventoryForProduct(productId);
    }

    @PostMapping("/{productId}/restocks")
    public InventoryResponse restock(@PathVariable Long productId, @Valid @RequestBody RestockRequest request) {
        return inventoryService.restock(productId, request);
    }
}
