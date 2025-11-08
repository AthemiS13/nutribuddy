# Deployment Guide for NutriBuddy

This guide will help you deploy NutriBuddy to Cloudflare Pages.

## Prerequisites Checklist

Before deploying, ensure you have:

- [x] Firebase project created
- [x] Firebase Authentication enabled (Email/Password)
- [x] Firestore database created
- [x] USDA API key obtained
- [x] GitHub account
- [x] Cloudflare account

## Step 1: Set Up Firebase

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Enable "Email/Password" provider

3. **Create Firestore Database**
   - Go to "Firestore Database"
   - Click "Create database"
   - Start in **production mode**
   - Choose a location closest to your users

4. **Add Security Rules**
   - In Firestore, go to "Rules" tab
   - Replace with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         
         match /recipes/{recipeId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
         
         match /meals/{mealId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
   }
   ```
   - Click "Publish"

5. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Under "Your apps", click the web icon (</>)
   - Register your app
   - Copy the config values (apiKey, authDomain, etc.)

## Step 2: Get USDA API Key

1. Visit https://fdc.nal.usda.gov/api-key-signup.html
2. Fill out the form
3. Check your email for the API key

## Step 3: Configure Environment Variables Locally

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_USDA_API_KEY=your_usda_api_key
   ```

3. Test locally:
   ```bash
   npm run dev
   ```
   - Open http://localhost:3000
   - Test signup, login, recipe creation, and meal logging

## Step 4: Push to GitHub

1. **Initialize Git (if not already done)**:
   ```bash
   cd nutribuddy
   git init
   git add .
   git commit -m "Initial commit: NutriBuddy calorie tracker"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (public or private)
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/nutribuddy.git
   git branch -M main
   git push -u origin main
   ```

## Step 5: Deploy to Cloudflare Pages

### Option A: Using Cloudflare Dashboard (Recommended)

1. **Login to Cloudflare**:
   - Go to https://dash.cloudflare.com/
   - Navigate to "Workers & Pages"

2. **Create New Application**:
   - Click "Create Application"
   - Choose "Pages"
   - Click "Connect to Git"

3. **Connect GitHub Repository**:
   - Authorize Cloudflare to access your GitHub
   - Select your `nutribuddy` repository
   - Click "Begin setup"

4. **Configure Build Settings**:
   - **Project name**: nutribuddy (or your choice)
   - **Production branch**: main
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `out`

5. **Add Environment Variables**:
   Click "Add variable" for each:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   NEXT_PUBLIC_USDA_API_KEY
   ```
   
   **Important**: Use the same values from your `.env.local` file

6. **Deploy**:
   - Click "Save and Deploy"
   - Wait for the build to complete (2-5 minutes)
   - You'll get a URL like: `https://nutribuddy.pages.dev`

### Option B: Using Wrangler CLI

1. **Install Wrangler**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   ```bash
   wrangler pages publish out --project-name=nutribuddy
   ```

5. **Set Environment Variables**:
   - Go to Cloudflare Dashboard > Your Project > Settings
   - Add all environment variables manually

## Step 6: Configure Firebase for Production

1. **Add Authorized Domains**:
   - In Firebase Console, go to Authentication > Settings > Authorized domains
   - Add your Cloudflare Pages domain:
     - `nutribuddy.pages.dev`
     - Any custom domain you'll use

2. **Update CORS Settings (if needed)**:
   - Usually not required for client-side Firebase SDK

## Step 7: Test Production Deployment

1. Visit your deployed URL
2. Test all features:
   - ✅ Sign up with new account
   - ✅ Set up profile
   - ✅ Search for ingredients
   - ✅ Create a recipe
   - ✅ Log a meal
   - ✅ View dashboard and charts

## Continuous Deployment

Once set up, any push to your `main` branch will automatically trigger a new deployment on Cloudflare Pages.

To deploy changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Custom Domain (Optional)

1. In Cloudflare Pages, go to your project
2. Click "Custom domains"
3. Add your domain
4. Update your DNS records as instructed
5. Add the custom domain to Firebase Authorized domains

## Monitoring and Logs

- **Build Logs**: Cloudflare Dashboard > Your Project > Deployments
- **Analytics**: Cloudflare Dashboard > Your Project > Analytics
- **Firebase Usage**: Firebase Console > Usage tab

## Troubleshooting

### Build Fails

- Check environment variables are set correctly
- Verify Node.js version compatibility
- Check build logs for specific errors

### Authentication Not Working

- Verify Firebase authorized domains include your Cloudflare URL
- Check Firebase API key and config in environment variables
- Check browser console for errors

### API Rate Limits

- USDA API has no official rate limits with API key
- Firebase free tier limits: Check Firebase Console for usage
- Implement caching if hitting limits

## Cost Estimate (Free Tier)

- **Cloudflare Pages**: FREE (unlimited bandwidth)
- **Firebase**: FREE (up to limits)
- **USDA API**: FREE (unlimited)

**Total Monthly Cost**: $0 for typical personal use

## Support

For issues:
1. Check Firebase Console for errors
2. Check Cloudflare build logs
3. Verify all environment variables
4. Check browser console for client errors

## Security Reminders

- ✅ Never commit `.env.local` to Git
- ✅ Use Firestore security rules
- ✅ API keys are exposed in client (this is normal for client-side Firebase)
- ✅ Rotate API keys if compromised
- ✅ Monitor Firebase usage for abuse

---

**Congratulations!** Your NutriBuddy app is now live! 🎉
