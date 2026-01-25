import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

export default function Khalti() {
  const { amount = "1", name = "Test User", email = "test@example.com" } = useLocalSearchParams();
  const router = useRouter();

  // amount comes in rupees, Khalti requires paisa
  const amountInPaisa = parseInt(amount) * 100;

  // HTML string with Khalti sandbox checkout
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://khalti.com/static/khalti-checkout.js"></script>
  </head>
  <body>
    <button id="pay-button" style="padding:20px;font-size:18px;">Pay Rs ${amount}</button>

    <script>
      var config = {
        "publicKey": "test_public_key_XXXXXXXXXXXXXXXX", // use your Khalti sandbox public key
        "productIdentity": "membership_001",
        "productName": "KUCC Membership",
        "productUrl": "http://example.com/membership",
        "paymentPreference": ["KHALTI"],
        "eventHandler": {
          onSuccess (payload) {
            window.location.href = "payment/success";
          },
          onError (error) {
            alert("Payment failed: " + JSON.stringify(error));
          },
          onClose () {
            console.log("Widget closed");
          }
        }
      };
      var checkout = new KhaltiCheckout(config);
      document.getElementById("pay-button").onclick = function () {
        checkout.show({ amount: ${amountInPaisa} });
      };
    </script>
  </body>
  </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={StyleSheet.absoluteFill}
        javaScriptEnabled={true}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("payment/success")) {
            router.replace("/membership-success");
          }
        }}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
