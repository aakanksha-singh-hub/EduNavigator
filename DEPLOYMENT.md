# 🚀 EduNavigator Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available)
- Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - EduNavigator project ready for deployment"
```

2. Create a new GitHub repository and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/edunavigator.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Render

### Option A: Blueprint Deployment (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" > "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Set environment variables:
   - `GEMINI_API_KEY`: Your actual Gemini API key
   - `FRONTEND_URL`: Will be auto-set by Render

### Option B: Manual Deployment
If you prefer to deploy services individually:

#### Deploy Backend First:
1. Go to Render Dashboard
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `edunavigator-backend`
   - **Root Directory**: `learning-server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add environment variables:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: Your actual Gemini API key
   - `FRONTEND_URL`: (will be set after frontend deployment)

#### Deploy Frontend:
1. Click "New" > "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `edunavigator-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes
4. Add environment variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://edunavigator-backend.onrender.com`)
   - `VITE_APP_TITLE`: `EduNavigator`
   - `VITE_APP_DESCRIPTION`: `AI-Powered Career & Skills Mentor`

## Step 3: Configure Environment Variables

### Required Environment Variables

**Backend (.env in learning-server/):**
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `NODE_ENV`: Set to `production` on Render
- `FRONTEND_URL`: Your frontend URL (set after deployment)

**Frontend:**
- `VITE_API_URL`: Your backend URL
- `VITE_APP_TITLE`: EduNavigator
- `VITE_APP_DESCRIPTION`: AI-Powered Career & Skills Mentor

## Step 4: Update CORS After Deployment

After both services are deployed, update the backend environment variable:
- `FRONTEND_URL`: Set to your actual frontend URL (e.g., `https://edunavigator-frontend.onrender.com`)

## 🔧 Troubleshooting

### Common Issues:
1. **Build Failures**: Check build logs in Render dashboard
2. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in backend
3. **API Errors**: Verify `GEMINI_API_KEY` is set and valid
4. **404 Errors**: Ensure frontend routing is configured for SPA

### Health Checks:
- Backend: `https://your-backend-url.onrender.com/health`
- Frontend: `https://your-frontend-url.onrender.com`

## 🎉 Success!
Once deployed, your EduNavigator will be live at:
- **Frontend**: `https://edunavigator-frontend.onrender.com`
- **Backend**: `https://edunavigator-backend.onrender.com`

## 📝 Notes:
- Free tier services may sleep after 15 minutes of inactivity
- First load might be slow as services wake up
- Upgrade to paid plans for production use with no sleep

## 🔐 Security:
- Never commit `.env` files with actual API keys
- Use Render's environment variables for secrets
- Keep your Gemini API key private