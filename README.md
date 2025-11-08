# NutriBuddy - Calorie & Macro Tracker

A comprehensive calorie and macronutrient tracking web application built with Next.js, Firebase, and the USDA FoodData Central API. Designed for deployment on Cloudflare Pages.

## Features

- **User Authentication**: Firebase email/password authentication with password reset
- **User Profiles**: Set daily calorie goals, track body weight, and target weight changes
- **Ingredient Search**: Real-time USDA FoodData Central API integration
- **Recipe Management**: Create custom recipes with automatic nutrition calculation
- **Meal Logging**: Track daily food intake with portion control
- **Interactive Dashboard**: 
  - Daily calorie and macro tracking
  - 7-day trend charts
  - Macronutrient distribution visualization
  - Progress tracking against goals
- **Modern Dark Theme**: Clean, responsive UI optimized for all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication & Database**: Firebase Auth & Firestore
- **Charts**: Chart.js with react-chartjs-2
- **API**: USDA FoodData Central
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages (static export)

## Prerequisites

1. **Firebase Project**:
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Create a Firestore database

2. **USDA API Key**:
   - Get a free API key from [USDA FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html)

## Installation

1. **Clone and install dependencies**:
   ```bash
   cd nutribuddy
   npm install
   ```

2. **Configure environment variables**:
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Firebase and USDA credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_USDA_API_KEY=your_usda_api_key
   ```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

Build the static export:
```bash
npm run build
```

The output will be in the `out` directory, ready for deployment to Cloudflare Pages.

## Deployment to Cloudflare Pages

### Method 1: Cloudflare Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to **Workers & Pages** > **Create Application** > **Pages**
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
6. Add environment variables in the Cloudflare dashboard
7. Deploy!

### Method 2: Wrangler CLI

```bash
npm install -g wrangler
wrangler pages publish out
```

## Firestore Security Rules

Add these rules to your Firestore:

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

## Usage Guide

1. **Sign Up**: Create an account with email and password
2. **Set Up Profile**: Enter your body weight and daily calorie goal
3. **Create Recipes**: 
   - Search for ingredients using the USDA database
   - Add ingredients with specified amounts (in grams)
   - Save recipes with automatic nutrition calculations
4. **Log Meals**: 
   - Select a recipe from your collection
   - Enter the portion size consumed
   - View updated daily totals
5. **Track Progress**: 
   - Monitor daily calorie intake
   - View macronutrient breakdown
   - Check 7-day trends

## Project Structure

```
nutribuddy/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── page.tsx             # Main application page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── auth/               # Authentication forms
│   ├── dashboard/          # Dashboard with charts
│   ├── meals/              # Meal logging
│   ├── profile/            # User profile setup
│   └── recipe/             # Recipe creation/editing
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication state
├── lib/                    # Utility libraries
│   ├── firebase.ts         # Firebase configuration
│   ├── types.ts            # TypeScript types
│   ├── usda-api.ts         # USDA API integration
│   ├── user-service.ts     # User profile operations
│   ├── recipe-service.ts   # Recipe CRUD operations
│   └── meal-service.ts     # Meal logging operations
└── public/                 # Static assets
```

## Free Tier Compatibility

This application is designed to stay within free tier limits:

- **Cloudflare Pages**: 
  - 1 build at a time
  - 500 builds per month
  - Unlimited bandwidth
  - ✅ Static export compatible

- **Firebase Free (Spark Plan)**:
  - 10K document reads/day
  - 20K document writes/day
  - 1GB storage
  - 50K authentications/month

- **USDA API**:
  - No rate limits on API key
  - Free unlimited access

## Performance Optimization

- Client-side ingredient caching
- Optimized Firestore queries with indexes
- Static asset optimization
- Lazy loading of charts

## License

MIT License - feel free to use this project for personal or commercial purposes.
## License

MIT License - feel free to use this project for personal or commercial purposes.
