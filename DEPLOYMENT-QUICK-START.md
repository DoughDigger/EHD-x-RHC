# Quick Deployment Guide

## ⚠️ Important: Backend CANNOT Run on Vercel

Your backend uses file storage (JSON files), which **does not work** with Vercel's serverless platform. You need **two separate deployments**:

1. **Frontend** → Vercel
2. **Backend** → Railway (or Render/Heroku)

---

## Step-by-Step Deployment

### Part 1: Deploy Backend to Railway (5 minutes)

1. **Sign up for Railway**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `EHD-x-RHC` repository

3. **Configure Backend**
   - Click on the service that was created
   - Go to "Settings" → "Service Settings"
   - Set **Root Directory** to: `server`

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Click "New Variable" and add each:
     ```
     ADMIN_USERNAME=EHDAdmin
     ADMIN_PASSWORD=YourSecurePassword123!
     ```
   - **Don't set ALLOWED_ORIGINS yet** - we'll get the Vercel URL first

5. **Get Your Backend URL**
   - Go to "Settings" → "Networking"
   - Copy the "Public Networking" URL (e.g., `https://your-app.up.railway.app`)
   - **Save this URL** - you'll need it for Vercel

---

### Part 2: Deploy Frontend to Vercel (5 minutes)

1. **Sign up for Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Import your `EHD-x-RHC` repository
   - Vercel will auto-detect the Vite configuration

3. **Add Environment Variable** ⚠️ CRITICAL STEP
   - Before deploying, click "Environment Variables"
   - Add:
     - **Name**: `VITE_API_URL`
     - **Value**: Your Railway URL from Part 1 (e.g., `https://your-app.up.railway.app`)
   - Make sure to add it for "Production", "Preview", and "Development"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2 minutes)
   - Copy your Vercel URL (e.g., `https://ehd-x-rhc.vercel.app`)

---

### Part 3: Update Backend CORS (2 minutes)

1. **Go back to Railway**
   - Open your backend project
   - Go to "Variables" tab

2. **Add ALLOWED_ORIGINS**
   - Click "New Variable"
   - **Name**: `ALLOWED_ORIGINS`
   - **Value**: Your Vercel URL (e.g., `https://ehd-x-rhc.vercel.app`)
   - If you have multiple domains, separate with commas

3. **Redeploy**
   - Railway will automatically redeploy with new variables

---

## Testing Your Production Deployment

1. **Visit Your Vercel URL**
   - Open `https://your-app.vercel.app`
   - Verify the site loads

2. **Test Registration Form**
   - Fill out and submit a registration
   - Check for CORS errors in browser console (F12)

3. **Test Admin Login**
   - Scroll to footer, click "Admin"
   - Login with your credentials
   - Verify you can see registrations

---

## Troubleshooting

### "Connection refused" Error
- ✅ Check `VITE_API_URL` in Vercel matches your Railway URL
- ✅ Ensure Railway backend is running (check Railway dashboard)

### CORS Error
- ✅ Check `ALLOWED_ORIGINS` in Railway matches your Vercel URL exactly
- ✅ No trailing slash in URLs
- ✅ Check http vs https

### Admin Login "Invalid credentials"
- ✅ Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in Railway

---

## After Deployment

### Update Credentials
Change the default credentials for security:
1. Go to Railway → Variables
2. Update `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. Railway will auto-redeploy

### Monitor Your App
- **Railway Dashboard**: Check backend logs and health
- **Vercel Dashboard**: Check frontend deployments and analytics

---

## Cost

Both services have free tiers:
- **Railway**: $5 free credit/month (plenty for your app)
- **Vercel**: Free for hobby projects

---

## Need Help?

If you run into issues:
1. Check Railway logs for backend errors
2. Check Vercel build logs for frontend errors  
3. Check browser console (F12) for client-side errors
