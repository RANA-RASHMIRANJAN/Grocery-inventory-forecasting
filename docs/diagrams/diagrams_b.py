"""UML diagrams (Figures 3.4 - 3.9) for the project report."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from diag_helpers import *

OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)


# ---------------------------------------------------------------- Figure 3.4
def fig_usecase():
    W, H = 7.6, 6.5
    fig, ax = fig_ax(W, H)

    bx, by, bw, bh = 1.60, 0.18, 5.95, 6.10
    box(ax, bx, by, bw, bh, rounded=0.03)
    ax.text(bx + bw / 2, by + bh - 0.20, "Smart Grocery Inventory & Demand Forecasting System",
            fontsize=8.6, ha="center", va="center", fontweight="bold")

    actor(ax, 0.78, 3.55, "", scale=1.05)
    ax.text(0.30, 2.72, "Store Manager\n(User)", fontsize=9, ha="left",
            va="top", fontweight="bold", linespacing=1.2)

    LX = 2.525   # left column centre
    rows = [
        ("Sign in using\ndemo access", 5.55, 0.54),
        ("View dashboard\n& KPI charts", 4.93, 0.54),
        ("Manage products", 4.31, 0.44),
        ("Manage inventory\n& restock", 3.69, 0.54),
        ("View stock status\n& alerts", 3.07, 0.54),
        ("Record sale\n(billing)", 2.45, 0.54),
        ("View reports\n& analytics", 1.83, 0.54),
        ("Configure\nsettings", 1.21, 0.54),
    ]
    for t, cy, h in rows:
        usecase(ax, LX, cy, 1.50, h, t, fs=6.8)
    left = {t.split("\n")[0]: (LX, cy) for t, cy, h in rows}

    # right side: extensions of Manage products + forecast chain
    ext = [("Add product", 4.85, 4.75), ("Edit product", 4.85, 4.10),
           ("Delete product", 4.85, 3.45)]
    for t, cx, cy in ext:
        usecase(ax, cx, cy, 1.25, 0.54, t, fs=6.8)

    usecase(ax, 5.70, 2.20, 1.35, 0.60, "Request demand\nforecast", fs=6.8)
    usecase(ax, 6.90, 1.55, 1.25, 0.56, "Select product,\nstore & horizon", fs=6.6)
    usecase(ax, 6.90, 0.70, 1.25, 0.56, "Generate ML\nprediction", fs=6.6)

    # actor associations (straight lines to left column)
    for t, cy, h in rows:
        ax.annotate("", xy=(LX - 0.75, cy), xytext=(0.95, 3.55),
                    arrowprops=dict(arrowstyle="-", lw=0.9, color=EC,
                                    shrinkA=0, shrinkB=0))
    # association to forecast (routed down the left margin, under the note)
    polyline = [(0.64, 3.13), (0.15, 3.13), (0.15, 0.30), (5.70, 0.30),
                (5.70, 1.90)]
    for i in range(len(polyline) - 1):
        a, b = polyline[i], polyline[i + 1]
        line(ax, a[0], a[1], b[0], b[1], lw=0.9)
    arrow(ax, 5.70, 1.70, 5.70, 1.90, ms=9)

    # extend: extension -> base
    for t, cx, cy in ext:
        a = FancyArrowPatch((cx - 0.625, cy), (LX + 0.75, 4.31),
                            arrowstyle="-|>", mutation_scale=9, lw=0.9,
                            linestyle="--", color=EC, shrinkA=2, shrinkB=2)
        ax.add_patch(a)
    ax.text(3.68, 4.58, "<<extend>>", fontsize=6.6, ha="center", va="center",
            bbox=dict(fc="white", ec="none", pad=0.8))
    ax.text(3.68, 4.24, "<<extend>>", fontsize=6.6, ha="center", va="center",
            bbox=dict(fc="white", ec="none", pad=0.8))
    ax.text(3.68, 3.80, "<<extend>>", fontsize=6.6, ha="center", va="center",
            bbox=dict(fc="white", ec="none", pad=0.8))

    # include: base -> included
    arrow(ax, 6.50, 1.82, 6.62, 1.71, dashed=True, ms=9)
    ax.text(6.28, 1.98, "<<include>>", fontsize=6.4, ha="center", va="center",
            bbox=dict(fc="white", ec="none", pad=0.8))
    arrow(ax, 6.85, 1.15, 6.85, 0.99, dashed=True, ms=9)
    ax.text(6.42, 1.07, "<<include>>", fontsize=6.4, ha="right", va="center",
            bbox=dict(fc="white", ec="none", pad=0.8))

    note(ax, 2.30, 0.38, 2.00, 0.50,
         "Authentication is demo-only;\n"
         "product data is persisted in MySQL.", fs=6.4)

    save(fig, f"{OUT}/fig3_4_usecase.png")


# ---------------------------------------------------------------- Figure 3.5
def fig_activity():
    W, H = 7.4, 7.0
    fig, ax = fig_ax(W, H)
    cx = 2.20

    # ---- top section
    start_end(ax, 0.30, 6.45, kind="start")
    box(ax, 0.55, 6.15, 1.55, 0.60, "Open application\n(login page)", fs=7.2, rounded=0.14)
    box(ax, 2.35, 6.15, 1.55, 0.60, "Continue in demo\naccess mode", fs=7.2, rounded=0.14)
    box(ax, 4.15, 6.15, 1.50, 0.60, "View dashboard\n& KPI charts", fs=7.2, rounded=0.14)
    diamond(ax, 6.35, 6.45, 1.30, 0.90, "Choose\noperation", fs=7.2)

    arrow(ax, 0.365, 6.45, 0.55, 6.45)
    arrow(ax, 2.10, 6.45, 2.35, 6.45)
    arrow(ax, 3.90, 6.45, 4.15, 6.45)
    arrow(ax, 5.65, 6.45, 5.70, 6.45)

    # branch spine
    line(ax, 6.35, 6.00, 6.35, 5.80)
    line(ax, 6.35, 5.80, 1.05, 5.80)
    ys = [5.30, 3.95, 2.60]
    line(ax, 1.05, 5.80, 1.05, ys[2])
    for y in ys:
        arrow(ax, 1.05, y, 1.25, y)

    # merge spine
    msx = 7.05
    line(ax, msx, 0.725, msx, 5.30)

    def row_a(y, a, b, dtxt, c, err):
        box(ax, 1.25, y - 0.30, 1.45, 0.60, a, fs=6.9, rounded=0.14)
        arrow(ax, 2.70, y, 2.95, y)
        box(ax, 2.95, y - 0.30, 1.30, 0.60, b, fs=6.9, rounded=0.14)
        arrow(ax, 4.25, y, 4.275, y)
        diamond(ax, 4.90, y, 1.25, 0.85, dtxt, fs=6.6)
        arrow(ax, 5.525, y, 5.75, y, "[yes]", fs=6.6, label_t=0.5, dy=0.12)
        box(ax, 5.75, y - 0.30, 1.20, 0.60, c, fs=6.9, rounded=0.14)
        line(ax, 6.95, y, msx, y)
        arrow(ax, 4.90, y - 0.425, 4.90, y - 0.68, "[no]", fs=6.6, dx=0.14, ha="left")
        box(ax, 4.30, y - 1.13, 1.64, 0.45, err, fs=6.6, rounded=0.10)
        line(ax, 5.94, y - 0.905, msx, y - 0.905)

    def row_b(y, a, b):
        box(ax, 1.25, y - 0.30, 1.45, 0.60, a, fs=6.9, rounded=0.14)
        arrow(ax, 2.70, y, 2.95, y)
        box(ax, 2.95, y - 0.30, 1.30, 0.60, b, fs=6.9, rounded=0.14)
        line(ax, 4.25, y, msx, y)

    row_a(ys[0], "Manage products\n(add / edit / delete)",
          "Validate details\n& SKU check", "Valid & API\nreachable?",
          "Save via REST\nAPI (MySQL)",
          "Show validation /\nserver error message")
    row_b(ys[1], "Restock items &\nrecord sales (billing)",
          "Update stock &\ndemo sales records")
    row_a(ys[2], "Select product,\nstore & horizon",
          "POST /api/predict\nto ML service", "Service available\n& request valid?",
          "Display daily &\nhorizon forecast",
          "Show 'ML service\nunavailable' message")

    # ---- bottom section
    arrow(ax, msx, 0.725, 4.40, 0.725)
    box(ax, 1.90, 0.45, 2.50, 0.55,
        "Stock status & alerts\nre-evaluated, then logout", fs=7.0, rounded=0.14)
    start_end(ax, 1.55, 0.725, kind="end")
    arrow(ax, 1.90, 0.725, 1.615, 0.725)

    # feedback dashed (back into the "Choose operation" decision)
    polyline_arrow(ax, [(7.15, 4.30), (7.15, 6.70), (6.35, 6.70), (6.35, 6.88)],
                   dashed=True)
    ax.text(6.25, 6.86, "repeat for next operation", fontsize=6.8, ha="right",
            va="center", bbox=dict(fc="white", ec="none", pad=1.0))

    save(fig, f"{OUT}/fig3_5_activity.png")


# ------------------------------------------------- sequence diagram helpers
def seq_fig(W, H, lifelines, ybot=0.30):
    fig, ax = fig_ax(W, H)
    ytop = H - 0.15
    hh = 0.62
    for name, x, w in lifelines:
        box(ax, x - w / 2, ytop - hh, w, hh, name, fs=7.0)
        line(ax, x, ytop - hh, x, ybot, dashed=True, lw=0.8)
    return fig, ax, ytop - hh


def seq_msg(ax, x1, x2, y, label, fs=6.6, dashed=False, dy=0.10):
    if abs(x2 - x1) < 0.02:  # self message
        polyline_arrow(ax, [(x1, y), (x1 + 0.42, y), (x1 + 0.42, y - 0.30),
                            (x1 + 0.04, y - 0.30)])
        ax.text(x1 - 0.06, y - 0.15, label, fontsize=fs, ha="right",
                va="center", linespacing=1.2,
                bbox=dict(fc="white", ec="none", pad=1.0))
    else:
        arrow(ax, x1, y, x2, y, dashed=dashed, ms=9)
        ax.text((x1 + x2) / 2, y + dy, label, fontsize=fs, ha="center", va="bottom")


def seq_divider(ax, W, y, label):
    line(ax, 0.20, y, W - 0.20, y, lw=0.7, dashed=True)
    ax.text(W / 2, y + 0.12, label, fontsize=7.0, ha="center", va="bottom",
            fontweight="bold", bbox=dict(fc="white", ec="none", pad=1.0))


# ---------------------------------------------------------------- Figure 3.6
def fig_seq_products():
    W, H = 7.3, 8.35
    lifelines = [
        ("Store Manager", 0.60, 1.25),
        ("React UI\nProducts page", 1.95, 1.30),
        ("Spring Boot REST API\n/api/products", 3.45, 1.50),
        ("Service layer &\nJPA repositories", 5.05, 1.50),
        ("MySQL\ngrocery_inventory", 6.55, 1.40),
    ]
    fig, ax, y0 = seq_fig(W, H, lifelines, ybot=0.78)
    M, UI, API, SVC, DB = [ll[1] for ll in lifelines]
    y = y0 - 0.26

    seq_divider(ax, W, y, "View product list")
    y -= 0.34
    seq_msg(ax, M, UI, y, "open Products page"); y -= 0.32
    seq_msg(ax, UI, API, y, "GET /api/products"); y -= 0.32
    seq_msg(ax, API, SVC, y, "getProducts()"); y -= 0.32
    seq_msg(ax, SVC, DB, y, "SELECT products JOIN inventory"); y -= 0.32
    seq_msg(ax, DB, SVC, y, "product rows", dashed=True); y -= 0.32
    seq_msg(ax, SVC, API, y, "List<ProductResponse>", dashed=True); y -= 0.32
    seq_msg(ax, API, UI, y, "200 OK (JSON)", dashed=True); y -= 0.32
    seq_msg(ax, UI, M, y, "product table rendered", dashed=True); y -= 0.36

    seq_divider(ax, W, y, "Add a product")
    y -= 0.34
    seq_msg(ax, M, UI, y, "fill Add Product form & submit"); y -= 0.32
    seq_msg(ax, UI, API, y, "POST /api/products\n{sku, name, category, price, ...}"); y -= 0.44
    seq_msg(ax, API, SVC, y, "createProduct(dto)"); y -= 0.32
    seq_msg(ax, SVC, SVC, y, "validate SKU uniqueness"); y -= 0.68
    seq_msg(ax, SVC, DB, y, "INSERT product\n+ inventory row"); y -= 0.44
    seq_msg(ax, DB, SVC, y, "generated ids", dashed=True); y -= 0.32
    seq_msg(ax, SVC, API, y, "ProductResponse", dashed=True); y -= 0.32
    seq_msg(ax, API, UI, y, "201 Created", dashed=True); y -= 0.32
    seq_msg(ax, UI, M, y, "success toast", dashed=True)

    note(ax, 0.25, 0.10, 3.30, 0.56,
         "Duplicate SKU -> HTTP 409 CONFLICT via the\n"
         "global exception handler (@RestControllerAdvice).", fs=6.4)
    note(ax, 3.75, 0.10, 3.30, 0.56,
         "Edit (PUT) and delete (DELETE) follow the same\n"
         "request - service - database - response pattern.", fs=6.4)

    save(fig, f"{OUT}/fig3_6_seq_products.png")


# ---------------------------------------------------------------- Figure 3.7
def fig_seq_forecast():
    W, H = 7.3, 8.05
    lifelines = [
        ("Store Manager", 0.60, 1.25),
        ("React UI\nDemand Forecast page", 1.95, 1.35),
        ("Vite dev proxy\n(/ml-api on :5173)", 3.40, 1.40),
        ("Python ML service\n(127.0.0.1:8000)", 4.95, 1.40),
        ("retail_demand_2025.csv\n+ trained RF model", 6.55, 1.40),
    ]
    fig, ax, y0 = seq_fig(W, H, lifelines, ybot=0.80)
    M, UI, PX, ML, DAT = [ll[1] for ll in lifelines]
    y = y0 - 0.26

    seq_divider(ax, W, y, "Load forecast options")
    y -= 0.34
    seq_msg(ax, UI, PX, y, "GET /ml-api/options"); y -= 0.32
    seq_msg(ax, PX, ML, y, "GET /api/options (path rewritten)"); y -= 0.32
    seq_msg(ax, ML, DAT, y, "distinct products & stores"); y -= 0.32
    seq_msg(ax, DAT, ML, y, "options lists", dashed=True); y -= 0.32
    seq_msg(ax, ML, UI, y, "{products, stores}", dashed=True); y -= 0.36

    seq_divider(ax, W, y, "Request a forecast")
    y -= 0.34
    seq_msg(ax, M, UI, y, "select product, store & horizon\n(7 / 14 / 30 days)"); y -= 0.46
    seq_msg(ax, UI, PX, y, "POST /ml-api/predict\n{productId, storeId, horizonDays}"); y -= 0.44
    seq_msg(ax, PX, ML, y, "POST /api/predict"); y -= 0.32
    seq_msg(ax, ML, ML, y, "validate horizon in {7, 14, 30}"); y -= 0.68
    seq_msg(ax, ML, DAT, y, "latest row for the selected\nproduct & store"); y -= 0.44
    seq_msg(ax, DAT, ML, y, "10-feature vector", dashed=True); y -= 0.32
    seq_msg(ax, ML, ML, y, "Random Forest predicts daily units\n(mean of 200 regression trees)"); y -= 0.68
    seq_msg(ax, ML, UI, y, "200 OK {estimatedDailyUnits,\nestimatedHorizonUnits}", dashed=True); y -= 0.44
    seq_msg(ax, UI, M, y, "forecast result displayed", dashed=True)

    note(ax, 0.25, 0.10, 3.55, 0.62,
         "Invalid horizon -> HTTP 400; unknown product/store\n"
         "pair -> HTTP 404; model failure -> HTTP 500\n(shown as an error card on the page).", fs=6.4)

    save(fig, f"{OUT}/fig3_7_seq_forecast.png")


# ---------------------------------------------------------------- Figure 3.8
def comp_icon(ax, x, y, s=0.10):
    """Small UML component icon (two tabs) at top-right of a component box."""
    ax.add_patch(Rectangle((x, y + s * 1.2), s, s * 0.7, fc="white", ec=EC, lw=0.8))
    ax.add_patch(Rectangle((x - s * 0.8, y + s * 1.9), s * 0.8, s * 0.7, fc="white", ec=EC, lw=0.8))


def fig_component():
    W, H = 7.6, 5.45
    fig, ax = fig_ax(W, H)

    # React SPA component
    band(ax, 0.15, 3.20, 3.15, 2.15, "<<component>>  React SPA  (presentation)", fs=8.2)
    comp_icon(ax, 3.05, 5.10)
    fe = [
        ("Dashboard /\nProducts /\nInventory pages", 0.30, 4.44),
        ("Sales / Alerts /\nReports pages", 1.80, 4.44),
        ("productService\n(REST client)", 0.30, 3.86),
        ("predictionService\n(HTTP client)", 1.80, 3.86),
        ("AuthContext,\nProtectedRoute", 0.30, 3.30),
        ("InventoryDataContext\n(shared state)", 1.80, 3.30),
    ]
    for t, x, y in fe:
        box(ax, x, y, 1.40, 0.46, t, fs=6.5)

    # Spring Boot component
    band(ax, 4.30, 3.20, 3.18, 2.15, "<<component>>  Spring Boot REST API", fs=8.2)
    comp_icon(ax, 7.28, 5.10)
    be = [
        ("ProductController\n/api/products", 4.45, 4.52),
        ("InventoryController\n/api/inventory", 5.97, 4.52),
        ("ProductService /\nInventoryService", 4.45, 3.92),
        ("JPA repositories\n(Hibernate)", 5.97, 3.92),
        ("DTO validation\n(Bean Validation)", 4.45, 3.32),
        ("Exception handler\n(404 / 409 / 400)", 5.97, 3.32),
    ]
    for t, x, y in be:
        box(ax, x, y, 1.40, 0.50, t, fs=6.5)

    # ML component
    band(ax, 0.15, 0.60, 3.35, 2.00, "<<component>>  Python ML service", fs=8.2)
    comp_icon(ax, 3.25, 2.35)
    ml = [
        ("load_and_train()\npandas + sklearn", 0.32, 1.85),
        ("OneHotEncoder +\nColumnTransformer", 1.95, 1.85),
        ("RandomForest\nRegressor (200 trees)", 0.32, 1.31),
        ("PredictionHandler\noptions / predict", 1.95, 1.31),
        ("Horizon projection\n(daily x days)", 0.32, 0.77),
        ("Metrics MAE / RMSE / R2", 1.95, 0.77),
    ]
    for t, x, y in ml:
        box(ax, x, y, 1.50, 0.44, t, fs=6.6)

    # Data stores
    cylinder(ax, 5.05, 1.35, 1.55, 1.00, "MySQL 8.0\n«database»\ngrocery_inventory", fs=7.0)
    cylinder(ax, 6.75, 1.35, 1.45, 1.00, "«artifact»\nretail_demand_\n2025.csv", fs=7.0)

    # connectors
    arrow(ax, 3.30, 4.78, 4.30, 4.78, "REST / JSON\nCRUD endpoints", fs=6.3, dy=0.16)
    arrow(ax, 2.05, 3.20, 2.05, 2.60, "HTTP /ml-api/* -> /api/*\n/options, /predict", fs=6.3, dx=-0.02, label_ha="left", ha="left")
    arrow(ax, 5.60, 3.20, 5.15, 1.87, "JDBC", fs=6.6, label_t=0.40, dx=0.28, label_ha="left", ha="left")
    polyline_arrow(ax, [(3.50, 2.05), (6.75, 2.05), (6.75, 1.83)], dashed=True)
    ax.text(4.50, 2.17, "pandas read_csv", fontsize=6.4, ha="center", va="center",
            bbox=dict(fc="white", ec="none", pad=1.0))

    save(fig, f"{OUT}/fig3_8_component.png")


# ---------------------------------------------------------------- Figure 3.9
def node3d(ax, x, y, w, h, title, title_fs=8.0, d=0.20):
    """UML deployment node (3-D box)."""
    ax.add_patch(Polygon([(x, y + h), (x + d, y + h + d), (x + w + d, y + h + d),
                          (x + w, y + h)], closed=True, fc="white", ec=EC, lw=LW))
    ax.add_patch(Polygon([(x + w, y), (x + w + d, y + d), (x + w + d, y + h + d),
                          (x + w, y + h)], closed=True, fc="white", ec=EC, lw=LW))
    box(ax, x, y, w, h)
    ax.text(x + w / 2, y + h - 0.22, title, fontsize=title_fs, ha="center",
            va="center", fontweight="bold")


def artifact(ax, x, y, w, h, text, fs=6.8):
    box(ax, x, y, w, h, text, fs=fs, rounded=0.05)


def fig_deployment():
    W, H = 7.6, 5.0
    fig, ax = fig_ax(W, H)

    # client node
    node3d(ax, 0.20, 2.45, 2.35, 2.15, "Client device")
    ax.text(1.375, 4.28, "(Store Manager's computer)", fontsize=6.8, ha="center", va="center")
    box(ax, 0.38, 3.30, 1.99, 0.70, "execution environment:\nWeb browser", fs=7.0)
    artifact(ax, 0.38, 2.62, 1.99, 0.55, "<<artifact>>\nReact SPA bundle\n(index.html + JS)", fs=6.8)

    # app server node
    node3d(ax, 3.30, 1.45, 4.00, 3.25, "Local application server", d=0.18)
    box(ax, 3.50, 3.67, 3.70, 0.72, "", rounded=0.05)
    ax.text(3.62, 4.17, "Node.js  -  Vite dev server   :5173", fontsize=7.2, ha="left", va="center", fontweight="bold")
    ax.text(3.62, 3.88, "serves the React app and proxies /ml-api/* -> 127.0.0.1:8000", fontsize=6.6, ha="left", va="center")
    box(ax, 3.50, 2.77, 3.70, 0.72, "", rounded=0.05)
    ax.text(3.62, 3.27, "Spring Boot  -  embedded Apache Tomcat   :8080", fontsize=7.2, ha="left", va="center", fontweight="bold")
    ax.text(3.62, 2.98, "<<execution environment>>  inventory-backend-0.0.1-SNAPSHOT.jar", fontsize=6.6, ha="left", va="center")
    box(ax, 3.50, 1.95, 3.70, 0.64, "", rounded=0.05)
    ax.text(3.62, 2.38, "Python 3  -  ML HTTP service   :8000", fontsize=7.2, ha="left", va="center", fontweight="bold")
    ax.text(3.62, 2.11, "<<artifact>> ml_service/app.py   (Random Forest pipeline)", fontsize=6.6, ha="left", va="center")
    box(ax, 3.50, 1.59, 3.70, 0.28, "", rounded=0.05)
    ax.text(3.62, 1.73, "<<artifact>>  retail_demand_2025.csv  -  training dataset", fontsize=6.6, ha="left", va="center")

    # db node
    node3d(ax, 3.30, 0.15, 4.10, 0.95, "")
    ax.text(5.35, 0.88, "Database server  (localhost:3306)", fontsize=7.6, ha="center", va="center", fontweight="bold")
    artifact(ax, 3.50, 0.24, 3.70, 0.48, "MySQL 8.0  -  schema: grocery_inventory (products, inventory)", fs=6.8)

    # communication paths
    arrow(ax, 2.55, 3.90, 3.30, 3.90, "HTTP\n(React app)", fs=6.6, dy=0.14)
    arrow(ax, 3.30, 3.10, 2.55, 3.10, "HTTP / JSON\nREST /api/*", fs=6.6, dy=0.16, dashed=False)
    arrow(ax, 2.55, 2.62, 3.30, 2.30, "HTTP / JSON\n/ml-api proxy", fs=6.6, label_t=0.6, dy=0.14, ha="center")
    arrow(ax, 5.35, 1.45, 5.35, 1.22, "JDBC  :3306", fs=6.6, label_t=0.5, dx=-0.32, label_ha="right", ha="right")

    save(fig, f"{OUT}/fig3_9_deployment.png")


if __name__ == "__main__":
    fig_usecase()
    fig_activity()
    fig_seq_products()
    fig_seq_forecast()
    fig_component()
    fig_deployment()
