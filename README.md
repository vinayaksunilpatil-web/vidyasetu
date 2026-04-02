# 🎓 VidyaSetu — Smart Education Donation Intelligence Platform

A full-stack NGO donation platform with real-time OTP authentication, role-based dashboards, simulated payments, AI chatbot, and full transparency tracking.

---

## 📁 Complete Folder Structure

```
VIDHYASETU/
│
├── 📁 backend/
│   ├── 📄 server.js              ← Express server entry point
│   ├── 📄 db.js                  ← MySQL connection pool
│   ├── 📄 package.json
│   ├── 📄 .env                   ← Your credentials (never share!)
│   ├── 📄 .env.example           ← Template
│   │
│   ├── 📁 routes/
│   │   ├── 📄 auth.js            ← Signup, Login, OTP, Logout
│   │   ├── 📄 donation.js        ← Add/view donations
│   │   ├── 📄 expense.js         ← Add/view expenses
│   │   └── 📄 dashboard.js       ← NGO summary data
│   │
│   └── 📁 utils/
│       └── 📄 email.js           ← Nodemailer OTP + receipt emails
│
├── 📁 frontend/
│   ├── 📄 login.html
│   ├── 📄 signup.html
│   ├── 📄 verify_otp.html
│   ├── 📄 donor_dashboard.html
│   ├── 📄 dashboard.html         ← NGO admin dashboard
│   ├── 📄 donate.html
│   ├── 📄 styles.css             ← Global shared styles
│   └── 📄 app.js                 ← Shared utilities + AI chatbot
│
├── 📁 database/
│   └── 📄 schema.sql             ← Run this in MySQL first
│
└── 📄 README.md
```

---

## ⚙️ Setup Instructions

### Step 1 — Run Database Schema
Open MySQL Workbench and run `schema.sql`:
```
File → Open SQL Script → select database/schema.sql → Run (Ctrl+Shift+Enter)
```

Or via terminal:
```bash
mysql -u root < database/schema.sql
```

### Step 2 — Install Dependencies
```bash
cd backend
npm install
npm install node-fetch
```

### Step 3 — Create .env File
Create `backend/.env` and fill in:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vidyasetu

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

SESSION_SECRET=vidyasetu_super_secret_2024

PORT=3000

GEMINI_API_KEY=AIzaSy...your_gemini_key_here
```

### Step 4 — Get Gmail App Password
```
1. Go to → https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App Passwords"
4. Generate for Mail → Other → "VidyaSetu"
5. Copy 16-character code → paste in EMAIL_PASS
```

### Step 5 — Get Free Gemini API Key
```
1. Go to → https://aistudio.google.com
2. Sign in with Google
3. Click Get API Key → Create Key
4. Copy → paste in GEMINI_API_KEY
```

### Step 6 — Start Server
```bash
cd backend
npm run dev
```

### Step 7 — Open in Browser
```
http://localhost:3000
```

---

## 👤 Creating Accounts

Since there are no default accounts, create them via signup:

### Create NGO Account
```
1. Go to → http://localhost:3000/signup
2. Fill in details
3. Select Role → NGO / Admin
4. Click Create Account
5. Login → OTP → NGO Dashboard
```

### Create Donor Account
```
1. Go to → http://localhost:3000/signup
2. Fill in details
3. Select Role → Donor (default)
4. Click Create Account
5. Login → OTP → Donor Dashboard
```

---

## 🚀 Features

### 🔐 Authentication
- Signup with Name, Email, Phone, Password, Role
- Login → 6-digit OTP sent to real Gmail inbox
- OTP expires in 3 minutes
- Auto-redirect to OTP page after login
- Role-based redirect after OTP verification
- Wrong password shows error instantly
- Safety timeout prevents button getting stuck

### 🎁 Donor Features
- Make donations with amount, category, payment method
- 6 categories: Books, Meals, Scholarships, Uniforms, Digital Access, Infrastructure
- 5 payment methods: UPI, Credit Card, Debit Card, Net Banking, Wallet
- Simulated 3-stage payment flow (Initiated → Processing → Success)
- Receipt modal with Receipt ID after payment
- Donation receipt sent to Gmail automatically
- Dashboard auto-updates after donation (no refresh needed)
- Dashboard shows: Total Donated, Donations Count, Impact Score, Last Donation
- Donation history table with date, category, amount, status
- Category-wise contribution breakdown with progress bars
- Impact messages ("Your ₹500 helped 3 students!")
- Smart suggestions for low-fund categories
- Auto refresh every 15 seconds silently

### 🏫 NGO Admin Features
- Total Donations, Total Expenses, Remaining Fund, Donations Count
- Unique donor count (not transaction count)
- Students helped counter
- Trust Index with progress bar and interpretation
- Low fund alerts for categories below ₹5,000
- All Donors tab with search filter
- Add Expense form (name, amount, category, description)
- Expenses table
- Impact Timeline (donations + expenses mixed)
- Monthly donation bar chart
- Category donation breakdown analytics

### 🤖 AI Chatbot (Setu Assistant)
- Powered by Google Gemini API (Free)
- Answers ANY question intelligently
- Understands natural language
- Replies in same language as user (Hindi/English)
- Quick reply buttons for common questions
- Typing indicator while thinking
- Available on Donor Dashboard, NGO Dashboard, Donate page

### 📧 Email System
- OTP email with branded HTML template
- Donation receipt email with impact estimate
- Both sent via Gmail SMTP (nodemailer)

---

## 🗄️ API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Create account |
| POST | `/api/auth/login` | — | Verify credentials |
| POST | `/api/auth/send-otp` | — | Send OTP email |
| POST | `/api/auth/verify-otp` | — | Verify OTP + login |
| POST | `/api/auth/logout` | Session | Destroy session |
| GET | `/api/auth/me` | Session | Get current user |
| POST | `/api/donation/add` | Donor | Record donation |
| GET | `/api/donation/all` | NGO | All donations |
| GET | `/api/donation/mine` | Donor | My donations |
| GET | `/api/donation/my-stats` | Donor | My stats |
| GET | `/api/donation/stats` | NGO | Platform stats |
| POST | `/api/expense/add` | NGO | Add expense |
| GET | `/api/expense/all` | NGO | All expenses |
| GET | `/api/dashboard/ngo-summary` | NGO | Full NGO summary |
| POST | `/api/chat` | — | AI chatbot |

---

## 🛡️ Security Features

- Passwords hashed with bcryptjs (10 salt rounds)
- OTPs stored with expiry, marked used after verification
- Express sessions for authenticated state
- Rate limiting on OTP endpoint (5 per 10 min)
- Role-based route protection middleware
- SQL parameterized queries (no SQL injection)
- API keys stored in .env (never in frontend)

---

## 🎨 UI Design

- **Fonts:** Sora (display) + DM Sans (body)
- **Theme:** Forest Green + Teal
- **Components:** Cards, stat cards, progress bars, badges, tabs, modals
- **Responsive:** Mobile-friendly CSS grid
- **Animations:** Payment modal stages, toast notifications, hover effects

---

## 🔧 Common Issues & Fixes

| Issue | Fix |
|---|---|
| CSS not loading | Check file is named `styles.css` not `style.css` |
| HTML not found | Make sure all files have `.html` extension |
| MySQL error | Check `.env` DB credentials, make sure MySQL is running |
| OTP not received | Check Gmail App Password in `.env`, check spam folder |
| Chatbot not working | Check `GEMINI_API_KEY` in `.env` |
| Dashboard not updating | Check API URLs use `/api/donation/` not `/api/donations/` |
| Button stuck | Wrong password now shows error and resets instantly |
| Server crash | Check all route files end with `module.exports = router;` |

---

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.0",
  "bcryptjs": "^2.4.3",
  "nodemailer": "^6.9.4",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "express-session": "^1.17.3",
  "express-rate-limit": "^7.1.0",
  "node-fetch": "^3.x"
}
```

---

## 🔄 Daily Usage

```bash
# Start server
cd backend
npm run dev

# Stop server
Ctrl + C

# If port busy
# Change PORT=3001 in .env
```

---

## 📝 .env File Template

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vidyasetu

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16char_app_password

SESSION_SECRET=vidyasetu_super_secret_2024

PORT=3000

GEMINI_API_KEY=AIzaSy...your_key
```

---

## ✅ Testing Checklist

```
Signup          → Create Donor + NGO accounts
Login           → Wrong password shows error instantly
OTP             → Comes to Gmail, auto-redirects to OTP page
Verify OTP      → Correct OTP → goes to dashboard
Donor Dashboard → Shows ₹0, 0 donations initially
Donate          → Select amount + category + payment → Donate
Payment Flow    → 3 stages → Success modal → Receipt email
Dashboard Update→ Goes to dashboard instantly after payment
NGO Login       → Login with NGO account
NGO Dashboard   → Shows all donations, expenses, trust index
Add Expense     → Fills expenses table + updates trust index
All Donors Tab  → Shows donor list with search
Timeline Tab    → Shows donations + expenses mixed
Analytics Tab   → Shows monthly chart + category breakdown
Chatbot         → Ask any question → AI replies intelligently
Logout          → Clears session → back to login
```

---

*Built with ❤️ for student education — VidyaSetu 2026*