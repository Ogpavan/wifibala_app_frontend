# wifibala native wrapper

This folder contains a separate React Native wrapper project for `https://app.wifibala.com`.

## Stack

- Expo-based React Native app
- `react-native-webview` for rendering the hosted app

## What is included

- WebView wrapper pointed at `https://app.wifibala.com`
- Android hardware back-button support
- Pull-to-refresh
- External links open outside the wrapper
- Basic loading and network error states

## Local setup

Install the required toolchain first:

- Node.js `20.19.x` or newer
- Android Studio with Android SDK

Official references:

- React Native environment setup: https://reactnative.dev/docs/next/set-up-your-environment
- Expo SDK reference: https://docs.expo.dev/versions/latest/
- Expo WebView docs: https://docs.expo.dev/versions/latest/sdk/webview/

Then run:

```bash
cd wifibala-native
npm install
npx expo start
```

To create a native Android project locally:

```bash
npx expo run:android
```

## Notes

- This project was scaffolded manually in this environment because `node`, `npm`, and `npx` are not installed here.
- Before shipping, set your final app icon, splash assets, and Play Store package name if `com.wifibala.app` is not the one you want.
