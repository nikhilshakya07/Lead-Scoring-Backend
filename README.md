# 🚀 Lead Scoring Backend — Hiring Assignment

A backend service that scores and qualifies leads using **rule-based logic + AI reasoning**, built as part of a backend engineer hiring assignment.

---

## 🧠 Overview

This service accepts:
- **Product/Offer details** (via JSON)
- **Leads list** (via CSV upload)

Then:
- Applies **rule-based scoring** (up to 50 points)
- Uses **AI reasoning** (OpenAI via OpenRouter) for additional scoring (up to 50 points)
- Returns a **final score (0–100)** and an **intent label (High / Medium / Low)** for each lead.

---

## ⚙️ Tech Stack

- **Node.js + Express**
- **Multer** — for file uploads  
- **CSV-Parser** — for CSV reading  
- **Axios** — for calling AI API  
- **dotenv** — for environment variables  
- **CORS** — for cross-origin access  
- **OpenRouter (OpenAI GPT-OSS-20B:FREE)** — for AI intent classification

---

## 📁 Folder Structure

```
lead-scoring-backend/
│
├── src/
│ ├── config/
│ │ └── ai.config.js # AI API configuration
│ ├── controllers/
│ │ ├── offer.controller.js # Handle offer endpoints
│ │ ├── leads.controller.js # Handle leads endpoints
│ │ └── score.controller.js # Handle scoring endpoints
│ ├── services/
│ │ ├── scoring.service.js # Rule-based scoring logic
│ │ ├── ai.service.js # AI integration (OpenRouter/OpenAI)
│ │ └── csv.service.js # CSV parsing logic
│ ├── utils/
│ │ ├── storage.js # In-memory data storage
│ │ └── validator.js # Input validation
│ ├── routes/
│ │ └── index.js # All API routes
│ └── app.js # Express app setup
│
├── uploads/ # Temporary CSV uploads
├── .env # Environment variables (API keys)
├── .env.example # Example env file
├── .gitignore # Git ignore file
├── package.json # Dependencies
├── server.js # Entry point
└── README.md # Documentation
```

---

## ⚡ API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/offer` | Submit product/offer details |
| `POST` | `/leads/upload` | Upload CSV file of leads |
| `POST` | `/score` | Run rule-based + AI scoring |
| `GET` | `/results` | Get JSON results |
| `GET` | `/results/csv` | Export results as CSV |

---

## 📤 Example Requests (Postman / cURL)

### 1️⃣ POST `/offer`
**Body (JSON):**
```json
{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"]
}

```

### 2️⃣ POST `/leads/upload`
**Body (Form-Data)**

file: attach leads.csv

**📄 CSV Format:**

```csv
name,role,company,industry,location,linkedin_bio
Ava Patel,Head of Growth,FlowMetrics,SaaS,India,"Driving B2B growth through automation"
```

### 3️⃣ POST `/score`

```
Triggers scoring pipeline for uploaded leads.
```

### 4️⃣ GET `/results`

**Returns JSON array:**

```
[
  {
    "name": "Ava Patel",
    "role": "Head of Growth",
    "company": "FlowMetrics",
    "intent": "High",
    "score": 85,
    "reasoning": "Fits ICP SaaS mid-market and role is decision maker."
  }
]

```

### 5️⃣ GET `/results/csv`

```
Exports the same results as a downloadable CSV file.
```

## 🧮 Scoring Logic

| Rule                  | Condition                              | Points |
| --------------------- | -------------------------------------- | ------ |
| **Role Relevance**    | Decision Maker → +20, Influencer → +10 | 0–20   |
| **Industry Match**    | Exact ICP → +20, Adjacent → +10        | 0–20   |
| **Data Completeness** | All fields present                     | +10    |


### AI Layer (Max 50 Points)

```
Given the following offer and lead data, classify the buying intent as High, Medium, or Low and explain in 1–2 sentences.

```
Mapping:

High → 50 pts

Medium → 30 pts

Low → 10 pts

**Final Score = rule_score + ai_points**

## 🔧 Environment Variables

**Create a .env file in the root:**

```env
PORT=5000
AI_API_KEY=your_openrouter_api_key
AI_MODEL=openai/gpt-oss-20b:free

```
Refer to .env.example for format.

## 🧰 Setup & Run Locally

```
git clone https://github.com/nikhilshakya07/lead-scoring-backend.git
cd lead-scoring-backend
npm install
npm run dev

```

Server will start at http://localhost:5000

## 🚀 Deployment

The backend is deployed on Render
🔗 Live API Base URL: <https://lead-scoring-backend-ilhm.onrender.com/>

## Developed By

**Nikhil Shakya**

**GitHub**: https://github.com/nikhilshakya07

**LinkedIn**: https://www.linkedin.com/in/nikhil-shakya07/
