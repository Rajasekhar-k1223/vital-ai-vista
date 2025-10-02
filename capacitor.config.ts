import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.927886cc56634bcb8fb5299103ded3e2',
  appName: 'VitalAI',
  webDir: 'dist',
  server: {
    // Development: Uses Lovable preview for hot-reload
    // Production: Comment out server section before building for stores
    url: 'https://927886cc-5663-4bcb-8fb5-299103ded3e2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0061A8',
      showSpinner: true,
      spinnerColor: '#FFFFFF'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
