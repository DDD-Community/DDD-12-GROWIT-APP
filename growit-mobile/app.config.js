export default {
  expo: {
    name: 'growit',
    slug: 'growit-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/app/icon.png',
    scheme: 'growitmobile',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'com.growitddd.growit-app',
      supportsTablet: false,
      usesAppleSignIn: true,
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [`kakao${process.env.KAKAO_NATIVE_APP_KEY}`],
          },
        ],
        LSApplicationQueriesSchemes: ['kakaokompassauth', 'kakaolink', 'kakaoplus'],
      },
    },
    android: {
      package: 'com.growitddd.growit_app',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      [
        'expo-router',
        {
          root: './src/app',
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/app/icon-splash.png',
          imageWidth: 300,
          resizeMode: 'contain',
          backgroundColor: '#000000',
        },
      ],
      [
        '@react-native-seoul/kakao-login',
        {
          kakaoAppKey: process.env.KAKAO_NATIVE_APP_KEY,
          kotlinVersion: '2.1.21',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {
        root: './src/app',
      },
      eas: {
        projectId: 'f8f4eb8d-fc22-48bb-8aaa-fe36d96dcd90',
      },
    },
    owner: 'growit-ddd',
  },
};
