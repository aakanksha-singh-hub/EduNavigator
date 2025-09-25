# 🎯 Quick Deploy to Render

## 🚀 One-Click Deployment

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/aakanksha-singh-hub/VirtuHack-genai)

## ⚡ Manual Steps:

1. **Get Gemini API Key**: 
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create and copy your API key

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

3. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repo
   - Set `GEMINI_API_KEY` environment variable

4. **Done!** 🎉 Your EduNavigator will be live in ~5 minutes

## 📖 Full Guide:
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.