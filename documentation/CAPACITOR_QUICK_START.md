# 🚀 Capacitor Quick Start - Build Mobile Apps

Quick reference guide for building Android and iOS apps from لِأهلك.

---

## ⚡ Quick Commands

### **Build & Sync**
```bash
# Build Next.js static export + sync to all platforms
npm run cap:build

# Build and sync Android only
npm run cap:build:android

# Build and sync iOS only  
npm run cap:build:ios
```

### **Open Native IDEs**
```bash
# Open Android Studio
npm run cap:open:android

# Open Xcode (macOS only)
npm run cap:open:ios
```

### **Sync Only (after changes)**
```bash
# Sync web assets to all platforms
npm run cap:sync

# Sync to Android only
npm run cap:sync:android

# Sync to iOS only
npm run cap:sync:ios
```

---

## 📱 Build Your First App

### **Android:**
```bash
# 1. Build and sync
npm run cap:build:android

# 2. Open Android Studio
npm run cap:open:android

# 3. Click Run ▶️ button in Android Studio
```

### **iOS (macOS only):**
```bash
# 1. Build and sync
npm run cap:build:ios

# 2. Open Xcode
npm run cap:open:ios

# 3. Select signing team in Xcode
# 4. Click Run ▶️ button in Xcode
```

---

## 🔄 Development Workflow

```bash
# 1. Make changes to your Next.js code
npm run dev

# 2. Test in browser first
# http://localhost:3000

# 3. Build and sync to native platforms
npm run cap:build

# 4. Open native IDE and run
npm run cap:open:android
# or
npm run cap:open:ios
```

---

## 📦 Generate Release Builds

### **Android APK (for direct install):**
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### **Android AAB (for Play Store):**
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### **iOS IPA (for App Store):**
1. Open Xcode: `npm run cap:open:ios`
2. Menu: **Product → Archive**
3. Click **Distribute App**
4. Follow the wizard to export IPA

---

## 🛠️ Troubleshooting

### **White screen on app launch?**
```bash
# Rebuild with static export config
npm run cap:build
```

### **Android build fails?**
```bash
cd android
./gradlew clean
cd ..
npm run cap:build:android
```

### **iOS pods fail?**
```bash
cd ios/App
pod install
cd ../..
npm run cap:sync:ios
```

### **Changes not showing?**
```bash
# Always rebuild after code changes
npm run cap:build

# Then re-run app in native IDE
```

---

## 📁 Project Structure

```
your-project/
├── android/              # Android native project
├── ios/                  # iOS native project
├── out/                  # Next.js static export (built files)
├── capacitor.config.ts   # Capacitor configuration
├── next.config.capacitor.js  # Next.js config for Capacitor
└── documentation/
    └── CAPACITOR_SETUP.md    # Full setup guide
```

---

## 🎯 Key Configuration Files

### **capacitor.config.ts**
- App ID: `com.laahlak.app`
- App Name: `لِأهلك`
- Web Directory: `out`

### **next.config.capacitor.js**
- Static export enabled
- Image optimization disabled
- Trailing slashes enabled

---

## 💡 Pro Tips

1. **Always test in browser first** before building for mobile
2. **Use absolute paths** for images: `/logo.png` not `./logo.png`
3. **Rebuild after every change** to Next.js code
4. **Use Chrome DevTools** for Android debugging
5. **Use Safari DevTools** for iOS debugging

---

## 📚 Full Documentation

For detailed setup instructions, troubleshooting, and distribution guides, see:
- **[CAPACITOR_SETUP.md](./CAPACITOR_SETUP.md)** - Complete guide

---

## ✅ Prerequisites Checklist

### **For Android:**
- [ ] Android Studio installed
- [ ] Java JDK 17+ installed
- [ ] Android SDK (API 33+) installed

### **For iOS (macOS only):**
- [ ] Xcode 14+ installed
- [ ] CocoaPods installed: `sudo gem install cocoapods`
- [ ] Apple Developer Account (for device testing)

---

**Ready to build! 🎉**

```bash
npm run cap:build
npm run cap:open:android  # or npm run cap:open:ios
```

