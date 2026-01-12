import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function Khalti() {
  const { amount, name, email } = useLocalSearchParams();
  const router = useRouter();

  const khaltiURL = `https://test-admin.khalti.com/#/`; // sandbox

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: khaltiURL }}
        style={StyleSheet.absoluteFill} // Fills the entire SafeAreaView
        javaScriptEnabled={true}
        startInLoadingState={true}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("payment/success")) {
            router.replace("/membership-success");
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
