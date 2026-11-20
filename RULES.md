# Project Rules — Smart System for Grocery Store Inventory Demand Forecasting using Machine Learning

## 1. Main Objective

Build a final-year B.Tech CSE project titled:

**Smart System for Grocery Store Inventory Demand Forecasting using Machine Learning**

The system should help a grocery store:

* manage products
* manage inventory
* record sales
* monitor stock
* identify low-stock products
* identify overstocked products
* forecast future product demand using machine learning
* provide reports for better inventory decisions

The project must remain understandable, demonstrable, and appropriate for a final-year B.Tech project.

---

## 2. Source of Truth

This `RULES.md` file is the main project objective and source of truth.

Before making significant changes:

1. Read `RULES.md`.
2. Inspect the existing implementation.
3. Preserve already-working functionality.
4. Follow the architecture and restrictions defined here.

Do not silently contradict these rules.

---

## 3. Technology Stack

Intended architecture:

* Frontend: React.js + JavaScript + Vite
* Backend: Spring Boot + Java
* Database: MySQL
* Machine Learning: Python + Pandas + NumPy + scikit-learn

Target architecture:

React Frontend
↓
Spring Boot Backend
↓
MySQL Database

Demand forecasting:

React
↓
Spring Boot
↓
ML prediction service/model
↓
Spring Boot
↓
React

The actual implementation must reflect what has really been built.

Never claim that a component is connected when it is only a placeholder.

---

## 4. Current Project State

The project currently contains a React/Vite frontend prototype and ML notebook/dataset work.

The frontend currently uses temporary in-memory data.

The project does NOT yet have:

* Spring Boot backend
* MySQL integration
* persistent database storage
* real authentication
* deployed ML prediction service
* frontend/backend integration
* backend/ML integration

Do not pretend these features already exist.

---

## 5. Frontend Preservation

The existing frontend design is approved.

Do not perform unnecessary redesigns.

Do not unnecessarily change:

* page layouts
* navigation
* colors
* styling
* existing components
* working functionality
* project structure

Prefer small, targeted changes.

Only redesign when explicitly requested or when technically required.

---

## 6. Main Features

The intended application features are:

1. Login
2. Dashboard
3. Product Management
4. Inventory Management
5. Sales Management
6. Demand Prediction
7. Low-stock Alert
8. Overstock Alert
9. Reports
10. Settings

---

## 7. Product Management

Products should eventually contain information such as:

* Product ID
* Product name
* Category
* Price
* Stock quantity
* Minimum stock level

The final source of truth for persistent product information should be MySQL through the backend.

---

## 8. Inventory Management

Inventory should show current product stock.

Restocking should increase stock.

Example:

Stock = 50

Restock = 20

New stock = 70

When backend/database integration is implemented, inventory updates should be persisted.

---

## 9. Sales Management

Recording a sale should reduce inventory.

Example:

Stock = 50

Sale = 5

New stock = 45

The final implementation should perform this operation through the backend/database rather than relying only on frontend memory.

Validate:

* quantity must be positive
* sale quantity must not exceed available stock

---

## 10. Stock Alerts

The prototype currently uses these temporary rules.

### Low Stock

If:

`quantity <= minStock`

generate a Low Stock alert.

### Overstock

If:

`quantity > 3 * minStock`

generate an Overstock alert.

These are temporary prototype rules.

Do not silently change these rules.

If a future `maxStock` field is introduced, discuss the architecture before replacing the current rule.

Alert logic should remain centralized instead of being duplicated across multiple pages.

---

## 11. Machine Learning

Machine learning is a major part of the project.

Expected pipeline:

Dataset
→ Data Cleaning
→ EDA
→ Feature Engineering
→ Train/Test Split
→ Model Training
→ Model Evaluation
→ Best Model
→ Demand Prediction

Current target variable:

`Units_Sold`

The project already contains Random Forest experimentation.

Existing notebook result:

* MAE = 6.89
* RMSE = 9.56
* R² = 0.8155

These are existing experimental results only.

Never fabricate model metrics.

If new models are added, they must actually be trained and evaluated.

Do not add unnecessarily complex ML models merely to make the project appear advanced.

---

## 12. ML Integration

The Demand Forecast frontend currently contains a prediction boundary but does not have a connected ML service.

Do NOT:

* generate fake predictions
* generate random predictions
* hard-code prediction values
* create fake API responses
* claim ML integration is complete when it is not

Before implementing ML integration:

1. Inspect the existing notebook.
2. Inspect the dataset.
3. Inspect the frontend prediction service.
4. Inspect the backend.
5. Decide on a clear API contract.
6. Implement the smallest reliable integration.

---

## 13. Backend Development

When Spring Boot development begins:

First inspect the repository and current architecture.

Then identify:

* Java version
* Spring Boot version
* dependencies
* package structure
* configuration
* entities
* repositories
* services
* controllers

Implement incrementally.

Do not generate the entire backend in one uncontrolled change.

Potential backend responsibilities:

* authentication
* products
* inventory
* sales
* alerts
* predictions
* reports

---

## 14. Database

MySQL should eventually become the persistent source of truth.

Do not keep the frontend mock/in-memory data as the final architecture.

Possible core entities:

* Users
* Products
* Inventory
* Sales
* Predictions

The exact schema should be decided after inspecting the existing project and requirements.

Avoid duplicate tables and unnecessary fields.

Do not silently make major schema decisions without explaining them.

---

## 15. Authentication

The current Demo Mode is temporary.

It must never be described as real authentication.

When backend authentication is implemented:

* connect login to Spring Boot
* implement proper authentication/session or token handling
* protect backend APIs
* update frontend authentication boundary

Do not claim authentication is secure until it is actually implemented and tested.

---

## 16. Code Quality

Prefer:

* readable code
* simple architecture
* meaningful names
* reusable logic
* separation of concerns
* centralized business rules
* minimal duplication

Avoid:

* unnecessary abstractions
* unnecessary dependencies
* over-engineering
* duplicate logic
* dead code
* unrelated refactoring

---

## 17. Verification

After significant implementation:

1. Run lint.
2. Run build.
3. Run backend tests/build when backend exists.
4. Check compilation.
5. Check imports.
6. Test affected functionality.
7. Clearly report what passed and what failed.

Never claim that something works unless it was actually verified.

---

## 18. Git Safety

Before significant changes:

* inspect repository state
* preserve working changes
* avoid destructive operations
* avoid deleting files without checking their purpose

Never commit:

* passwords
* API keys
* secrets
* private credentials
* database passwords
* sensitive `.env` values

---

## 19. Dependency Safety

Do not add dependencies unless necessary.

Before adding a dependency:

* check existing packages
* explain why it is required
* avoid unnecessary upgrades

Do not use destructive dependency commands such as:

`npm audit fix --force`

unless explicitly requested.

---

## 20. Development Stages

Follow this development order unless there is a strong technical reason to change it:

Stage 1 — Frontend prototype
↓
Stage 2 — Spring Boot backend
↓
Stage 3 — MySQL persistence
↓
Stage 4 — React ↔ Spring Boot integration
↓
Stage 5 — Real authentication
↓
Stage 6 — ML prediction integration
↓
Stage 7 — Intelligent alerts/inventory support
↓
Stage 8 — Testing
↓
Stage 9 — Documentation
↓
Stage 10 — Final demonstration

Do not randomly jump between stages.

Do not create fake integrations.

---

## 21. Student-Friendly Implementation

This is a final-year student project.

Code and architecture should be:

* understandable
* explainable in viva
* practical
* not unnecessarily complex

When making significant changes, explain:

* what changed
* why it changed
* which files changed
* how it works
* how to test it

---

## 22. Current Immediate Objective

The immediate objective is to establish a stable project foundation.

After `RULES.md` is created, the next step should be:

1. Inspect the repository again.
2. Confirm `RULES.md` is being followed.
3. Identify the current frontend checkpoint.
4. Identify what is needed for the Spring Boot backend.
5. Propose a backend implementation plan.
6. Wait for approval before major backend implementation.

Do not implement the backend automatically just because this file has been created.

---

## Final Rule

**Read `RULES.md` before significant work.**

**Preserve working functionality.**

**Do not fabricate APIs, authentication, database records, ML predictions, or test results.**

**Build incrementally.**

**Verify every significant change.**

**Keep the project simple enough for a final-year B.Tech viva.**
