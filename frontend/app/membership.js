import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Membership() {
  const router = useRouter();

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const departments = ["CE", "CS", "BIT"];
  const batches = ["2025", "2024", "2023", "2022", "2021"];

  const [department, setDepartment] = useState(null);
  const [batch, setBatch] = useState(null);

  // Load draft on mount
  useEffect(() => {
    AsyncStorage.getItem("kucc_membership_draft").then(res => {
      if (res) {
        const data = JSON.parse(res);
        setFirstName(data.firstName || "");
        setMiddleName(data.middleName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setDepartment(data.department || null);
        setBatch(data.batch || null);
      }
    });
  }, []);

  // Save draft on changes
  useEffect(() => {
    const saveDraft = async () => {
      await AsyncStorage.setItem(
        "kucc_membership_draft",
        JSON.stringify({ firstName, middleName, lastName, email, department, batch })
      );
    };
    saveDraft();
  }, [firstName, middleName, lastName, email, department, batch]);

  // Start Khalti Payment
  const startPayment = () => {
    if (!firstName || !lastName || !email || !department || !batch) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    router.push({
      pathname: "/khalti",
      params: {
        amount: 1, // Rs 1 for sandbox
        name: firstName + " " + lastName,
        email,
        department,
        batch
      }
    });
  };

  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{ paddingTop: 30}}>
      <Text style={styles.title}>KUCC Membership</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name *"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Middle Name"
        value={middleName}
        onChangeText={setMiddleName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name *"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email *"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Department *</Text>
      <View style={styles.row}>
        {departments.map(d => (
          <TouchableOpacity
            key={d}
            onPress={() => setDepartment(d)}
            style={[styles.option, department === d && styles.optionActive]}
          >
            <Text style={{ color: department === d ? "#FFF" : "#000" }}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Batch *</Text>
      <View style={styles.row}>
        {batches.map(b => (
          <TouchableOpacity
            key={b}
            onPress={() => setBatch(b)}
            style={[styles.option, batch === b && styles.optionActive]}
          >
            <Text style={{ color: batch === b ? "#FFF" : "#000" }}>{b}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.feeBox}>
        <Text style={styles.feeText}>Membership Fee</Text>
        <Text style={styles.amount}>NRs. 1 (Sandbox)</Text>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={startPayment}>
        <Text style={styles.payText}>Pay with Khalti</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6E6E6", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 14,
    marginBottom: 12
  },
  label: { fontWeight: "600", marginTop: 10, marginBottom: 6 },
  row: { flexDirection: "row", gap: 10 },
  option: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12
  },
  optionActive: {
    backgroundColor: "#3C3F8F",
  },
  feeBox: {
    marginVertical: 25,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    alignItems: "center"
  },
  amount: { fontSize: 22, fontWeight: "700", marginTop: 5 },
  payButton: {
    backgroundColor: "#3C3F8F",
    padding: 16,
    borderRadius: 25,
    alignItems: "center"
  },
  payText: { color: "#FFF", fontWeight: "700" },
});
