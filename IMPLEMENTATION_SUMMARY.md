<div align="center">

# 🏪 Merchant Intelligence Platform

> *Real-time sales. AI-powered spending insights. Bulk imports. All wired together.*

[![Backend](https://img.shields.io/badge/backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](.)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%20%2B%20TypeScript-000000?style=for-the-badge&logo=nextdotjs)](.)
[![Database](https://img.shields.io/badge/database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](.)
[![Charts](https://img.shields.io/badge/charts-Recharts-FF6384?style=for-the-badge)](.)
[![AI](https://img.shields.io/badge/insights-AI%20Powered-8B5CF6?style=for-the-badge)](.)

---

**Upload a CSV → transactions parsed → AI analyses your spending → dashboard updates live.**

</div>

---

## 💡 What Is This?

A full-stack merchant and financial analytics platform with two major capabilities:

**1. Merchant Dashboard** — a real-time command centre for sales, revenue, orders, and customer metrics, with bulk Excel/CSV import and interactive charts.

**2. AI Insights Engine** — an intelligent spending analyser that detects patterns, compares month-over-month behaviour, and surfaces actionable recommendations with projected savings.

Together they give merchants and users a complete picture of their financial health — live, visual, and smart.

---

## 🗺️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Next.js Frontend (TypeScript)           │
│                                                         │
│  /merchant/dashboard   → Live metrics + charts          │
│  /merchant/transactions → Filter, search, add, export   │
│  /merchant/upload      → Excel / CSV bulk import        │
│  /dashboard/insights   → AI-powered recommendations     │
└──────────────────────┬──────────────────────────────────┘
                       │  REST API (CORS: localhost:3000)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                Spring Boot Backend (Java)                │
│                                                         │
│  MerchantController   →  /api/merchant/**               │
│  DashboardController  →  /api/dashboard/**              │
│  (+ Transaction APIs) →  /api/transactions/**           │
│                                                         │
│  MerchantService      →  Dashboard calcs + file parse   │
│  DashboardService     →  AI insights + pattern detect   │
└──────────────────────┬──────────────────────────────────┘
                       │  Spring Data MongoDB
                       ▼
              ┌─────────────────┐
              │    MongoDB       │
              │ Transactions,    │
              │ Users, Sessions  │
              └─────────────────┘
```

---

## ✨ Feature Breakdown

### 🏪 Merchant Dashboard (`/merchant/dashboard`)

The live heartbeat of your business — refreshes from real API data every load.

| Widget | What it shows |
|--------|--------------|
| 📈 Net Sales | Current total with month-over-month % change |
| 💰 Revenue | Gross revenue with trend indicator |
| 🛒 Orders | Order count and growth rate |
| 👥 Customers | Unique customer count delta |
| 📊 Sales Chart | 6-month bar/line history (Recharts) |
| 🥧 Revenue Pie | Breakdown by category |
| 🕐 Recent Activity | Last 5 transactions feed |

---

### 💳 Merchant Transactions (`/merchant/transactions`)

- Full transaction listing with **search and filter** (by type, by category)
- **Add transaction** dialog — inline form, no page change
- Export placeholder — ready to wire to your CSV/PDF generator

---

### 📤 Bulk Upload (`/merchant/upload`)

Drop a file. Walk away. Come back to parsed data.

```
Supported formats:
├── .xlsx   (Excel — Apache POI)
├── .xls    (Legacy Excel — Apache POI)
└── .csv    (BufferedReader parsing)

Expected columns:
Date          → MM/dd/yyyy
Description   → Free text
Amount        → Positive = income, Negative = expense
Category      → Products / Expenses / etc.
```

- **Template download** — grab a pre-formatted starter file
- **Real-time status feedback** — success count, error rows, validation messages
- **File format validation** before the upload even hits the server

---

### 🤖 AI Insights (`/dashboard/insights`)

Not just charts — actual intelligence layered on top of your spending data.

```
Raw transactions
      │
      ▼
Category spending analysis
      │
      ▼
Month-over-month comparison
      │
      ▼
Pattern detection:
  ├── High spending in a category vs historical average
  ├── Frequent low-value transactions (micro-spend creep)
  └── Unusual spikes in specific categories
      │
      ▼
Suggestion generation → Potential savings calculation
      │
      ▼
Rendered as: recommendation cards + badges + savings amount
```

**What the page shows:**
- 🧠 Primary AI recommendation (context-aware, based on your actual data)
- 💵 Projected savings card with calculated dollar amount
- 📂 Category-wise breakdown with per-category suggestions
- 🔍 Detected spending patterns with actionable next steps

---

## 🔌 API Reference

**Base URL:** `http://localhost:8080`

### 🏪 Merchant APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/merchant/dashboard/summary?userId=` | Net sales, revenue, orders, customers + % changes |
| `GET` | `/api/merchant/dashboard/sales-chart?userId=` | 6-month monthly sales breakdown |
| `GET` | `/api/merchant/dashboard/revenue-breakdown?userId=` | Revenue split by category |
| `POST` | `/api/merchant/upload` | Bulk upload — `multipart/form-data` |

### 📊 Dashboard APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/summary?userId=` | High-level financial summary |
| `GET` | `/api/dashboard/suggestions?userId=` | Basic AI suggestions |
| `GET` | `/api/dashboard/enhanced-insights?userId=` | Full AI analysis with patterns + savings |

### 💳 Transaction APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/transactions?userId=` | All transactions for user |
| `GET` | `/api/transactions/recent?userId=` | Last N transactions |
| `POST` | `/api/transactions` | Create a new transaction |

> All monetary values stored as `double` with 2 decimal precision.  
> Upload dates: `MM/dd/yyyy` · API response dates: ISO 8601

---

## 🧱 Tech Stack

### Backend

| Technology | Purpose |
|-----------|---------|
| Java + Spring Boot | API server, business logic |
| MongoDB (Spring Data) | Persistent data storage |
| Apache POI | Excel (`.xlsx` / `.xls`) parsing |
| BufferedReader | CSV parsing |
| REST + MVC | API architecture |

### Frontend

| Technology | Purpose |
|-----------|---------|
| Next.js (React) | Page routing and SSR |
| TypeScript | Type-safe component logic |
| Tailwind CSS | UI styling and responsiveness |
| Recharts | Sales and revenue chart rendering |
| React Hooks | `useState`, `useEffect` — local state |

---

## 📁 Key Files at a Glance

```
backend/
├── payload/
│   ├── MerchantDashboardSummary.java   ← Dashboard metrics DTO
│   ├── SalesChartData.java             ← Monthly chart data DTO
│   ├── RevenueBreakdownData.java       ← Category revenue DTO
│   ├── BulkUploadResponse.java         ← Upload result DTO
│   └── AIInsightsResponse.java         ← Full AI analysis DTO
├── service/
│   ├── MerchantService.java            ← Dashboard + file processing
│   └── DashboardService.java           ← AI insights + pattern engine
└── controller/
    ├── MerchantController.java         ← /api/merchant/**
    └── DashboardController.java        ← /api/dashboard/**

frontend/
├── app/
│   ├── merchant/
│   │   ├── dashboard/page.tsx          ← Live metrics + charts
│   │   ├── transactions/page.tsx       ← Filter + add + export
│   │   └── upload/page.tsx             ← Bulk file import
│   └── dashboard/
│       └── insights/page.tsx           ← AI recommendations
```

---

## 🚀 Getting Started

### Prerequisites

- ✅ Java 17+
- ✅ Node.js 18+
- ✅ MongoDB (local or Atlas)
- ✅ Maven

### Backend

```bash
cd backend
# Configure MongoDB URI in application.properties
./mvnw spring-boot:run
# ✅ API live at http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# ✅ App live at http://localhost:3000
```

> CORS is pre-configured for `localhost:3000` → `localhost:8080`.

---

## 📋 Data Format Reference

### CSV Upload Template

```csv
Date,Description,Amount,Category
01/15/2025,Sale #1234,299.99,Products
01/16/2025,Office Supplies,-45.50,Expenses
01/17/2025,Online Order #5678,149.00,Products
```

### Excel Upload
Same four columns — `Date`, `Description`, `Amount`, `Category` — in `.xlsx` or `.xls`.

> ➕ Positive `Amount` = income · ➖ Negative `Amount` = expense

---

<div align="center">

Built with Java discipline and TypeScript precision.  
**Real data. Real insights. Real decisions.**

</div>
