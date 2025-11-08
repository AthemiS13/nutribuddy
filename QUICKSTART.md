# Quick Start Guide - NutriBuddy

Get your calorie tracker running in 5 minutes! 🚀

## Step 1: Get Your API Keys (5 minutes)

### Firebase Setup
1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "NutriBuddy" → Continue
3. Disable Google Analytics (optional) → Create project
4. **Enable Authentication**:
   - Click "Authentication" → "Get started"
   - Click "Email/Password" → Enable → Save
5. **Create Database**:
   - Click "Firestore Database" → "Create database"
   - Start in **production mode** → Choose location → Enable
6. **Get Config**:
   - Click gear icon ⚙️ → "Project settings"
   - Scroll to "Your apps" → Click web icon `</>`
   - Register app: name it "nutribuddy" → Register app
   - Copy the `firebaseConfig` values

### USDA API Key
1. Go to https://fdc.nal.usda.gov/api-key-signup.html
2. Fill form with your email
3. Check email for API key

## Step 2: Configure Environment (1 minute)

1. Open the project folder in your terminal
2. Copy the example file:
   ```bash
   cd nutribuddy
   cp .env.example .env.local
   ```
3. Edit `.env.local` with your keys:
   ```bash
   # Use your text editor or:
   nano .env.local
   # or
   code .env.local
   ```
4. Paste your Firebase and USDA values

## Step 3: Install & Run (2 minutes)

```bash
# Install dependencies (only needed once)
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

## Step 4: Add Firestore Security Rules (1 minute)

1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab
3. Replace everything with:
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
4. Click "Publish"

## Step 5: Test the App (2 minutes)

1. **Sign Up**: Create account at http://localhost:3000
2. **Set Profile**: Enter weight (70) and calorie goal (2000)
3. **Create Recipe**:
   - Go to "My Recipes" → "New Recipe"
   - Search "chicken breast"
   - Click to add, enter "200" grams
   - Name it "Grilled Chicken"
   - Save
4. **Log Meal**:
   - Go to "Log Meal"
   - Select your recipe
   - Enter amount (150g)
   - Submit
5. **View Dashboard**: See your stats and charts!

## 🎉 You're Done!

Your app is running locally. To deploy to the internet:
- Follow `DEPLOYMENT.md` for Cloudflare Pages setup

## Quick Tips

- **Development**: Run `npm run dev` to start
- **Stop Server**: Press `Ctrl+C` in terminal
- **Build for Production**: Run `npm run build`
- **Check Errors**: Look at terminal and browser console

## Common First-Time Issues

❌ **"Module not found"** → Run `npm install`
❌ **Firebase errors** → Check `.env.local` has correct values
❌ **Port 3000 in use** → Stop other apps or use different port: `npm run dev -- -p 3001`
❌ **USDA search fails** → Verify USDA API key is correct

## File Structure Quick Reference

```
nutribuddy/
├── .env.local              ← Your secrets HERE
├── app/
│   └── page.tsx           ← Main app
├── components/            ← UI components
├── lib/                   ← Business logic
└── contexts/              ← React state
```

## Need Help?

1. Check `PROJECT_SUMMARY.md` for architecture details
2. Check `DEPLOYMENT.md` for deployment help
3. Check `README.md` for full documentation
4. Check Firebase Console for errors
5. Check browser console (F12) for errors

---

**Next Step**: Once everything works locally, deploy to Cloudflare Pages using `DEPLOYMENT.md`! 🚀
