package com.grocery.inventory.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import org.hibernate.annotations.Check;

@Entity
@Table(name = "products")
@Check(constraints = "price >= 0")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String sku;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(length = 160)
    private String supplier;

    @Column(length = 1000)
    private String description;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true,
            fetch = FetchType.LAZY, optional = false)
    private Inventory inventory;

    protected Product() {
    }

    public Product(String sku, String name, String category, BigDecimal price,
                   String unit, String supplier, String description) {
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.price = price;
        this.unit = unit;
        this.supplier = supplier;
        this.description = description;
    }

    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
        if (inventory != null) {
            inventory.setProduct(this);
        }
    }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public BigDecimal getPrice() { return price; }
    public String getUnit() { return unit; }
    public String getSupplier() { return supplier; }
    public String getDescription() { return description; }
    public Inventory getInventory() { return inventory; }

    public void updateDetails(String sku, String name, String category, BigDecimal price,
                              String unit, String supplier, String description) {
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.price = price;
        this.unit = unit;
        this.supplier = supplier;
        this.description = description;
    }
}
