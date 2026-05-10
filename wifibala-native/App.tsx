import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";

const APP_URL = "https://app.wifibala.com";
const ALLOWED_HOSTS = new Set(["app.wifibala.com", "wifibala.com"]);

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setHasError(false);
  }, []);

  const handleAndroidBack = useCallback(() => {
    if (!canGoBack) {
      return false;
    }

    webViewRef.current?.goBack();
    return true;
  }, [canGoBack]);

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", handleAndroidBack);
    return () => subscription.remove();
  }, [handleAndroidBack]);

  const stopRefresh = useCallback(() => {
    setIsLoading(false);
  }, []);

  const shouldStartLoad = useCallback((request: { url: string }) => {
    try {
      const url = new URL(request.url);
      if (ALLOWED_HOSTS.has(url.hostname)) {
        return true;
      }

      void Linking.openURL(request.url);
      return false;
    } catch {
      return true;
    }
  }, []);

  const errorCard = useMemo(
    () => (
      <SafeAreaView edges={["top", "bottom"]} style={styles.errorShell}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f8ff" />
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Unable to load wifibala</Text>
          <Text style={styles.errorBody}>
            Check your connection and try again. The app loads content from
            https://app.wifibala.com.
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setHasError(false);
              setIsLoading(true);
              webViewRef.current?.reload();
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryLabel}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    ),
    [],
  );

  if (hasError) {
    return errorCard;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
        <ExpoStatusBar style="dark" />
        {isLoading ? (
          <View pointerEvents="none" style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#0f3d91" />
            <Text style={styles.loaderText}>Loading wifibala...</Text>
          </View>
        ) : null}
        <WebView
          ref={webViewRef}
          source={{ uri: APP_URL }}
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          pullToRefreshEnabled
          setSupportMultipleWindows={false}
          startInLoadingState={false}
          onNavigationStateChange={onNavigationStateChange}
          onLoadEnd={stopRefresh}
          onError={() => {
            setHasError(true);
            stopRefresh();
          }}
          onHttpError={() => {
            setHasError(true);
            stopRefresh();
          }}
          onShouldStartLoadWithRequest={shouldStartLoad}
          allowsBackForwardNavigationGestures
          style={styles.webView}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8ff",
  },
  webView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#f5f8ff",
  },
  loaderText: {
    color: "#10213a",
    fontSize: 16,
    fontWeight: "600",
  },
  errorShell: {
    flex: 1,
    backgroundColor: "#f5f8ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#ffffff",
    shadowColor: "#0f3d91",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  errorTitle: {
    color: "#10213a",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorBody: {
    color: "#5f6f89",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#0f3d91",
  },
  retryLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
