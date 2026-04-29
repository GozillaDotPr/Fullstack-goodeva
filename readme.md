# Mini AI Sales Prediction System

### A. Project Overview
The **Mini AI Sales Prediction System** is a full-stack web application designed to forecast whether a product's sales status will be "Laris" (High Demand) or "Tidak" (Low Demand). 

**What problem it solves:**
Businesses often struggle to predict product performance accurately. This system solves that by leveraging historical data (sales volume, price, and discount) to predict future sales trends. By providing an intuitive interface and rapid, AI-driven predictions, it allows business owners to make data-backed inventory, marketing, and pricing decisions.

---

### B. How to Run Project
**IMPORTANT RULE:**
The project is run ONLY using:
```bash
docker-compose up --build
```

---

### C. System Architecture & Key Components
The system is built using a decoupled architecture, separating the client interface, API services, and data models.

#### 1. Frontend (React)
*   **Technology:** Next.js (React 19), Tailwind CSS, Zustand, and Material UI.
*   **Role:** Acts as the presentation layer. It provides users with a clean, interactive dashboard to input sales parameters and visualize the prediction results.

#### 2. Backend (FastAPI)
*   **Technology:** FastAPI (Python), Uvicorn, and Pydantic.
*   **Role:** Acts as the central application layer. It manages secure routing (JWT authentication), validates incoming frontend requests, communicates with the database, and loads the machine learning artifacts to perform real-time predictions.

#### 3. Machine Learning Pipeline
*   **Technology:** scikit-learn, pandas, numpy, and joblib.
*   **Role:** An offline training script (`train.py`) that processes raw data (`sales_data.csv`), trains multiple classification algorithms (Logistic Regression, Decision Trees, Random Forest), and selects the highest-performing model based on F1-score. The best model and its preprocessing scalers are exported as `.joblib` files to be consumed by the FastAPI backend.

#### 4. Database (PostgreSQL)
*   **Technology:** PostgreSQL, SQLAlchemy (ORM), and Alembic.
*   **Role:** Serves as the persistent data storage layer. It stores historical sales records, user credentials, and any other relational data required by the application securely.

more information you can read at [docs/system-desain.md](docs/system-desain.md)


## D. Assumptions (IMPORTANT SECTION)

This section explains the key architectural and implementation decisions taken in the system, along with their rationale in a real-world engineering context.

---

### 1. Why Multiple AI/ML Models Might Be Used (or Simplified Model Approach)

In production-grade machine learning systems, it is common practice to experiment with multiple algorithms (e.g., Logistic Regression, Decision Trees, Random Forest, Gradient Boosting) before selecting the best-performing model.

In this project, the approach is intentionally simplified for practical and technical test considerations:

- Multiple models may still be evaluated during experimentation to compare performance (e.g., accuracy, F1-score, precision-recall balance).
- However, the final implementation typically uses a **single optimized baseline model** from scikit-learn.

#### Reasons for simplification:
- Faster training and iteration cycles, suitable for small to medium datasets (`sales_data.csv`)
- Easy integration with FastAPI using a single serialized `.joblib` model
- Sufficient for binary classification tasks (e.g., *Laris / Tidak Laris*)
- Focus on system design rather than ML competition optimization

This ensures the system remains efficient, maintainable, and aligned with the project scope.

---

### 2. Why JWT Authentication Uses Expiration Time

The system uses JWT (JSON Web Token) for authentication, which is stateless by design—meaning the server does not store session data.

Because of this, an expiration mechanism is required.

#### Reasons for JWT expiration:
- Reduces risk if a token is stolen (limited lifetime usage)
- Forces periodic re-authentication for improved security
- Prevents indefinite access using a single token
- Enables better control over session lifecycle

#### Typical setup:
- Access token lifetime: 15–60 minutes

This design balances security and usability in stateless authentication systems.

---

### 3. Why Frontend Stores Token in localStorage

In a React Single Page Application (SPA), storing JWT tokens in `localStorage` is a common approach due to its simplicity.

#### Advantages:
- Persists authentication state after page refresh
- Simple integration with frontend state management (e.g., Zustand)
- Easy access when attaching tokens to API requests

#### Trade-offs:
- Vulnerable to XSS (Cross-Site Scripting) attacks
- Token is accessible via JavaScript, increasing security risk



In this project, `localStorage` is used as a pragmatic trade-off to keep the implementation simple while maintaining functional authentication flow.