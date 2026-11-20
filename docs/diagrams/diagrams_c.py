"""Database and data-flow diagrams (Figures 3.10 - 3.14) for the project report.

Ground truth: backend/src/main/java/com/grocery/inventory/entity/{Product,Inventory}.java
and ml_service/app.py (retail_demand_2025.csv as the forecasting data source).
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from diag_helpers import *

OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)


# ---------------------------------------------------------------- Figure 3.10
def fig_er():
    W, H = 7.6, 4.3
    fig, ax = fig_ax(W, H)

    prod_attrs = ["id   (PK)", "sku   (UQ)", "name", "category", "price",
                  "unit", "supplier", "description"]
    inv_attrs = ["id   (PK)", "product_id   (FK, UQ)", "quantity",
                 "min_stock", "updated_at"]

    ph = entity_box(ax, 0.85, 1.35, 1.90, "PRODUCT", prod_attrs, fs=7.6)
    ih = entity_box(ax, 4.85, 1.95, 1.90, "INVENTORY", inv_attrs, fs=7.6)

    # relationship diamond
    diamond(ax, 3.80, 2.45, 1.05, 0.75, "has", fs=8.0)
    line(ax, 2.75, 2.45, 3.275, 2.45)
    line(ax, 4.325, 2.45, 4.85, 2.45)
    ax.text(2.90, 2.57, "1", fontsize=7.6, ha="center", va="center")
    ax.text(4.68, 2.57, "1", fontsize=7.6, ha="center", va="center")

    note(ax, 0.85, 0.55, 3.30, 0.50,
         "One inventory row exists for every product;\n"
         "product_id is both a foreign key and unique.", fs=6.4)
    note(ax, 4.85, 0.55, 2.30, 0.50,
         "Restock updates change quantity\nand refresh updated_at.", fs=6.4)

    save(fig, f"{OUT}/fig3_10_er.png")


# ---------------------------------------------------------------- Figure 3.11
def fig_schema():
    W, H = 7.2, 4.4
    fig, ax = fig_ax(W, H)

    prod = ["id : BIGINT  PK, auto-inc", "sku : VARCHAR(40)  UQ",
            "name : VARCHAR(160)", "category : VARCHAR(100)",
            "price : DECIMAL(10,2)", "unit : VARCHAR(30)",
            "supplier : VARCHAR(160)", "description : VARCHAR(1000)"]
    inv = ["id : BIGINT  PK, auto-inc", "product_id : BIGINT  FK, UQ",
           "quantity : INT  CHECK >= 0", "min_stock : INT  CHECK >= 0",
           "updated_at : TIMESTAMP"]

    ph = entity_box(ax, 0.55, 1.45, 2.55, "products", prod, fs=7.4)
    ih = entity_box(ax, 4.30, 2.12, 2.55, "inventory", inv, fs=7.4)

    # FK reference: inventory.product_id -> products.id
    y_fk = 2.12 + ih - 0.30 - 0.225 * 2 + 0.1125     # product_id row centre
    y_id = 1.45 + ph - 0.30 - 0.225 * 1 + 0.1125     # id row centre
    polyline_arrow(ax, [(4.30, y_fk), (3.55, y_fk), (3.55, y_id),
                        (3.10, y_id)])
    ax.text(3.66, (y_fk + y_id) / 2, "FK", fontsize=6.6, ha="center",
            va="center", bbox=dict(fc="white", ec="none", pad=1.0))

    note(ax, 0.55, 0.55, 6.10, 0.55,
         "MySQL 8.0, schema: grocery_inventory.  sku is UNIQUE; product_id is UNIQUE "
         "(enforces the 1 : 1 pairing).\nprice >= 0 and quantity / min_stock >= 0 are "
         "enforced with Hibernate @Check constraints.", fs=6.4)

    save(fig, f"{OUT}/fig3_11_schema.png")


# ---------------------------------------------------------------- Figure 3.12
def fig_dfd0():
    W, H = 7.6, 4.6
    fig, ax = fig_ax(W, H)

    circle_proc(ax, 4.00, 2.30, 1.20, "0",
                "Smart Grocery Inventory\n& Demand Forecasting\nSystem", fs=7.4,
                num_fs=9.0)

    external_entity(ax, 0.50, 1.95, 1.60, 0.70, "Store\nManager", fs=7.6)
    external_entity(ax, 5.95, 3.70, 1.60, 0.65,
                    "retail_demand_2025.csv\n(historical dataset)", fs=6.8)

    arrow(ax, 2.10, 2.50, 2.83, 2.58, "login, product & restock\nupdates, "
          "forecast requests", fs=6.3, dy=0.18)
    arrow(ax, 2.83, 2.02, 2.10, 1.96, "dashboards, stock alerts,\ndemand "
          "forecasts", fs=6.3, dy=-0.20)
    arrow(ax, 6.30, 3.68, 4.98, 3.18, "historical demand records", fs=6.3,
          label_t=0.55, dy=0.16)

    save(fig, f"{OUT}/fig3_12_dfd0.png")


# ---------------------------------------------------------------- Figure 3.13
def fig_dfd1():
    W, H = 7.6, 5.85
    fig, ax = fig_ax(W, H)
    R = 0.52

    external_entity(ax, 0.15, 2.75, 1.05, 0.75, "Store\nManager", fs=7.2)

    # processes
    circle_proc(ax, 1.70, 4.60, R, "1.0", "Manage\nProducts", fs=6.8, num_fs=7.4)
    circle_proc(ax, 5.70, 4.60, R, "2.0", "Manage Inventory\n& Restock", fs=6.6,
                num_fs=7.4)
    circle_proc(ax, 5.70, 0.80, R, "3.0", "Stock Status\n& Alerts", fs=6.8,
                num_fs=7.4)
    circle_proc(ax, 1.70, 2.30, R, "4.0", "Generate Demand\nForecast",
                fs=6.6, num_fs=7.4)
    circle_proc(ax, 3.55, 0.80, R, "5.0", "Dashboard\n& Reports", fs=6.8,
                num_fs=7.4)

    # data stores
    data_store(ax, 3.20, 4.36, 1.50, 0.48, "Products", sub="D1", fs=7.0)
    data_store(ax, 5.00, 2.06, 1.50, 0.48, "Inventory", sub="D2", fs=7.0)
    data_store(ax, 0.85, 0.85, 1.70, 0.48, "retail_demand_2025.csv",
               sub="D3", fs=6.0)

    # --- external entity flows
    arrow(ax, 0.80, 3.50, 1.30, 4.22, "product requests", fs=6.0, label_t=0.5,
          dx=0.12, dy=0.08, label_ha="left", ha="left")
    polyline_arrow(ax, [(0.50, 3.50), (0.50, 5.35), (5.70, 5.35), (5.70, 5.12)])
    ax.text(3.10, 5.47, "restock & billing updates", fontsize=6.0, ha="center",
            va="center")
    arrow(ax, 1.10, 2.75, 1.18, 2.32, "forecast\nrequest", fs=6.0, label_t=0.5,
          dx=-0.12, label_ha="right", ha="right")
    polyline_arrow(ax, [(1.70, 2.82), (1.70, 3.12), (1.20, 3.12)])
    ax.text(1.80, 2.97, "daily & horizon\nforecast", fontsize=6.0, ha="left",
            va="center")

    # --- product / inventory flows
    arrow(ax, 2.22, 4.60, 3.20, 4.60, "product records", fs=6.0, dy=0.14)
    arrow(ax, 4.70, 4.60, 5.18, 4.60, "product data", fs=6.0, dy=0.14, dx=-0.04)
    arrow(ax, 5.75, 4.08, 5.75, 2.54, "stock & restock updates", fs=6.0,
          label_t=0.5, dx=0.10, label_ha="left", ha="left")
    arrow(ax, 5.75, 2.06, 5.75, 1.32, "quantity vs min_stock", fs=6.0,
          label_t=0.5, dx=0.10, label_ha="left", ha="left")

    # --- dashboard / alert / forecast flows
    polyline_arrow(ax, [(5.00, 2.15), (4.60, 2.15), (4.60, 1.10), (3.98, 1.08)])
    ax.text(4.70, 1.62, "stock levels", fontsize=6.0, ha="left", va="center")
    arrow(ax, 5.18, 0.80, 4.07, 0.80, "alert events", fs=6.0, dy=0.14)
    arrow(ax, 1.70, 1.33, 1.70, 1.78, "historical demand rows", fs=6.0,
          label_t=0.5, dx=0.10, label_ha="left", ha="left")
    polyline_arrow(ax, [(3.06, 0.62), (0.30, 0.62), (0.30, 2.75)])
    ax.text(1.95, 0.47, "KPI dashboards & reports", fontsize=6.0, ha="center",
            va="center")

    save(fig, f"{OUT}/fig3_13_dfd1.png")


# ---------------------------------------------------------------- Figure 3.14
def fig_dfd2():
    W, H = 7.6, 5.1
    fig, ax = fig_ax(W, H)
    R = 0.62

    external_entity(ax, 0.15, 1.10, 1.05, 0.75, "Store\nManager", fs=7.2)

    circle_proc(ax, 1.55, 3.30, R, "4.1", "Validate\nRequest", fs=7.0,
                num_fs=7.6)
    circle_proc(ax, 3.90, 3.30, R, "4.2", "Retrieve Latest\nRow", fs=7.0,
                num_fs=7.6)
    circle_proc(ax, 6.05, 3.30, R, "4.3", "Predict Daily\nDemand (RF)",
                fs=7.0, num_fs=7.6)
    circle_proc(ax, 6.05, 1.20, R, "4.4", "Scale to\nHorizon", fs=7.0,
                num_fs=7.6)

    data_store(ax, 3.00, 4.30, 1.80, 0.48, "retail_demand_2025.csv",
               sub="D3", fs=6.6)

    arrow(ax, 1.20, 1.60, 1.11, 2.86, "predict request {product,\nstore, "
          "horizon}", fs=6.2, label_t=0.45, dx=0.08, label_ha="left", ha="left")
    arrow(ax, 1.11, 3.74, 0.68, 1.85, "HTTP 400 / 404\nrejection", fs=6.2,
          label_t=0.42, dx=-0.08, label_ha="right", ha="right")
    arrow(ax, 2.17, 3.30, 3.28, 3.30, "validated request", fs=6.2, dy=0.14)
    arrow(ax, 3.90, 4.30, 3.90, 3.92, "latest matching row\n(10 feature "
          "values)", fs=6.2, label_t=0.5, dx=0.08, label_ha="left", ha="left")
    arrow(ax, 4.52, 3.30, 5.43, 3.30, "10-feature vector", fs=6.2, dy=0.14)
    arrow(ax, 6.05, 2.68, 6.05, 1.82, "mean of 200 trees\n(daily units)",
          fs=6.2, label_t=0.5, dx=-0.08, label_ha="right", ha="right")
    arrow(ax, 5.43, 1.20, 1.20, 1.42, "200 OK {estimatedDailyUnits,\n"
          "estimatedHorizonUnits}", fs=6.2, label_t=0.5, dy=0.16)

    note(ax, 0.30, 0.25, 3.40, 0.55,
         "Horizon must be 7, 14 or 30 days;\n"
         "unknown product/store pair -> HTTP 404.", fs=6.4)

    save(fig, f"{OUT}/fig3_14_dfd2.png")


if __name__ == "__main__":
    fig_er()
    fig_schema()
    fig_dfd0()
    fig_dfd1()
    fig_dfd2()
