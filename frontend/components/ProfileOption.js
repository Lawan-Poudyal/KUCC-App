import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileOption({ icon, title, onPress, isDropdown }) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={20} color="#5B5F8D" />
        <Text style={styles.optionText}>{title}</Text>
      </View>

      <Ionicons
        name={isDropdown ? "chevron-down" : "chevron-forward"}
        size={18}
        color="#888"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    // marginTop: 20,
    // paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },

  optionRow: {
    height: 55,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
});
