import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.hello.vegan',
  appName: 'Hello Vegan',
  webDir: 'dist',
  version: '2.0', // This is the version shown to users
  android: {
    versionCode: 2 // This is the internal version code for Android
  },

  plugins: {
    Camera: {
      permissions: {
        android: {
          CAMERA: "We need access to the camera for video streaming."
        }
      }
    },
    Microphone: {
      permissions: {
        android: {
          RECORD_AUDIO: "We need access to the microphone for audio streaming."
        }
      }
    }
  }
};

export default config;
