"""Machine-learning diagrams (Figures 4.1 - 4.4) for the project report.

Ground truth: ml_service/app.py (dataset retail_demand_2025.csv, ColumnTransformer
with OneHotEncoder + passthrough, RandomForestRegressor(n_estimators=200),
80/20 split with random_state=42, horizons {7, 14, 30}).
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from diag_helpers import *

OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)

CX = 2.45          # spine centre for the vertical workflow figures
BOX_X, BOX_W = 0.80, 3.30
NOTE_X = 4.30


def _vchain(ax, nodes, oval_w=3.30):
    """nodes: list of (kind, cy, text, note).  kind in {'oval','box','end'}."""
    prev_bottom = None
    for kind, cy, text, note in nodes:
        if kind == "oval":
            usecase(ax, CX, cy, oval_w, 0.44, text, fs=7.0)
            top, bot = cy + 0.22, cy - 0.22
        elif kind == "end":
            usecase(ax, CX, cy, oval_w, 0.62, text, fs=6.6)
            top, bot = cy + 0.31, cy - 0.31
        else:
            box(ax, BOX_X, cy - 0.25, BOX_W, 0.50, text, fs=7.0)
            top, bot = cy + 0.25, cy - 0.25
        if prev_bottom is not None:
            arrow(ax, CX, prev_bottom, CX, top)
        if note:
            line(ax, BOX_X + BOX_W, cy, NOTE_X - 0.08, cy, lw=0.6, dashed=True)
            ax.text(NOTE_X, cy, note, fontsize=6.2, ha="left", va="center",
                    linespacing=1.25)
        prev_bottom = bot


# ---------------------------------------------------------------- Figure 4.1
def fig_ml_workflow():
    W, H = 6.8, 7.6
    fig, ax = fig_ax(W, H)

    nodes = [
        ("oval", 7.15, "Start", None),
        ("box", 6.50, "Load retail_demand_2025.csv",
         "10,950 records x 13 columns\n(pandas read_csv)"),
        ("box", 5.82, "Validate required columns",
         "all 13 expected columns must\nexist, else ValueError"),
        ("box", 5.14, "Clean the dataset",
         "Date -> datetime (coerce);\ndrop rows with missing values"),
        ("box", 4.46, "Separate features and target",
         "X: 10 feature columns;\ny: Units_Sold"),
        ("box", 3.78, "Train - test split",
         "test_size = 0.20  (80 / 20);\nrandom_state = 42"),
        ("box", 3.10, "Build the pipeline",
         "ColumnTransformer +\nRandomForestRegressor(200)\n(see Figure 4.2)"),
        ("box", 2.42, "Fit on the training set",
         "model.fit(X_train, y_train)"),
        ("box", 1.74, "Predict on the test set",
         "model.predict(X_test)"),
        ("box", 1.06, "Evaluate accuracy",
         "MAE, RMSE, R2 (shown on\nthe forecast page)"),
        ("end", 0.42, "Trained pipeline ready to serve\n(ThreadingHTTPServer, port 8000)",
         None),
    ]
    _vchain(ax, nodes)

    save(fig, f"{OUT}/fig4_1_ml_workflow.png")


# ---------------------------------------------------------------- Figure 4.2
def fig_preprocessing():
    W, H = 7.2, 4.35
    fig, ax = fig_ax(W, H)

    # ColumnTransformer band containing both branches
    band(ax, 1.80, 1.60, 5.15, 2.50, "ColumnTransformer", fs=8.0)

    box(ax, 2.05, 2.85, 2.05, 0.85,
        "Categorical (5)\nStore_ID, City,\nProduct_ID, Product,\nCategory", fs=5.9)
    box(ax, 4.55, 2.90, 2.15, 0.75,
        "OneHotEncoder\n(handle_unknown='ignore')", fs=6.2)
    arrow(ax, 4.10, 3.27, 4.55, 3.27)

    box(ax, 2.05, 1.85, 2.05, 0.85,
        "Numeric (5)\nPrice, Discount,\nPromotion, Holiday,\nStock", fs=5.9)
    box(ax, 4.55, 1.90, 2.15, 0.75,
        "passthrough\n(numeric values\nunchanged)", fs=6.0)
    arrow(ax, 4.10, 2.27, 4.55, 2.27)

    # input
    box(ax, 0.25, 2.35, 1.15, 0.85, "Raw feature\nrow\n(X: 10 columns)", fs=6.0)
    polyline_arrow(ax, [(1.40, 3.00), (1.72, 3.00), (1.72, 3.27), (2.05, 3.27)])
    polyline_arrow(ax, [(1.40, 2.55), (1.72, 2.55), (1.72, 2.27), (2.05, 2.27)])

    # regressor stage and output
    box(ax, 1.55, 0.85, 3.30, 0.60,
        "RandomForestRegressor\n(n_estimators = 200, random_state = 42)", fs=6.4)
    arrow(ax, 3.20, 1.60, 3.20, 1.45)
    arrow(ax, 4.85, 1.15, 5.30, 1.15)
    usecase(ax, 6.15, 1.15, 1.60, 0.62, "Predicted\nUnits_Sold", fs=6.6)

    note(ax, 0.25, 0.12, 6.70, 0.50,
         "The fitted pipeline is kept in memory; every /api/predict request reuses the\n"
         "same fitted transformers and the same 200 regression trees.", fs=6.2)

    save(fig, f"{OUT}/fig4_2_preprocessing.png")


# ---------------------------------------------------------------- Figure 4.3
def fig_prediction_workflow():
    W, H = 6.8, 5.6
    fig, ax = fig_ax(W, H)

    nodes = [
        ("oval", 5.15, "POST /api/predict request", None),
        ("box", 4.50, "Parse and validate the\nJSON body",
         "Content-Length 1 - 16,384 bytes;\nhorizon must be 7, 14 or 30"),
        ("box", 3.80, "Filter rows for the requested\nproduct and store",
         "DATA[Product_ID & Store_ID];\nempty match -> HTTP 404"),
        ("box", 3.10, "Take the latest row by Date",
         "sort_values('Date').iloc[-1];\nalso yields basedOnDate"),
        ("box", 2.40, "Predict with the fitted pipeline",
         "10-feature vector -> mean of\nthe 200 tree predictions"),
        ("box", 1.70, "Clamp and scale the estimate",
         "daily = max(0, prediction);\nhorizon = daily x horizonDays"),
        ("end", 0.95, "HTTP 200 JSON response\n(daily units, horizon units,\nbasedOnDate)",
         None),
    ]
    _vchain(ax, nodes, oval_w=3.40)

    save(fig, f"{OUT}/fig4_3_prediction_workflow.png")


# ---------------------------------------------------------------- Figure 4.4
def fig_forecast_flowchart():
    W, H = 7.6, 7.2
    fig, ax = fig_ax(W, H)
    CXD = 2.55
    DW, DH = 2.70, 0.85          # diamond size
    EW, EH = 2.35, 0.72          # error terminal size

    usecase(ax, CXD, 6.78, 1.60, 0.44, "Start", fs=7.0)
    box(ax, CXD - 1.35, 5.78, 2.70, 0.48, "Receive POST /api/predict", fs=6.6)
    arrow(ax, CXD, 6.56, CXD, 6.26)

    diamond(ax, CXD, 5.055, DW, DH, "Valid JSON body?\n(1 - 16,384 bytes)", fs=6.2)
    arrow(ax, CXD, 5.78, CXD, 5.48)

    diamond(ax, CXD, 3.905, DW, DH, "horizonDays in\n{7, 14, 30}?", fs=6.2)
    arrow(ax, CXD, 4.63, CXD, 4.33)
    ax.text(CXD + 0.12, 4.48, "Yes", fontsize=5.8, ha="left", va="center")

    diamond(ax, CXD, 2.755, DW, DH, "Product and store\nfound in dataset?", fs=6.2)
    arrow(ax, CXD, 3.48, CXD, 3.18)
    ax.text(CXD + 0.12, 3.33, "Yes", fontsize=5.8, ha="left", va="center")

    box(ax, CXD - 1.35, 1.41, 2.70, 0.62,
        "Predict daily units with the fitted\npipeline; clamp at 0 and multiply\n"
        "by the horizon", fs=6.0)
    arrow(ax, CXD, 2.33, CXD, 2.03)
    ax.text(CXD + 0.12, 2.18, "Yes", fontsize=5.8, ha="left", va="center")

    usecase(ax, CXD, 0.76, 2.70, 0.70,
            "HTTP 200 JSON response\nestimatedDailyUnits &\nestimatedHorizonUnits", fs=6.0)
    arrow(ax, CXD, 1.41, CXD, 1.11)

    # error terminals ("No" branches)
    errors = [
        (5.055, "HTTP 400\ninvalid / oversized\nJSON body"),
        (3.905, "HTTP 400\nhorizon not in\n{7, 14, 30}"),
        (2.755, "HTTP 404\nunknown product\nor store pair"),
    ]
    for cy, text in errors:
        box(ax, 5.00, cy - EH / 2, EW, EH, text, fs=5.9, rounded=0.06)
        arrow(ax, CXD + DW / 2, cy, 5.00, cy)
        ax.text(4.45, cy + 0.13, "No", fontsize=5.8, ha="center", va="center")

    note(ax, 4.30, 0.45, 3.05, 0.60,
         "Any unhandled exception in the handler\nreturns HTTP 500 'The model could\n"
         "not generate a prediction.'", fs=5.9)

    save(fig, f"{OUT}/fig4_4_forecast_flowchart.png")


if __name__ == "__main__":
    fig_ml_workflow()
    fig_preprocessing()
    fig_prediction_workflow()
    fig_forecast_flowchart()
