# 🚀 QUICK START - Personal Finance Manager

## Installation (3 Steps)

### 1️⃣ Extract & Install
```bash
# Extract the ZIP file
# Open terminal in the extracted folder

npm install
```

### 2️⃣ Setup Database
```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local with your MongoDB connection
# For local MongoDB: mongodb://localhost:27017/finance-app
# For MongoDB Atlas: Get connection string from cloud.mongodb.com
```

### 3️⃣ Run Application
```bash
npm run dev
```

**Open Browser:** http://localhost:3000

---

## ✨ What's Included

✅ Complete Next.js 14 application
✅ MongoDB integration with Mongoose
✅ Advanced dashboard with 3 views
✅ Real-time charts (Bar, Pie, Line)
✅ Category management
✅ Payment method tracking
✅ Tags system
✅ Recurring transactions
✅ Export to CSV
✅ Responsive design
✅ Complete documentation

---

## 📁 Project Structure

```
Personal-Finance-NextJS-MongoDB/
├── app/
│   ├── dashboard/page.js          # Main dashboard
│   ├── api/transactions/route.js  # API endpoints
│   └── layout.js                  # App layout
├── models/Transaction.js          # MongoDB schema
├── lib/
│   ├── db.js                      # Database connection
│   └── utils.js                   # Utility functions
├── package.json                   # Dependencies
├── .env.local.example            # Environment template
└── README.md                      # Full documentation
```

---

## 🎯 Features Overview

### Dashboard View
- Summary cards (Income, Expense, Credit, Balance)
- Quick add transaction form
- Visual charts

### Analytics View  
- 6-month income/expense trends
- Top spending categories
- Statistics (average expense, savings rate)

### Transactions View
- Complete transaction list
- Advanced filters (month, type, category, search)
- Export to CSV
- Edit/Delete actions

---

## 💡 First Steps After Setup

1. **Add Income**: Click Dashboard → Select "Income" → Enter amount → Add
2. **Add Expense**: Select "Expense" → Choose category → Add description
3. **View Analytics**: Switch to Analytics tab to see trends
4. **Filter Data**: Go to Transactions → Use filters to organize

---

## 🔗 Useful Links

- **MongoDB Atlas (Free)**: https://www.mongodb.com/cloud/atlas
- **Next.js Docs**: https://nextjs.org/docs
- **Deployment (Vercel)**: https://vercel.com

---

## 📞 Support

For detailed setup instructions, see **SETUP_GUIDE.md**
For features documentation, see **README.md**

---

**Made with ❤️ using Next.js + MongoDB**
