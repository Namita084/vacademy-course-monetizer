# Troubleshooting Guide

## 🚀 Quick Start

### Option 1: Use Batch File (Recommended)
```cmd
start-dev.bat
```

### Option 2: Use PowerShell Script
```powershell
.\start-dev.ps1
```

### Option 3: Manual Commands
```cmd
npm run dev
```

## 🔧 Common Issues & Solutions

### 1. PowerShell Execution Policy Error
**Error**: `File cannot be loaded because running scripts is disabled`

**Solutions**:
- **Option A**: Run as Administrator and execute:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- **Option B**: Use Command Prompt instead of PowerShell
- **Option C**: Use the provided batch file (`start-dev.bat`)

### 2. Port Already in Use
**Error**: `Port 8080 is already in use`

**Solutions**:
- Kill the process using port 8080:
  ```cmd
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```
- Or change the port in `vite.config.ts`

### 3. Dependencies Not Installed
**Error**: `Cannot find module`

**Solution**:
```cmd
npm install
```

### 4. Node.js Not Found
**Error**: `'node' is not recognized`

**Solution**:
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### 5. Payment Page is Blank
**Issue**: Payment settings page shows blank content

**Solutions**:
- ✅ **Fixed**: All tab contents have been completed
- ✅ **Fixed**: Payment plan management is fully functional
- ✅ **Fixed**: Coupon management is working
- ✅ **Fixed**: Error handling has been added

## 📁 Project Structure

```
vacademy-course-monetizer/
├── src/
│   ├── pages/
│   │   ├── InstituteSettings.tsx    # Payment settings page
│   │   └── InvitePage.tsx           # Invite management page
│   ├── components/
│   │   ├── PaymentPlanCreator.tsx   # Create/edit payment plans
│   │   ├── PaymentPlanList.tsx      # Display payment plans
│   │   └── CouponCreator.tsx        # Create/edit coupons
│   └── App.tsx                      # Main routing
├── start-dev.bat                    # Windows batch file
├── start-dev.ps1                    # PowerShell script
└── TROUBLESHOOTING.md               # This file
```

## 🎯 Available Routes

- **Dashboard**: `/`
- **Course Creation**: `/course-creation`
- **Institute Settings**: `/institute-settings`
- **Invite Management**: `/invite`

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📞 Support

If you encounter any issues not covered here:

1. Check the browser console for JavaScript errors
2. Verify all dependencies are installed
3. Ensure Node.js version is 16+ 
4. Try clearing npm cache: `npm cache clean --force`

## ✅ Recent Fixes Applied

- ✅ **Payment Page**: Completed all tab contents
- ✅ **Error Handling**: Added comprehensive error handling
- ✅ **Payment Plans**: Full CRUD operations working
- ✅ **Coupons**: Complete management interface
- ✅ **Navigation**: All routes properly configured
- ✅ **UI Components**: All components properly imported and working 