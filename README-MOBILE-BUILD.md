# VitalAI Mobile App Build Instructions

## 🚀 Building Your Native Mobile App

This project is configured with Capacitor to create **real native mobile apps** for iOS and Android.

## Prerequisites

### For iOS (Mac required):
- macOS computer
- Xcode 14+ installed from App Store
- CocoaPods: `sudo gem install cocoapods`

### For Android:
- Android Studio installed
- Java Development Kit (JDK) 11+
- Android SDK

## Step-by-Step Build Instructions

### 1. Export and Clone Project

```bash
# Click "Export to GitHub" button in Lovable
# Then clone your repository locally
git clone <your-github-repo-url>
cd vital-ai-vista
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Mobile Platforms

```bash
# For iOS (Mac only)
npx cap add ios

# For Android
npx cap add android
```

### 4. Build Web Assets

```bash
npm run build
```

### 5. Sync to Native Platforms

```bash
npx cap sync
```

### 6. Run on Device/Emulator

#### For iOS:
```bash
npx cap run ios
```
This opens Xcode. Click the Play button to run on simulator or connected device.

#### For Android:
```bash
npx cap run android
```
This opens Android Studio. Click Run to launch on emulator or connected device.

## Hot Reload During Development

The app is configured to connect to the Lovable development server for hot-reload:
- Make changes in Lovable
- See updates instantly on your mobile device
- No rebuild needed during development

## Building for Production

### iOS Production Build:
1. Open project in Xcode: `npx cap open ios`
2. Select "Product" → "Archive"
3. Upload to App Store Connect

### Android Production Build:
1. Open project in Android Studio: `npx cap open android`
2. Build → Generate Signed Bundle/APK
3. Upload to Google Play Console

## Troubleshooting

### After Code Changes:
```bash
npm run build
npx cap sync
```

### Clean Build:
```bash
# iOS
npx cap sync ios --force

# Android
npx cap sync android --force
```

### Update Capacitor:
```bash
npm install @capacitor/core@latest @capacitor/cli@latest
npx cap sync
```

## App Configuration

- **App ID**: `app.lovable.927886cc56634bcb8fb5299103ded3e2`
- **App Name**: VitalAI - Healthcare Intelligence Platform
- **Development URL**: Auto-configured for hot reload
- **Config File**: `capacitor.config.ts`

## Need Help?

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Deployment Guide](https://capacitorjs.com/docs/ios)
- [Android Deployment Guide](https://capacitorjs.com/docs/android)

## Next Steps After Local Build

1. Test all features on mobile device
2. Configure app icons and splash screens
3. Set up push notifications (if needed)
4. Add native plugins for device features
5. Submit to App Store / Play Store

---

**Important**: You must complete these steps on your local machine. Lovable provides the configured project - the actual mobile build happens locally with Xcode/Android Studio.
