# AI on FHIR – Full-Stack Engineer Take-Home Assessment

## Project Overview
This is a multilingual AI-powered FHIR Query Assistant built with Next.js (frontend) and Flask (backend) to support natural language queries for FHIR-like patient data. It processes queries in English and Spanish and visualizes results both in table and chart formats.

## Features
- 🔍 **Query auto-complete** based on language.
- 🌐 **Multilingual support** (English and Spanish via `react-i18next`).
- 📊 **Data visualization** with Recharts:
  - Pie chart for condition distribution
  - Bar chart for patient age
- 🧠 **Natural Language Processing** using spaCy to extract age, operator, and medical condition.
- 🧾 **FHIR-like API simulation** returning structured patient data.
- 📋 **Table display** of patient name, age, and condition.
- 🎯 **Optional filters** by diagnosis or age.

---

## Folder Structure
```
project-root
│
├── ai-on-fhir-frontend/        # Next.js frontend
│   └── src/
│       └── app/
│           ├── page.js         # Main page with UI & logic
│           ├── layout.js       # App layout config
│           ├── i18n.js         # Language i18n configuration
│           └── page.module.css # Styling (optional)
│
├── ai-on-fhir-backend/         # Flask backend
│   └── app.py                  # Handles NLP parsing and FHIR-like data simulation
│
├── docker-compose.yml          # Multi-container Docker setup
└── README.md                   # You are here 🧾
```

---

## Key Files

### Frontend
- **`page.js`** – Contains form, suggestions, table, chart rendering.
- **`i18n.js`** – Initializes language translations using `react-i18next`.
- **`layout.js`** – Provides support for metadata and root layout.

### Backend
- **`app.py`** – Uses `spaCy` to extract age, operator (`over`/`under`), and known medical conditions from queries in English or Spanish. Returns structured patient data and chart info.

---

## Technologies Used

### Frontend
- Next.js 15+
- React 19
- react-i18next
- recharts

### Backend
- Flask
- Flask-CORS
- spaCy (`en_core_web_sm`)

---

## Running Locally (Docker)

### Prerequisites
- Docker Desktop installed

### Run the app
```bash
docker-compose up --build
```
The frontend will run at: `http://localhost:3000`
The backend API runs inside container at: `http://backend:5000/query`

---

## Example Queries

| Language | Query Example                                           |
|----------|----------------------------------------------------------|
| English  | "Show me all cancer patients over 50"                   |
| Spanish  | "Muéstrame todos los pacientes con cáncer mayores de 50"|
| English  | "List patients under 40 with asthma"                    |
| Spanish  | "Lista de pacientes menores de 40 con asma"             |
| English  | "Give me all hypertension cases over 60"               |

### Example Input/Output

**Input**: `Show me all cancer patients over 50`

**Parsed**: 
```json
{
  "age": 50,
  "condition": "cancer",
  "operator": "over"
}
```

**Output**: JSON response with filtered patients and age data for charts

---

## NLP Support (spaCy)
- Extracts keywords: `age`, `operator` (under/over), and condition.
- Supports common conditions like:
  - diabetes, asthma, cancer, hypertension, obesity
  - plus Spanish equivalents: cáncer, obesidad, hipertensión, etc.

---

## Charts & Tables
- 📈 Pie chart represents **distribution by condition**.
- 📊 Bar chart shows **patient age distribution**.
- 📋 Table shows **name, age, condition** for each matched patient.


---

## Internationalization (i18n)
- Language auto-detection and switch via dropdown
- Translations stored inline inside `i18n.js`
- Suggestions shown based on selected language

---

**Security & Compliance Plan: HIPAA-Conscious Architecture for AI on FHIR**

This document outlines a technical strategy to ensure HIPAA compliance and secure handling of FHIR-like data within the AI on FHIR project.

---

### 1. Authentication & Authorization

**Mechanism**: OAuth 2.0 + SMART on FHIR (future-ready)

* **Frontend Access Flow**:

  * Planned integration with SMART on FHIR using OAuth 2.0 authorization code flow.
  * Supports patient-level and provider-level scopes.

* **Token Handling**:

  * Access tokens stored securely in-memory.
  * No PII or tokens stored in localStorage or transmitted over insecure channels.

---

### 2. Data Privacy & Transport

* **Encryption in Transit**:

  * TLS 1.2+ mandatory between frontend/backend/API.

* **Input Protection**:

  * JSON only (no form/multipart data)
  * Input queries sanitized server-side

* **Protected Health Information (PHI)**:

  * Currently simulated with fake/mock data
  * Future real integration to ensure:

    * No PHI is logged or returned unnecessarily
    * Sensitive identifiers (SSNs, MRNs) are never exposed

* **Audit Logging**:

  * All requests logged with timestamp, IP, language selected, and query intent
  * Logs shipped to a secure backend for retention (e.g., AWS CloudWatch)

---

### 3. Role-Based Access Control (RBAC)

* **Roles Defined**:

  * Admin (system settings, audit viewing)
  * Provider (query, chart viewing)
  * Patient (view own records only - if auth enabled)

* **Enforcement Strategy**:

  * Backend will validate access token scopes to enforce RBAC
  * Future access control middleware (Flask or FastAPI RBAC decorators)

---

### 4. Containerization & Isolation

* Each service (frontend, backend) runs in a separate Docker container
* Future enhancements:

  * Use reverse proxy (e.g., Traefik or NGINX) to isolate HTTP requests
  * Secure inter-service communication with internal Docker networks

---

### 5. Compliance Checklist

| Requirement                         | Status  |
| ----------------------------------- | ------- |
| Data encrypted in transit           | Yes     |
| Minimal PHI exposure                | Yes     |
| Role-based access support           | Planned |
| OAuth2-based authentication         | Planned |
| Audit logs                          | Partial |
| Containerized and isolated services | Yes     |

---

This strategy sets a foundation to build a production-grade HIPAA-compliant system with scalability and patient data safety in mind.


---

## To Do (Future Scope)
- Integrate actual FHIR APIs.
- Add JWT authentication.
- Use advanced NLP/LLMs for semantic understanding.

---

## Authors
- Developed by Venkata Lakshmi Parimala for the AI on FHIR Full-Stack.

---

