# Nutrix - Command Reference

Quick reference for all npm commands and utilities.

## 🚀 Development Commands

### Start Development Server
```bash
npm run dev
```
- Starts Next.js development server
- Opens at http://localhost:3000
- Hot reload enabled
- Shows errors in terminal and browser

### Alternative Port
```bash
npm run dev -- -p 3001
```
Use this if port 3000 is already in use.

---

## 🏗️ Build Commands

### Production Build
```bash
npm run build
```
- Creates optimized static export
- Output in `out/` directory
- Required before deployment
- Shows build errors if any

### What It Does:
1. Compiles TypeScript
2. Bundles JavaScript
3. Optimizes assets
4. Generates static HTML
5. Creates `out/` directory

---

## 🔍 Code Quality

### Run Linter
```bash
npm run lint
```
- Checks code style
- Finds potential bugs
- Enforces best practices

---

## 📦 Package Management

### Install Dependencies
```bash
npm install
```
- Installs all packages from package.json
- Creates node_modules/
- Updates package-lock.json

### Install Specific Package
```bash
npm install package-name
```

### Update Packages
```bash
npm update
```

### Check Outdated Packages
```bash
npm outdated
```

---

## 🧹 Cleanup Commands

### Remove Build Files
```bash
rm -rf .next out
```

### Remove Dependencies
```bash
rm -rf node_modules
```

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🌐 Local Preview

### Preview Production Build
```bash
npm run build
npx serve out
```
- Serves the static export
- Opens at http://localhost:3000
- No hot reload (static files)

---

## 📊 Check Commands

### Check Node Version
```bash
node --version
```
Should be v18 or higher.

### Check npm Version
```bash
npm --version
```

### Check TypeScript
```bash
npx tsc --version
```

---

## 🔧 Troubleshooting Commands

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Reset Everything
```bash
rm -rf .next out node_modules package-lock.json
npm install
npm run dev
```

### Check for Port Usage (macOS)
```bash
lsof -i :3000
```

### Kill Process on Port 3000
```bash
kill -9 $(lsof -t -i:3000)
```

---

## 🚢 Deployment Commands

### Deploy to Cloudflare (Manual)
```bash
npm run build
npx wrangler pages publish out --project-name=nutribuddy
```

---

## 📂 File Operations

### List Files
```bash
ls -la
```

### Show Project Structure
```bash
tree -I 'node_modules|.next|out' -L 3
```

### Check File Size
```bash
du -sh out/
```

---

## 🔍 Debugging Commands

### Show Environment Variables
```bash
cat .env.local
```

### Check Git Status
```bash
git status
```

### View Git Log
```bash
git log --oneline -10
```

---

## 📱 Testing URLs

### Local Development
```
http://localhost:3000
```

### Local Production Preview
```
http://localhost:3000
```
(After `npx serve out`)

---

## ⚡ Quick Commands Cheat Sheet

```bash
# Day-to-day development
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Check code

# Troubleshooting
rm -rf .next            # Clear cache
rm -rf node_modules     # Remove packages
npm install             # Reinstall packages

# Git
git add .               # Stage changes
git commit -m "msg"     # Commit
git push               # Push to GitHub

# Deployment
npm run build           # Build
# Then push to GitHub for auto-deploy
```

---

## 🎯 Common Workflows

### Daily Development
```bash
cd nutribuddy
npm run dev
# Make changes
# Test at localhost:3000
# Ctrl+C to stop
```

### Before Committing
```bash
npm run lint
npm run build
# If successful:
git add .
git commit -m "Add feature X"
git push
```

### Deploy New Version
```bash
# Make changes
npm run build
# Test the build
npx serve out
# If good:
git add .
git commit -m "Release v1.x"
git push
# Cloudflare auto-deploys
```

### Fresh Start After Issues
```bash
rm -rf .next out node_modules package-lock.json
npm install
npm run dev
```

---

## 💡 Pro Tips

1. **Always test builds locally before pushing**
   ```bash
   npm run build && npx serve out
   ```

2. **Check for TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```

3. **Format code with Prettier** (if installed)
   ```bash
   npx prettier --write .
   ```

4. **Analyze bundle size**
   ```bash
   npm run build
   # Check .next/static for file sizes
   ```

5. **Watch for errors**
   - Terminal shows build/server errors
   - Browser console shows client errors
   - Firebase Console shows database errors

---

## 🆘 Emergency Commands

### App Won't Start
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Build Fails
```bash
# Check environment variables
cat .env.local

# Check Node version
node --version

# Try clean build
rm -rf .next out
npm run build
```

### Git Issues
```bash
# Discard all changes
git reset --hard

# Pull latest
git pull origin main
```

---

## 📚 Additional Resources

- Next.js CLI: https://nextjs.org/docs/app/api-reference/cli
- npm Commands: https://docs.npmjs.com/cli/v9/commands
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/commands/

---

**Bookmark this page for quick command reference!** 📖
