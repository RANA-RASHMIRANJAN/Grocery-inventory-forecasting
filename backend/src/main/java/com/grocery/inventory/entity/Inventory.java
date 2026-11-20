package com.grocery.inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "inventory")
@Check(constraints = "quantity >= 0 and min_stock >= 0")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "min_stock", nullable = false)
    private Integer minStock;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Inventory() {
    }

    public Inventory(Integer quantity, Integer minStock) {
        this.quantity = quantity;
        this.minStock = minStock;
        this.updatedAt = Instant.now();
    }

    public void setProduct(Product product) { this.product = product; }

    public void updateStock(Integer quantity, Integer minStock) {
        this.quantity = quantity;
        this.minStock = minStock;
        this.updatedAt = Instant.now();
    }

    public void restock(Integer quantity) {
        this.quantity += quantity;
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public Integer getQuantity() { return quantity; }
    public Integer getMinStock() { return minStock; }
    public Instant getUpdatedAt() { return updatedAt; }
}
