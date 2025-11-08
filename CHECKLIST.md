# NutriBuddy - Setup Checklist

Use this checklist to ensure everything is configured correctly.

## ✅ Initial Setup

- [ ] Node.js installed (v18 or higher)
- [ ] npm working (check with `npm --version`)
- [ ] Code editor installed (VS Code recommended)
- [ ] Terminal/Command Line access

## ✅ Firebase Configuration

- [ ] Firebase account created
- [ ] New Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Firestore database created (production mode)
- [ ] Security rules added to Firestore
- [ ] Firebase config values copied (apiKey, authDomain, etc.)
- [ ] Authorized domains include localhost

## ✅ USDA API

- [ ] USDA API key requested
- [ ] API key received via email
- [ ] API key saved securely

## ✅ Project Configuration

- [ ] Repository cloned or downloaded
- [ ] `.env.local` file created (from `.env.example`)
- [ ] All Firebase values added to `.env.local`
- [ ] USDA API key added to `.env.local`
- [ ] Dependencies installed (`npm install`)

## ✅ Local Testing

- [ ] Development server starts (`npm run dev`)
- [ ] App opens in browser (http://localhost:3000)
- [ ] Sign up works (creates new user)
- [ ] Profile setup works (saves weight and goals)
- [ ] Ingredient search works (returns USDA results)
- [ ] Recipe creation works (saves to Firestore)
- [ ] Recipe list displays correctly
- [ ] Meal logging works (records meals)
- [ ] Dashboard shows correct data
- [ ] Charts render properly
- [ ] Date navigation works
- [ ] Logout works

## ✅ Pre-Deployment

- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] All features tested locally
- [ ] `.env.local` NOT committed to Git
- [ ] `.gitignore` includes `.env.local`
- [ ] Code pushed to GitHub

## ✅ Cloudflare Pages Setup

- [ ] Cloudflare account created
- [ ] GitHub repository connected
- [ ] Build command set: `npm run build`
- [ ] Output directory set: `out`
- [ ] All environment variables added to Cloudflare
- [ ] Deployment successful
- [ ] Production URL works
- [ ] All features tested on production

## ✅ Post-Deployment

- [ ] Firebase authorized domains updated (add Cloudflare URL)
- [ ] Production signup/login works
- [ ] Production recipe creation works
- [ ] Production meal logging works
- [ ] Charts work in production
- [ ] Mobile responsive design verified
- [ ] Tablet responsive design verified

## ✅ Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic with Cloudflare)
- [ ] Analytics set up (Cloudflare Web Analytics)
- [ ] Favicon customized
- [ ] Meta tags updated for SEO
- [ ] Open Graph tags for social sharing

## 🐛 Troubleshooting Checklist

If something doesn't work, check:

### Authentication Issues
- [ ] Firebase API key correct in `.env.local`
- [ ] Email/Password provider enabled in Firebase
- [ ] Authorized domains include your URL

### Database Issues
- [ ] Firestore security rules deployed
- [ ] Firestore in production mode (not test mode)
- [ ] User has proper permissions

### API Issues
- [ ] USDA API key correct
- [ ] Internet connection working
- [ ] No CORS errors in console

### Build Issues
- [ ] All environment variables set in Cloudflare
- [ ] Node version compatible (18+)
- [ ] Dependencies installed correctly

### UI Issues
- [ ] Browser cache cleared
- [ ] JavaScript enabled
- [ ] Modern browser (Chrome, Firefox, Safari, Edge)

## 📊 Performance Checklist

- [ ] Initial page load < 3 seconds
- [ ] Ingredient search responds < 2 seconds
- [ ] Dashboard loads < 1 second
- [ ] Charts render smoothly
- [ ] Mobile performance acceptable

## 🔒 Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] No API keys in code
- [ ] Firestore rules restrict user data
- [ ] HTTPS enabled (Cloudflare handles this)
- [ ] Authentication required for all features

## 📱 Cross-Device Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile landscape

## 🎨 UI/UX Checklist

- [ ] Dark theme consistent
- [ ] Buttons have hover states
- [ ] Loading states show for async operations
- [ ] Error messages are clear
- [ ] Forms validate input
- [ ] Success messages appear
- [ ] Navigation is intuitive

## 📈 Feature Testing Matrix

| Feature | Local | Production | Mobile |
|---------|-------|------------|--------|
| Sign Up | [ ] | [ ] | [ ] |
| Login | [ ] | [ ] | [ ] |
| Password Reset | [ ] | [ ] | [ ] |
| Profile Setup | [ ] | [ ] | [ ] |
| Ingredient Search | [ ] | [ ] | [ ] |
| Create Recipe | [ ] | [ ] | [ ] |
| Edit Recipe | [ ] | [ ] | [ ] |
| Delete Recipe | [ ] | [ ] | [ ] |
| Log Meal | [ ] | [ ] | [ ] |
| Delete Meal | [ ] | [ ] | [ ] |
| View Dashboard | [ ] | [ ] | [ ] |
| Date Navigation | [ ] | [ ] | [ ] |
| View Charts | [ ] | [ ] | [ ] |
| Logout | [ ] | [ ] | [ ] |

## 🎯 Success Criteria

Your app is ready when:
- ✅ All features work locally
- ✅ All features work in production
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Charts display correctly
- ✅ Data persists across sessions
- ✅ Multiple users can use simultaneously

## 📝 Notes Section

Use this space for your own notes:

```
Firebase Project ID: ______________________________

Cloudflare URL: ___________________________________

Custom Domain: ____________________________________

Deployment Date: __________________________________

Issues Found: _____________________________________
_________________________________________________
_________________________________________________

Fixes Applied: ____________________________________
_________________________________________________
_________________________________________________
```

---

**Congratulations!** When all boxes are checked, your NutriBuddy app is production-ready! 🎉
