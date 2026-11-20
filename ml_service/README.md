# Local demand prediction service

This local Python service reproduces the existing notebook's evaluated Random Forest pipeline using `retail_demand_2025.csv`:

- Target: `Units_Sold`
- Features: `Store_ID`, `City`, `Product_ID`, `Product`, `Category`, `Price`, `Discount`, `Promotion`, `Holiday`, and `Stock`
- Preprocessing: one-hot encode the five categorical columns and pass through the numeric columns
- Split/model: 80/20 `train_test_split` with `random_state=42`; 200-tree `RandomForestRegressor` with `random_state=42`

The service trains at startup and prints the measured metrics for its train/test split. It does not save a fabricated model or prediction. The notebook's previously recorded metrics remain displayed in the React page as existing experiment results.

## Run for the review

From the project root, create and activate a virtual environment, install the listed Python packages, then start the service:

```powershell
py -m venv ml_service\.venv
.\ml_service\.venv\Scripts\Activate.ps1
python -m pip install -r ml_service\requirements.txt
python ml_service\app.py
```

In another terminal, start the React app with `npm run dev`. Vite forwards `/ml-api` requests to the Python service at `127.0.0.1:8000`. Keep both processes running during the demo.

## Local routes

- `GET /health` reports whether the service and trained model are ready.
- `GET /api/options` returns product/store choices read from the CSV.
- `POST /api/predict` takes `productId`, `storeId`, and `horizonDays` (7, 14, or 30).

For inference, the service selects the latest CSV row for that product/store and passes its actual model features to the trained pipeline. The daily prediction is model output. The horizon total is an explicit constant-rate projection of that daily output, not a day-by-day forecast; the response and UI state this assumption. The source data ends in 2025, so the result is a dataset-backed demonstration rather than a current operational forecast.
