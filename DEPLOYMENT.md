# 🚀 Deployment Guide - EduPath OS

## Deploying to Vercel (Free & Easy)

This guide walks you through deploying **EduPath OS** to Vercel, making it accessible to the world! 🌍

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- GitHub account (with this repository)
- Vercel account (free signup at vercel.com)
- Your `.env` variables ready

### Step 1: Sign Up for Vercel
1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. You're in! ✅

### Step 2: Import Your Repository
1. Click **"New Project"** button
2. Search for **"educate-os"** repository
3. Select it and click **"Import"**
4. Vercel will auto-detect Next.js ✅

### Step 3: Configure Environment Variables
1. In the **"Environment Variables"** section, add:

```
JWT_SECRET = your-super-secret-key-change-this-in-production
ADMIN_EMAIL = admin@edupath.local
ADMIN_PASSWORD = admin123
NEXT_PUBLIC_API_URL = https://educate-os.vercel.app
```

**Note**: Replace the URL with your actual Vercel domain once it's generated.

### Step 4: Deploy! 🚀
1. Click **"Deploy"** button
2. Wait 2-3 minutes
3. ✅ Your app is LIVE!
4. Click **"Visit"** to see your deployed site

---

## 🔗 Your Live URL

After deployment, you'll get a URL like:
```
https://educate-os.vercel.app
```

**Share this link with anyone!** They can:
- ✅ Create an account
- ✅ Log in
- ✅ Use Code Lab
- ✅ View dashboard
- ✅ Access admin panel (with admin credentials)

---

## 🔄 How Updates Work

Once deployed, every time you push to GitHub:
1. Vercel automatically detects the change
2. Vercel rebuilds your app
3. Your live site updates (in 1-2 minutes)

**No manual steps needed!** It's automatic! 🤖

### Update Workflow:
```bash
git add .
git commit -m "your changes"
git push origin main
# → Vercel auto-deploys automatically!
```

---

## 🎯 Testing Your Deployment

After deployment completes:

1. **Test Landing Page**
   - Visit: `https://educate-os.vercel.app/`
   - Should see hero section and features

2. **Test Authentication**
   - Go to: `/register`
   - Create a new account
   - Verify email validation works

3. **Test Login**
   - Go to: `/login`
   - Use demo credentials:
     - **Email**: `student@edupath.os`
     - **Password**: `student123`
   - Should redirect to dashboard

4. **Test Admin Panel**
   - Go to: `/login`
   - Use admin credentials:
     - **Email**: `admin@edupath.local`
     - **Password**: `admin123`
   - Should redirect to `/admin`
   - Should see user management & submissions

5. **Test Code Lab**
   - Navigate to: `/codelab`
   - Try writing and running Python/C# code
   - Verify output appears

---

## 💾 Database on Vercel

Your app uses **SQLite** (local file-based database).

### Current Setup
- Database is created automatically on first deploy
- Data persists across redeployments
- Admin account auto-seeded from env variables

### For Production (Optional)
If you want to scale or need true cloud database:
- Upgrade to **PostgreSQL** (Vercel has free tier)
- Modify `src/lib/db/init.ts` to use PostgreSQL
- Update connection string in Vercel environment

---

## 🔐 Environment Variables Explained

### Required Variables:

**JWT_SECRET**
- Used to sign authentication tokens
- Should be a long random string in production
- Change from default!
- Example: `your-very-long-random-secret-key-min-32-chars`

**ADMIN_EMAIL**
- Email for admin account created on first run
- Default: `admin@edupath.local`
- Can be any email format

**ADMIN_PASSWORD**
- Password for admin account
- Default: `admin123`
- Change in production!

**NEXT_PUBLIC_API_URL**
- Your Vercel domain
- Example: `https://educate-os.vercel.app`
- Used for frontend API calls

---

## 🌐 Custom Domain (Later)

When you're ready to buy a custom domain:

### Step 1: Buy Domain
Purchase from:
- Namecheap (~$8/year)
- GoDaddy (~$12/year)
- Google Domains (~$12/year)

### Step 2: Connect to Vercel
1. In Vercel project settings → **"Domains"**
2. Enter your domain (e.g., `educate-os.com`)
3. Vercel shows DNS records
4. Update DNS at your domain provider
5. Wait 5-10 minutes for propagation
6. ✅ Your domain is live!

**Your app code doesn't change!** Only the URL changes.

---

## 🐛 Troubleshooting

### Deployment Fails
- Check build logs in Vercel dashboard
- Ensure all required env variables are set
- Verify Node.js version is 18+

### App Shows 404
- Give Vercel 2-3 minutes to fully deploy
- Clear browser cache (Ctrl+Shift+Delete)
- Check that environment variables are saved

### Database Issues
- First deployment creates database automatically
- If errors persist, check `src/lib/db/seed.ts`
- Verify `.env.local` has correct values

### Authentication Not Working
- Ensure `JWT_SECRET` is set in Vercel
- Check that admin account seeded correctly
- Verify cookies are enabled in browser

---

## 📊 Monitoring Your Deployment

In Vercel Dashboard:
- **Deployments** tab - see all deploy history
- **Analytics** tab - view traffic and performance
- **Logs** tab - check for errors
- **Settings** tab - manage env variables

---

## 🎉 You're Live!

Congratulations! Your EduPath OS is now publicly accessible! 🚀

**Next Steps:**
1. Share your link: `https://educate-os.vercel.app`
2. Get feedback from friends/colleagues
3. Improve based on feedback
4. When ready, buy a domain
5. Connect domain to Vercel
6. Launch publicly with your brand! 🎓

---

## 📚 Additional Resources

- [Vercel Next.js Deployment Docs](https://vercel.com/docs/frameworks/nextjs)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Environment Variables on Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Happy deploying!** 🚀✨

Need help? Check the troubleshooting section or review the main [README.md](./README.md).
