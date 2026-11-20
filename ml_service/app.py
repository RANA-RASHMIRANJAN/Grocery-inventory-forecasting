"""Local HTTP service that trains and serves the notebook's Random Forest pipeline."""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


ROOT_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = ROOT_DIR / "retail_demand_2025.csv"
HOST = "127.0.0.1"
PORT = 8000
TARGET = "Units_Sold"
CATEGORICAL_FEATURES = ["Store_ID", "City", "Product_ID", "Product", "Category"]
NUMERIC_FEATURES = ["Price", "Discount", "Promotion", "Holiday", "Stock"]
FEATURES = CATEGORICAL_FEATURES + NUMERIC_FEATURES
ALLOWED_HORIZONS = {7, 14, 30}


def load_and_train():
    """Reproduce notebook cells 70-75 using the real CSV and same split/model settings."""
    if not DATASET_PATH.is_file():
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

    data = pd.read_csv(DATASET_PATH)
    required_columns = set(FEATURES + [TARGET, "Date", "Sales"])
    missing_columns = required_columns.difference(data.columns)
    if missing_columns:
        raise ValueError(f"Dataset is missing required columns: {', '.join(sorted(missing_columns))}")

    data["Date"] = pd.to_datetime(data["Date"], errors="coerce")
    data = data.dropna(subset=FEATURES + [TARGET, "Date"]).copy()
    if data.empty:
        raise ValueError("Dataset has no usable training rows.")

    features = data[FEATURES]
    target = data[TARGET]
    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.20,
        random_state=42,
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ("num", "passthrough", NUMERIC_FEATURES),
        ]
    )
    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "regressor",
                RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1),
            ),
        ]
    )
    model.fit(x_train, y_train)

    test_predictions = model.predict(x_test)
    metrics = {
        "mae": round(float(mean_absolute_error(y_test, test_predictions)), 2),
        "rmse": round(float(mean_squared_error(y_test, test_predictions) ** 0.5), 2),
        "r2": round(float(r2_score(y_test, test_predictions)), 4),
    }
    return data, model, metrics


DATA, MODEL, METRICS = load_and_train()
print(
    "Notebook-compatible Random Forest evaluation: "
    f"MAE={METRICS['mae']}, RMSE={METRICS['rmse']}, R2={METRICS['r2']}"
)


def product_options():
    rows = DATA[["Product_ID", "Product", "Category"]].drop_duplicates()
    rows = rows.sort_values(["Product_ID"])
    return [
        {"id": row.Product_ID, "name": row.Product, "category": row.Category}
        for row in rows.itertuples(index=False)
    ]


def store_options():
    rows = DATA[["Store_ID", "City"]].drop_duplicates().sort_values("Store_ID")
    return [{"id": row.Store_ID, "city": row.City} for row in rows.itertuples(index=False)]


class PredictionHandler(BaseHTTPRequestHandler):
    server_version = "LocalDemandModel/1.0"

    def _send_json(self, status, payload):
        body = json.dumps(payload, allow_nan=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        route = urlparse(self.path).path
        if route == "/health":
            return self._send_json(200, {"status": "ready", "model": "Random Forest Regressor"})
        if route == "/api/options":
            return self._send_json(200, {"products": product_options(), "stores": store_options()})
        return self._send_json(404, {"error": "Route not found."})

    def do_POST(self):
        if urlparse(self.path).path != "/api/predict":
            return self._send_json(404, {"error": "Route not found."})

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length <= 0 or content_length > 16_384:
                return self._send_json(400, {"error": "A small JSON request body is required."})
            request = json.loads(self.rfile.read(content_length))
            result = self._predict(request)
            return self._send_json(200, result)
        except (json.JSONDecodeError, UnicodeDecodeError, TypeError, ValueError) as error:
            return self._send_json(400, {"error": str(error)})
        except Exception:
            return self._send_json(500, {"error": "The model could not generate a prediction."})

    def _predict(self, request):
        if not isinstance(request, dict):
            raise ValueError("The request must be a JSON object.")

        product_id = str(request.get("productId", ""))
        store_id = str(request.get("storeId", ""))
        try:
            horizon_days = int(request.get("horizonDays", 0))
        except (TypeError, ValueError) as error:
            raise ValueError("Choose a 7, 14, or 30 day horizon.") from error

        if horizon_days not in ALLOWED_HORIZONS:
            raise ValueError("Choose a 7, 14, or 30 day horizon.")

        matches = DATA[(DATA["Product_ID"] == product_id) & (DATA["Store_ID"] == store_id)]
        if matches.empty:
            raise ValueError("The selected product and store were not found in the dataset.")

        latest = matches.sort_values("Date").iloc[-1]
        model_input = pd.DataFrame([{feature: latest[feature] for feature in FEATURES}], columns=FEATURES)
        predicted_daily_units = max(0.0, float(MODEL.predict(model_input)[0]))
        projected_horizon_units = predicted_daily_units * horizon_days

        return {
            "model": "Random Forest Regressor",
            "target": TARGET,
            "productId": product_id,
            "productName": str(latest["Product"]),
            "storeId": store_id,
            "city": str(latest["City"]),
            "horizonDays": horizon_days,
            "estimatedDailyUnits": round(predicted_daily_units, 2),
            "estimatedHorizonUnits": round(projected_horizon_units, 2),
            "basedOnDate": latest["Date"].date().isoformat(),
            "projectionAssumption": (
                "The horizon total multiplies the model's daily estimate by the selected days; "
                "it assumes demand remains at that daily rate."
            ),
        }

    def log_message(self, format_string, *args):
        print(f"{self.address_string()} - {format_string % args}")


if __name__ == "__main__":
    print(f"Demand prediction service listening on http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), PredictionHandler).serve_forever()
