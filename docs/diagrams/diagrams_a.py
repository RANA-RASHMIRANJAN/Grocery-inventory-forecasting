"""System design diagrams (Figures 3.1 - 3.3) for the project report."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from diag_helpers import *

OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)


# ---------------------------------------------------------------- Figure 3.1
def fig_architecture():
    W, H = 7.6, 5.9
    fig, ax = fig_ax(W, H)

    # ---- User interface layer
    y0, h0 = 4.28, 1.42
    band(ax, 0.12, y0, W - 0.24, h0, "USER INTERFACE LAYER  -  React 18 Single-Page Application (Vite, localhost:5173)", fs=8.8)
    ui_boxes = [
        "Authentication &\nRouting (Login,\nProtectedRoute,\nAuthContext)",
        "Dashboard & Analytics\n(KPI cards, sales,\nstock and category\ncharts)",
        "Product & Inventory\nPages (Products, Add\nProduct, Inventory,\nAlerts)",
        "Sales, Reports &\nSettings (in-memory\ndemo data)",
        "Demand Forecast\nPage (product, store\n& horizon selection)",
    ]
    bw, gap = 1.30, 0.09
    x = 0.30
    for t in ui_boxes:
        box(ax, x, y0 + 0.14, bw, h0 - 0.44, t, fs=7.0)
        x += bw + gap

    # ---- Application layer
    y1, h1 = 2.02, 1.86
    band(ax, 0.12, y1, W - 0.24, h1, "APPLICATION LAYER", fs=8.8)
    # Spring Boot group
    sbx, sbw = 0.32, 3.62
    box(ax, sbx, y1 + 0.16, sbw, h1 - 0.46, rounded=0.06, fc="#e8e8e8")
    ax.text(sbx + sbw / 2, y1 + h1 - 0.42, "Spring Boot REST API  (localhost:8080)", fontsize=7.6, ha="center", va="center", fontweight="bold")
    sb_items = [
        "Product Controller\n(/api/products)",
        "Inventory Controller\n(/api/inventory)",
        "Service Layer &\nDTO Validation",
        "JPA Repositories\n(Hibernate)",
    ]
    bw2 = 0.82
    x = sbx + 0.10
    for t in sb_items:
        box(ax, x, y1 + 0.24, bw2, 0.92, t, fs=6.4)
        x += bw2 + 0.055
    # Python ML group
    mlx, mlw = 4.20, 3.14
    box(ax, mlx, y1 + 0.16, mlw, h1 - 0.46, rounded=0.06, fc="#e8e8e8")
    ax.text(mlx + mlw / 2, y1 + h1 - 0.42, "Python ML Service  (127.0.0.1:8000)", fontsize=7.6, ha="center", va="center", fontweight="bold")
    ml_items = [
        "Random Forest\npipeline (trained\nat startup)",
        "GET /health,\nGET /api/options",
        "POST /api/predict\n(7 / 14 / 30-day\nhorizon)",
    ]
    x = mlx + 0.12
    bw3 = 0.90
    for t in ml_items:
        box(ax, x, y1 + 0.24, bw3, 0.92, t, fs=6.4)
        x += bw3 + 0.06

    # ---- Data layer
    y2, h2 = 0.14, 1.48
    band(ax, 0.12, y2, W - 0.24, h2, "DATA LAYER", fs=8.8)
    cylinder(ax, 2.05, y2 + 0.62, 1.75, 0.95, "MySQL 8.0\n(grocery_inventory:\nproducts, inventory)", fs=7.2)
    cylinder(ax, 5.55, y2 + 0.62, 1.75, 0.95, "retail_demand_2025.csv\n(10,950 records,\n13 columns)", fs=7.2)

    # ---- Connectors between layers
    arrow(ax, 1.70, y0, 1.70, y1 + h1, "REST / JSON\nGET-POST-PUT-DELETE /api/products,\n/api/inventory  (CORS: :5173)", fs=6.6, ha="center")
    arrow(ax, 5.95, y0, 5.95, y1 + h1, "HTTP / JSON\nVite proxy  /ml-api/*  ->  /api/*\n/options, /predict", fs=6.6)
    arrow(ax, 2.05, y1, 2.05, y2 + h2, "JDBC / JPA-Hibernate\n(CRUD + restock)", fs=6.8, label_t=0.45)
    arrow(ax, 5.55, y1, 5.55, y2 + h2, "pandas read_csv\n(training data at startup)", fs=6.8, label_t=0.45)

    save(fig, f"{OUT}/fig3_1_architecture.png")


# ---------------------------------------------------------------- Figure 3.2
def fig_block():
    W, H = 7.6, 5.7
    fig, ax = fig_ax(W, H)

    # Frontend subsystem
    band(ax, 0.12, 3.25, 3.30, 2.15, "FRONTEND  -  React 18 SPA", fs=8.6)
    fe = [
        ("Auth & Routing\n(demo access)", 0.30, 4.55),
        ("Dashboard\n(KPIs, charts)", 1.80, 4.55),
        ("Product Module\n(add / edit / delete)", 0.30, 3.93),
        ("Inventory Module\n(stock status, restock)", 1.80, 3.93),
        ("Sales / Alerts /\nReports (demo)", 0.30, 3.31),
        ("Forecast UI\n(product, store, horizon)", 1.80, 3.31),
    ]
    for t, x, y in fe:
        box(ax, x, y, 1.42, 0.52, t, fs=6.6)

    # Backend subsystem
    band(ax, 4.10, 3.25, 3.38, 2.15, "BACKEND  -  Spring Boot 3 (Java 17)", fs=8.6)
    be = [
        ("Product REST\nController", 4.28, 4.55),
        ("Inventory REST\nController", 5.80, 4.55),
        ("Business Services\n(validation, SKU check)", 4.28, 3.93),
        ("JPA Repositories\n(Hibernate ORM)", 5.80, 3.93),
        ("DTO layer\n(request / response)", 4.28, 3.31),
        ("Exception handler\n(404, 409, 400)", 5.80, 3.31),
    ]
    for t, x, y in be:
        box(ax, x, y, 1.42, 0.52, t, fs=6.6)

    # ML subsystem
    band(ax, 0.12, 0.90, 3.30, 2.10, "MACHINE LEARNING SERVICE  -  Python 3", fs=8.6)
    ml = [
        ("Data loader\n(pandas, CSV)", 0.30, 2.24),
        ("Preprocessing\n(one-hot encoding)", 1.80, 2.24),
        ("Random Forest\nRegressor (200 trees)", 0.30, 1.72),
        ("Evaluation\n(MAE, RMSE, R2)", 1.80, 1.72),
        ("HTTP prediction API\n(options / predict)", 0.30, 1.20),
        ("Horizon projection\n(daily x days)", 1.80, 1.20),
    ]
    for t, x, y in ml:
        box(ax, x, y, 1.42, 0.42, t, fs=6.6)

    # Data subsystem
    band(ax, 4.10, 0.90, 3.38, 2.10, "DATA STORES", fs=8.6)
    cylinder(ax, 5.00, 2.00, 1.45, 0.90, "MySQL 8.0\nproducts,\ninventory", fs=7.0)
    cylinder(ax, 6.72, 2.00, 1.45, 0.90, "retail_demand_\n2025.csv", fs=7.0)
    ax.text(5.00, 1.28, "persisted catalog\n& stock levels", fontsize=6.6, ha="center", va="center")
    ax.text(6.72, 1.28, "10,950 historical\nsales records", fontsize=6.6, ha="center", va="center")

    # Connectors
    arrow(ax, 3.42, 4.60, 4.10, 4.60, "REST / JSON:\nCRUD + restock", fs=6.4, dy=0.10)
    arrow(ax, 4.10, 3.55, 3.42, 3.55, "page state\nrefreshed", fs=6.4, dy=-0.10, dashed=True)
    arrow(ax, 1.77, 3.25, 1.77, 3.00, "GET /ml-api/options\nPOST /ml-api/predict", fs=6.4, dx=0.02, label_t=0.5, label_ha="left", ha="left")
    arrow(ax, 5.79, 3.25, 5.02, 2.50)
    ax.text(6.35, 3.11, "JDBC / JPA-Hibernate", fontsize=6.4, ha="left", va="center")
    polyline_arrow(ax, [(3.42, 3.10), (6.72, 3.10), (6.72, 2.52)], dashed=True)
    ax.text(4.95, 3.19, "pandas read_csv  (training at startup)", fontsize=6.4, ha="center", va="center",
            bbox=dict(fc="white", ec="none", pad=1.0))

    save(fig, f"{OUT}/fig3_2_block.png")


# ---------------------------------------------------------------- Figure 3.3
def fig_workflow():
    W, H = 7.6, 4.9
    fig, ax = fig_ax(W, H)

    # ---- top row
    start_end(ax, 0.30, 4.05, kind="start")
    box(ax, 0.52, 3.75, 1.30, 0.60, "Open application\n(Login page)", fs=7.2)
    box(ax, 2.06, 3.75, 1.30, 0.60, "Continue in demo\naccess mode", fs=7.2)
    box(ax, 3.60, 3.75, 1.25, 0.60, "Dashboard\n(KPIs, charts)", fs=7.2)
    diamond(ax, 5.85, 4.05, 1.25, 0.85, "Select\noperation", fs=7.2)

    arrow(ax, 0.365, 4.05, 0.52, 4.05)
    arrow(ax, 1.82, 4.05, 2.06, 4.05)
    arrow(ax, 3.36, 4.05, 3.60, 4.05)
    arrow(ax, 4.85, 4.05, 5.225, 4.05)

    # ---- branch spine (left)
    line(ax, 5.85, 3.625, 5.85, 3.30)
    line(ax, 5.85, 3.30, 1.70, 3.30)
    ys = [2.72, 1.92, 1.12]
    line(ax, 1.70, 3.30, 1.70, ys[2])
    for y in ys:
        arrow(ax, 1.70, y, 1.95, y)

    rows = [
        ("Manage products\n(add / edit / delete)",
         "Saved via Spring Boot\nAPI in MySQL"),
        ("Restock items &\nrecord sales (billing)",
         "Stock and demo sales\nrecords updated"),
        ("Request demand forecast\n(7 / 14 / 30 days)",
         "Python ML service returns\ndaily & horizon estimate"),
    ]
    for (src, dst), y in zip(rows, ys):
        box(ax, 1.95, y - 0.31, 1.80, 0.62, src, fs=7.0)
        box(ax, 4.00, y - 0.31, 2.00, 0.62, dst, fs=7.0)
        arrow(ax, 3.75, y, 4.00, y)

    # ---- merge spine (right) and final steps
    line(ax, 6.30, ys[2], 6.30, ys[0])
    for y in ys:
        line(ax, 6.00, y, 6.30, y)
    line(ax, 6.30, ys[0], 6.30, 4.05)
    box(ax, 6.55, 3.75, 1.00, 0.60, "View alerts,\nreports &\ndecisions", fs=6.8)
    arrow(ax, 6.30, 4.05, 6.55, 4.05)
    start_end(ax, 7.42, 4.05, kind="end")
    arrow(ax, 7.55, 4.05, 7.42, 4.05)

    # ---- feedback loop (dashed)
    polyline_arrow(ax, [(7.05, 4.35), (7.05, 4.62), (4.22, 4.62), (4.22, 4.35)],
                   dashed=True)
    ax.text(5.6, 4.74, "refresh KPIs, stock status & alerts", fontsize=6.8,
            ha="center", va="center", bbox=dict(fc="white", ec="none", pad=1.0))

    # ---- note
    note(ax, 0.25, 0.12, 5.0, 0.52,
         "Continuous loop: every change re-evaluates the stock-status rules\n"
         "(out of stock / low stock / overstock) and refreshes the alert list.", fs=7.0)

    save(fig, f"{OUT}/fig3_3_workflow.png")


if __name__ == "__main__":
    fig_architecture()
    fig_block()
    fig_workflow()
