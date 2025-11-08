# Firebase Setup Guide

## Initial Firestore Database Setup

The "client is offline" error occurs because Firestore hasn't been initialized in your Firebase project yet. Follow these steps:

### 1. Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/project/nutribuddy-3922b/firestore)
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (we'll update security rules after)
4. Select your preferred region (e.g., `us-central1` or closest to you)
5. Click **"Enable"**

### 2. Set Up Firestore Security Rules

After database creation, go to the **Rules** tab and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User recipes - users can only access their own recipes
    match /users/{userId}/recipes/{recipeId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User meals - users can only access their own meals
    match /users/{userId}/meals/{mealId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"** to save the rules.

### 3. Enable Authentication Methods

1. Go to [Authentication](https://console.firebase.google.com/project/nutribuddy-3922b/authentication/providers)
2. Click on **"Email/Password"**
3. Enable it and click **"Save"**

### 4. Restart Your Development Server

After completing the above steps:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Firestore Data Structure

Your app will create the following collections automatically:

```
/users/{userId}
  - uid: string
  - email: string
  - name: string
  - age: number
  - gender: 'male' | 'female' | 'other'
  - activityLevel: string
  - goal: 'lose' | 'maintain' | 'gain'
  - dailyCalorieTarget: number
  - dailyProteinTarget: number
  - dailyCarbTarget: number
  - dailyFatTarget: number
  - createdAt: string
  - updatedAt: string

/users/{userId}/recipes/{recipeId}
  - id: string
  - userId: string
  - name: string
  - ingredients: array
  - totalCalories: number
  - totalProtein: number
  - totalCarbs: number
  - totalFat: number
  - servings: number
  - createdAt: string

/users/{userId}/meals/{mealId}
  - id: string
  - userId: string
  - date: string
  - mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  - recipes: array
  - calories: number
  - protein: number
  - carbs: number
  - fat: number
  - createdAt: string
```

## Troubleshooting

### Still seeing "client is offline"?

1. **Clear browser cache** and reload the page
2. **Check Firebase Console**: Ensure Firestore shows as "Running"
3. **Verify environment variables**: Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set in `.env.local`
4. **Check browser console**: Look for any CORS or network errors
5. **Try incognito/private browsing**: Rules out browser extension conflicts

### Authentication issues?

1. Go to Firebase Console → Authentication → Settings
2. Add your domain to **Authorized domains**: `localhost` should be there by default
3. For production, add your Cloudflare Pages domain

### Can't create documents?

1. Check Firestore Rules in Firebase Console
2. Ensure you're authenticated (check browser console for auth state)
3. Verify the user object contains a valid `uid`

## Next Steps

Once Firestore is initialized:

1. ✅ Sign up for a new account
2. ✅ Complete your profile setup
3. ✅ Create your first recipe
4. ✅ Log your first meal
5. ✅ View your dashboard

## Production Deployment Notes

Before deploying to production:

1. **Update Firestore Rules**: The rules above are production-ready
2. **Add production domain**: Add your Cloudflare Pages URL to Firebase authorized domains
3. **Set environment variables**: Add all `NEXT_PUBLIC_FIREBASE_*` variables to Cloudflare Pages environment settings
4. **Test thoroughly**: Verify all features work with production build locally first

```bash
npm run build
npm start
```
