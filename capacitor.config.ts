import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cocinacero.app',
  appName: 'CocinaCero',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
