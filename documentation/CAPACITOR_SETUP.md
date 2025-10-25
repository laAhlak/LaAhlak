# 📱 Capacitor Setup Guide - لِأهلك Mobile Apps

Complete guide to building Android and iOS native apps from your Next.js application using Capacitor.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Build Commands](#build-commands)
4. [Android Setup](#android-setup)
5. [iOS Setup](#ios-setup)
6. [Development Workflow](#development-workflow)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### For Android Development:
- **Android Studio** (latest version)
- **Java JDK 17** or higher
- **Android SDK** (API level 33+)
- **Gradle** (comes with Android Studio)

### For iOS Development (macOS only):
- **Xcode 14+** (from Mac App Store)
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Simulator** (included with Xcode)
- **Apple Developer Account** (for device testing)

---

## 🚀 Quick Start

### 1. **Initial Setup (Already Done!)**
```bash
# Packages already installed:
# - @capacitor/core
# - @capacitor/cli
# - @capacitor/android
# - @capacitor/ios

# Platforms already added:
# - Android platform ✓
# - iOS platform ✓
```

### 2. **Build Your First Native App**
```bash
# Build for both platforms
npm run cap:build

# Or build for specific platform
npm run cap:build:android
npm run cap:build:ios
```

---

## 📦 Build Commands

### **Static Export + Capacitor Sync**
```bash
# Build and sync both platforms
npm run cap:build

# Build and sync Android only
npm run cap:build:android

# Build and sync iOS only
npm run cap:build:ios
```

### **Sync Without Rebuilding Next.js**
```bash
# Sync both platforms
npm run cap:sync

# Sync Android only
npm run cap:sync:android

# Sync iOS only
npm run cap:sync:ios
```

### **Open Native IDEs**
```bash
# Open Android Studio
npm run cap:open:android

# Open Xcode
npm run cap:open:ios
```

---

## 🤖 Android Setup

### **Step 1: Build the App**
```bash
npm run cap:build:android
```

### **Step 2: Open Android Studio**
```bash
npm run cap:open:android
```

### **Step 3: Configure Android Project**

#### **Update App Information:**
Edit `android/app/build.gradle`:
```gradle
android {
    namespace "com.laahlak.app"
    compileSdk 34
    
    defaultConfig {
        applicationId "com.laahlak.app"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

#### **Add App Icons:**
1. Generate icons: Place your logo at `public/logo.png` (512x512)
2. Use Android Image Asset Studio in Android Studio:
   - `Right-click res → New → Image Asset`
   - Select "Launcher Icons (Adaptive and Legacy)"
   - Choose your logo image
   - Generate icons for all densities

#### **Update App Name:**
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">لِأهلك</string>
    <string name="title_activity_main">لِأهلك</string>
    <string name="package_name">com.laahlak.app</string>
    <string name="custom_url_scheme">com.laahlak.app</string>
</resources>
```

### **Step 4: Build APK/AAB**

#### **Debug Build (for testing):**
```bash
cd android
./gradlew assembleDebug
# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

#### **Release Build (for Play Store):**
```bash
cd android
./gradlew bundleRelease
# AAB location: android/app/build/outputs/bundle/release/app-release.aab
```

### **Step 5: Run on Device/Emulator**
- Click **Run** ▶️ button in Android Studio
- Or use: `npx cap run android`

---

## 🍎 iOS Setup

### **Step 1: Build the App**
```bash
npm run cap:build:ios
```

### **Step 2: Open Xcode**
```bash
npm run cap:open:ios
```

### **Step 3: Configure iOS Project**

#### **Update Bundle Identifier:**
1. Open Xcode
2. Select the project root "App"
3. Go to **Signing & Capabilities** tab
4. Set **Bundle Identifier**: `com.laahlak.app`

#### **Add App Icons:**
1. Open `ios/App/Assets.xcassets/AppIcon.appiconset`
2. Drag and drop your logo for each required size:
   - 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024

#### **Update App Name:**
Edit `ios/App/App/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>لِأهلك</string>
<key>CFBundleName</key>
<string>لِأهلك</string>
```

### **Step 4: Configure Signing**
1. In Xcode, select **Signing & Capabilities**
2. Choose your **Team** (Apple Developer Account)
3. Enable **Automatically manage signing**

### **Step 5: Build and Run**
- Click **Run** ▶️ button in Xcode
- Or use: `npx cap run ios`
- Select target device/simulator

---

## 🔄 Development Workflow

### **Daily Development Cycle:**

1. **Make changes to your Next.js app**
   ```bash
   npm run dev
   # Test in browser
   ```

2. **Build and sync to native platforms**
   ```bash
   npm run cap:build
   ```

3. **Open native IDE and run**
   ```bash
   npm run cap:open:android
   # or
   npm run cap:open:ios
   ```

### **Quick Sync (after small changes):**
```bash
# If you've only changed web assets, no need to rebuild:
npm run cap:sync
```

---

## 🎨 App Icon Setup

### **Automatic Icon Generation**

You can use your existing `logo.png` to generate all required icons:

```bash
# Install @capacitor/assets
npm install @capacitor/assets --save-dev

# Generate icons for all platforms
npx capacitor-assets generate
```

Or manually place icons:
- **Android**: `android/app/src/main/res/mipmap-*/ic_launcher.png`
- **iOS**: `ios/App/Assets.xcassets/AppIcon.appiconset/`

---

## 🛠️ Troubleshooting

### **Common Issues:**

#### **1. "Build failed" on Android**
```bash
# Clean gradle cache
cd android
./gradlew clean

# Rebuild
cd ..
npm run cap:build:android
```

#### **2. "Pods failed to install" on iOS**
```bash
cd ios/App
pod repo update
pod install
cd ../..
npm run cap:sync:ios
```

#### **3. White screen on app launch**
- Check `capacitor.config.ts` → `webDir` should be `"out"`
- Ensure `next.config.capacitor.js` has `output: 'export'`
- Rebuild: `npm run cap:build`

#### **4. API calls not working in app**
- Make sure your `.env.local` uses full URLs, not relative paths
- Update `NEXT_PUBLIC_APP_URL` to your production API URL
- Ensure CORS is configured on your backend

#### **5. Images not loading**
- Use absolute paths: `/logo.png` instead of relative paths
- Ensure `images.unoptimized: true` in `next.config.capacitor.js`

---

## 📱 Distribution

### **Android - Google Play Store:**
1. Build release AAB: `cd android && ./gradlew bundleRelease`
2. Sign the AAB with your keystore
3. Upload to Google Play Console
4. Submit for review

### **iOS - Apple App Store:**
1. Archive in Xcode: `Product → Archive`
2. Validate the archive
3. Distribute to App Store Connect
4. Submit for review via App Store Connect website

---

## 🔐 Environment Variables

Make sure to update your environment variables for production:

```bash
# .env.production
NEXT_PUBLIC_APP_URL=https://your-api.com
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 📚 Useful Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Studio**: https://developer.android.com/studio
- **Xcode**: https://developer.apple.com/xcode
- **Capacitor Community Plugins**: https://github.com/capacitor-community

---

## 🎯 Next Steps

1. ✅ **Test on Emulators** - Run on Android Emulator and iOS Simulator
2. ✅ **Test on Real Devices** - Install on physical Android/iOS devices
3. ✅ **Add App Icons** - Use your logo to generate all required icon sizes
4. ✅ **Configure Splash Screen** - Customize the splash screen in `capacitor.config.ts`
5. ✅ **Build Release Versions** - Create signed APK/AAB and IPA files
6. ✅ **Submit to Stores** - Upload to Google Play and App Store

---

## 💡 Tips

- **Live Reload**: Use `npx cap run android --livereload` for faster development
- **Device Logs**: Use Chrome DevTools for Android, Safari DevTools for iOS
- **Network Debugging**: Use Capacitor's Network plugin for API debugging
- **Storage**: Use Capacitor Preferences API instead of localStorage for native storage

---

**Happy Building! 🚀**

