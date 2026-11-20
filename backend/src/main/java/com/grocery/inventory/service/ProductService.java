package com.grocery.inventory.service;

import com.grocery.inventory.dto.ProductRequest;
import com.grocery.inventory.dto.ProductResponse;
import com.grocery.inventory.dto.ProductUpdateRequest;
import com.grocery.inventory.entity.Inventory;
import com.grocery.inventory.entity.Product;
import com.grocery.inventory.repository.ProductRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        return toResponse(findProduct(id));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.sku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A product with this SKU already exists.");
        }
        Product product = new Product(request.sku(), request.name(), request.category(), request.price(),
                request.unit(), request.supplier(), request.description());
        product.setInventory(new Inventory(request.quantity(), request.minStock()));
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = findProduct(id);
        if (productRepository.existsBySkuAndIdNot(request.sku(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A product with this SKU already exists.");
        }
        product.updateDetails(request.sku(), request.name(), request.category(), request.price(),
                request.unit(), request.supplier(), request.description());
        return toResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.delete(findProduct(id));
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));
    }

    private ProductResponse toResponse(Product product) {
        Inventory inventory = product.getInventory();
        return new ProductResponse(product.getId(), product.getSku(), product.getName(), product.getCategory(),
                product.getPrice(), product.getUnit(), product.getSupplier(), product.getDescription(),
                inventory.getQuantity(), inventory.getMinStock());
    }
}
