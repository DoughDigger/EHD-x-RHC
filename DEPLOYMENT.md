# Deployment Guide - EHD x RHC 2026

This guide covers deploying both the frontend and backend of the EHD x RHC 2026 registration application.

## Architecture Overview

- **Frontend**: React + Vite application (deployed to Vercel, Netlify, or similar)
- **Backend**: Node.js/Express API server (requires persistent hosting)

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Accounts on hosting platforms (Vercel for frontend, Railway/Render for backend)

---

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)

2. **Deploy from GitHub**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the Node.js project

3. **Configure Root Directory**:
   - Go to Settings → Change root directory to `/server`

4. **Set Environment Variables**:
   ```
   PORT=3001
   ADMIN_USERNAME=EHDAdmin
   ADMIN_PASSWORD=YourSecurePassword123!
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,https://www.yourdomain.com
   ```

5. **Deploy**: Railway will automatically deploy your backend

6. **Get Backend URL**: Copy the generated URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set root directory to `server`

3. **Configure Build Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables** (same as Railway above)

5. **Deploy**: Render will build and deploy your backend

### Option 3: Heroku

1. **Create Heroku Account** and install Heroku CLI

2. **Deploy Backend**:
   ```bash
   cd server
   heroku create your-app-name
   git subtree push --prefix server heroku main
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set ADMIN_USERNAME=EHDAdmin
   heroku config:set ADMIN_PASSWORD=YourSecurePassword123!
   heroku config:set ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```

---

## Frontend Deployment

### Vercel (Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Import your GitHub repository
   - Vercel will auto-detect the Vite configuration

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app`
   - Important: Add this for all environments (Production, Preview, Development)

4. **Deploy**: Vercel will build and deploy automatically

5. **Update CORS**:
   - Copy your frontend URL (e.g., `https://ehd-x-rhc.vercel.app`)
   - Update your backend's `ALLOWED_ORIGINS` environment variable

### Alternative: Netlify

1. **Deploy via Netlify Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder OR connect GitHub

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**:
   - Site Settings → Environment variables
   - Add: `VITE_API_URL` = Your backend URL

---

## Local Development Setup

### Frontend

1. **Clone Repository**:
   ```bash
   git clone <your-repo-url>
   cd EHD-x-RHC
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment File**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

### Backend

1. **Navigate to Server Directory**:
   ```bash
   cd server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment File**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```
   PORT=3001
   ADMIN_USERNAME=EHDAdmin
   ADMIN_PASSWORD=Toms2026!
   ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Run Server**:
   ```bash
   npm start
   ```
   Backend will be available at `http://localhost:3001`

---

## Environment Variables Reference

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.railway.app` |

### Backend (server/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (optional) | `3001` |
| `ADMIN_USERNAME` | Admin login username | `EHDAdmin` |
| `ADMIN_PASSWORD` | Admin login password | `YourSecurePassword123!` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `https://your-app.vercel.app,https://yourdomain.com` |

---

## Testing Deployment

1. **Test Frontend**:
   - Visit your deployed URL
   - Navigate through all sections
   - Verify images load correctly
   - Test registration form submission

2. **Test Admin Login**:
   - Scroll to footer and click "Admin"
   - Login with your admin credentials
   - Verify dashboard loads with registrations and questions
   - Test export functionality
   - Test delete functionality

3. **Test CORS**:
   - Open browser console (F12)
   - Submit a registration
   - Ensure no CORS errors appear

---

## Troubleshooting

### CORS Errors

**Problem**: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solution**:
- Verify `ALLOWED_ORIGINS` in backend includes your frontend URL
- Check for typos (http vs https, trailing slashes)
- Redeploy backend after updating environment variables

### Admin Login Not Working

**Problem**: "Connection refused" or "Invalid credentials"

**Solution**:
- Verify `VITE_API_URL` in frontend points to correct backend URL
- Check backend is running and accessible
- Verify admin credentials in backend environment variables

### Images Not Loading

**Problem**: Images show broken links

**Solution**:
- All images should be in `/public` folder (already configured)
- Verify build includes public folder
- Check browser console for 404 errors

### Backend Not Persisting Data

**Problem**: Data lost after backend restart

**Solution**:
- Current backend uses JSON files (persists on Railway/Render)
- For Vercel backend, you'd need to switch to a database (not recommended)
- Ensure backend is deployed to Railway/Render/Heroku (not Vercel)

---

## Security Recommendations

1. **Change Default Credentials**: Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` to secure values

2. **Use Strong Passwords**: Minimum 12 characters, mix of letters, numbers, symbols

3. **Enable HTTPS**: Both Railway and Vercel provide free SSL certificates

4. **Restrict CORS**: Only include your actual frontend domain(s) in `ALLOWED_ORIGINS`

5. **Future Improvements**:
   - Implement database (PostgreSQL, MongoDB)
   - Add password hashing (bcrypt)
   - Implement JWT tokens with expiration
   - Add rate limiting

---

## Custom Domain Setup

### Vercel (Frontend)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

### Railway (Backend)

1. Go to Settings → Domains
2. Add custom domain
3. Update DNS CNAME record to point to Railway

### Update Environment Variables

After setting up custom domains, update:
- Frontend: `VITE_API_URL` to use your backend custom domain
- Backend: `ALLOWED_ORIGINS` to include your frontend custom domain

---

## Support

For issues or questions:
- Check the browser console for error messages
- Verify all environment variables are set correctly
- Ensure backend is deployed to a persistent hosting service (not Vercel)
