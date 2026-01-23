# Stock Ping

**Stock Ping** is a production-ready **Next.js web application** that automatically identifies the most active stocks with positive price movement and delivers them to subscribers via email on a daily basis.

The project is designed as a lightweight stock alerting system, combining real-time market data, serverless APIs, scheduled automation, and email delivery.

---

## Overview

Stock Ping continuously monitors stock market activity using the **Financial Modeling Prep API**.  
Users can subscribe with their email address and receive a **daily curated list of high-activity, positive-growth stocks** directly in their inbox.

The application is fully serverless, requires no traditional database, and relies on Google Sheets for subscriber storage.

---

## Key Features

### 📈 Live Market Data
- Fetches the **most active stocks** in real time
- Filters stocks with **positive daily price change**
- Clean API abstraction for easy data source replacement

### 📬 Email Subscription System
- Simple email-based subscription
- Input validation and duplicate protection
- Subscribers stored securely in Google Sheets

### ⏰ Automated Daily Emails
- Daily stock summary sent at **18:00 UTC**
- Triggered via **GitHub Actions cron jobs**
- Can also be triggered manually for testing


---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **React**: React 19
- **Styling**: Tailwind CSS + `tw-animate-css`
- **UI Components**: Radix UI (Slot-based architecture)

### Backend / APIs
- **Serverless API Routes** (Next.js)
- **Stock Data**: Financial Modeling Prep API
- **Email Delivery**: Nodemailer 
- **Subscriber Storage**: Google Sheets API

### Infrastructure & Automation
- **Hosting**: Vercel
- **Cron Jobs**: GitHub Actions

---

## Architecture & Data Flow

### Subscription Flow
1. User enters email on the homepage
2. `POST /api/subscribe` validates the email
3. Email is stored in Google Sheets
4. Optional confirmation or test email is sent

### Daily Stock Email Flow
1. GitHub Actions triggers a cron job at 18:00 UTC
2. Calls `GET /api/cron/send-daily-stocks`
3. API:
   - Fetches most active stocks
   - Filters for positive growth
   - Generates an HTML email
   - Loads subscribers from Google Sheets
4. Emails are sent via Gmail OAuth2

---

## API Endpoints

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/stocks` | Fetches most active stocks |
| POST | `/api/subscribe` | Registers a new email subscriber |
| GET | `/api/cron/send-daily-stocks` | Sends daily stock emails (secured) |
| GET | `/api/emails` | Lists all subscribed emails |
| POST | `/api/test-mail` | Sends a test email |

> ⚠️ Cron endpoints are protected using a `CRON_SECRET`.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Stock API
STOCK_API_KEY=your_financial_modeling_prep_api_key

# Gmail OAuth2
GMAIL_USER=your_gmail_address
GMAIL_CLIENT_ID=your_google_client_id
GMAIL_CLIENT_SECRET=your_google_client_secret
GMAIL_REFRESH_TOKEN=your_google_refresh_token

# Google Sheets
GOOGLE_SHEETS_ID=your_google_sheets_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service_account_email
GOOGLE_PRIVATE_KEY=service_account_private_key

# Cron Job Security
CRON_SECRET=your_secret_cron_key
