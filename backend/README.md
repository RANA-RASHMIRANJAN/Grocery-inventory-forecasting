# Grocery Inventory Backend

This Spring Boot backend currently defines Product and Inventory REST APIs. Product details and stock are separate JPA entities with a one-to-one relationship. Product API responses include quantity and minimum stock for convenience, while the database model keeps those fields in Inventory.

## API routes

### Products

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

Create requests accept product fields (`sku`, `name`, `category`, `price`, `unit`, optional `supplier` and `description`) plus initial `quantity` and `minStock`. Product update requests accept only product fields, so editing a product cannot overwrite its inventory. Name, SKU, category, and unit must not be blank; price, quantity, and minimum stock cannot be negative.

### Inventory

- `GET /api/inventory`
- `GET /api/inventory/{productId}`
- `POST /api/inventory/{productId}/restocks` with a positive `quantity`

Restocking adds the submitted quantity and refreshes the update timestamp. Missing product or inventory records return 404. Duplicate SKUs return 409. Invalid request data returns 400.

## MySQL setup

The configured database name is `grocery_inventory`. Install and start MySQL, then create that database once (for example, using `CREATE DATABASE grocery_inventory;`). Hibernate uses `ddl-auto=update` to create/update the `products` and `inventory` tables; this is a development setting, not the final production migration strategy.

The JDBC URL defaults to `jdbc:mysql://localhost:3306/grocery_inventory`. Supply credentials through environment variables; no password is stored in this repository. In PowerShell, set them for the current terminal before starting:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/grocery_inventory"
$env:DB_USERNAME = "your_local_mysql_user"
$env:DB_PASSWORD = "your_local_mysql_password"
mvn spring-boot:run
```

## Current scope and database status

Product and inventory entities, JPA repositories, services, DTOs, and controllers are configured for MySQL persistence. Product creation and inventory creation run in one transaction. Deleting a product cascades to its inventory row. Product updates do not alter inventory. Restocks are transactional. No database was created or connected in the development environment during this milestone.

Sales, authentication, alerts, reports, demand prediction, frontend integration, and ML integration are not implemented.

## Build

With Java 17 or newer, Maven 3.6.3 or newer, and MySQL installed, create the database, set the environment variables above, and run `mvn spring-boot:run` from this directory. The application and API still need to be exercised in an environment with those tools available.
