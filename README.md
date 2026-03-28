# Stock Analyzer App

A 1-pager stock research tool for Indian equities. Scrapes screener.in and displays key metrics in a clean dark UI.

---

## Project Structure

```
stock-analyzer/
├── backend/   → Spring Boot (Java) — scrapes screener.in
└── frontend/  → React — clean dark UI
```

---

## How to Run

### Step 1 — Start the Backend

Open IntelliJ, open the `backend/` folder as a Maven project.

Or run from terminal:
```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on: http://localhost:8080

### Step 2 — Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

## How to Use

1. Open http://localhost:3000
2. Type a company symbol (e.g. `TATASTEEL`, `INFY`, `RELIANCE`, `HDFCBANK`)
3. Click **Analyze →**
4. See the 3 tables instantly

---

## Features

| Feature | Status |
|---|---|
| CMP, PE, Market Cap, Dividend Yield | ✅ |
| Last 3 years Revenue & Profit | ✅ |
| Revenue & Profit Growth % | ✅ |
| Net Profit Margin | ✅ |
| Median PE (1yr, 3yr, 5yr) | ✅ |
| Concall AI Analysis | 🔜 Coming next |

---

## Notes

- Uses NSE symbols (same as screener.in URLs)
- Screener.in must be accessible from your network
- Concall analysis will require Claude API key (next phase)
