# 🚀 Setup Guide - Personal Finance Manager

## Quick Start (5 minutes)

### Step 1: Extract the ZIP file
Extract the downloaded ZIP file to your desired location.

### Step 2: Install Dependencies
Open terminal/command prompt in the project folder and run:
```bash
npm install
```

This will install all required packages (Next.js, React, MongoDB driver, Chart.js, etc.)

### Step 3: Configure Database

#### Option A: Local MongoDB (Recommended for Development)
1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Copy `.env.local.example` to `.env.local`
4. The default configuration will work:
   ```
   MONGODB_URI=mongodb://localhost:27017/finance-app
   ```

#### Option B: MongoDB Atlas (Cloud - Free Tier Available)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Create `.env.local` file with:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/finance-app?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials

### Step 4: Run the Application
```bash
npm run dev
```

### Step 5: Open in Browser
Navigate to: http://localhost:3000

You'll be automatically redirected to the dashboard!

---

## 📱 First Time Usage

1. **Add Your First Transaction**
   - Click on the "Dashboard" tab
   - Fill in the form at the bottom
   - Select type (Income/Expense/Credit)
   - Click "Add Transaction"

2. **Explore the Features**
   - **Dashboard**: View summary cards and charts
   - **Analytics**: See 6-month trends
   - **Transactions**: Manage all your transactions

3. **Filter & Search**
   - Go to "Transactions" tab
   - Use filters to find specific transactions
   - Export to CSV for backup

---

## 🔧 Troubleshooting

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

### MongoDB Connection Error
- **Local**: Make sure MongoDB service is running
- **Atlas**: Check your connection string and network access settings

### Chart Not Displaying
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Clear Browser Cache
- Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

---

## 📊 Database Structure

The app automatically creates the database and collections. No manual setup needed!

**Collections:**
- `transactions` - Stores all your financial transactions

**Indexes:** Created automatically for better performance

---

## 🎯 Production Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Visit https://vercel.com
3. Import your repository
4. Add environment variable: `MONGODB_URI`
5. Deploy!

### Deploy to Other Platforms
- **Netlify**: Similar to Vercel
- **Railway**: Great for full-stack apps
- **Render**: Free tier available

---

## 📦 Scripts Available

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check code quality
```

---

## 🔐 Security Notes

1. **Never commit .env.local** - It's in .gitignore
2. **Use strong MongoDB credentials** for production
3. **Enable IP whitelist** on MongoDB Atlas
4. **Use environment variables** for all secrets

---

## 📞 Need Help?

- Check the main README.md for detailed feature documentation
- MongoDB docs: https://docs.mongodb.com
- Next.js docs: https://nextjs.org/docs

---

## ✅ Checklist

- [ ] Node.js installed (v18 or higher)
- [ ] MongoDB running (local or Atlas)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] App running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Added first transaction successfully

---

**Happy Finance Tracking! 💰📊**
