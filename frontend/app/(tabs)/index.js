import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Home() {
  const { success } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {success && (
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#383F78" }}>
          {success}
        </Text>
      )}
    </View>
  );
}
