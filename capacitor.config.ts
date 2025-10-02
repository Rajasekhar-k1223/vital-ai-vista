import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.927886cc56634bcb8fb5299103ded3e2',
  appName: 'vital-ai-vista',
  webDir: 'dist',
  server: {
    url: 'https://927886cc-5663-4bcb-8fb5-299103ded3e2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0F172A',
      showSpinner: false
    }
  }
};

export default config;
