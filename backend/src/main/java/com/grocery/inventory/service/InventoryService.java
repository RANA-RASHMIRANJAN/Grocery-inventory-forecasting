package com.grocery.inventory.service;

import com.grocery.inventory.dto.InventoryResponse;
import com.grocery.inventory.dto.RestockRequest;
import com.grocery.inventory.entity.Inventory;
import com.grocery.inventory.repository.InventoryRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getInventory() {
        return inventoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryForProduct(Long productId) {
        return toResponse(findInventory(productId));
    }

    @Transactional
    public InventoryResponse restock(Long productId, RestockRequest request) {
        Inventory inventory = findInventory(productId);
        inventory.restock(request.quantity());
        return toResponse(inventory);
    }

    private Inventory findInventory(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory not found for product."));
    }

    private InventoryResponse toResponse(Inventory inventory) {
        return new InventoryResponse(inventory.getId(), inventory.getProduct().getId(),
                inventory.getProduct().getSku(), inventory.getProduct().getName(), inventory.getQuantity(),
                inventory.getMinStock(), inventory.getUpdatedAt());
    }
}
