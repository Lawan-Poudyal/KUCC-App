import { router } from "expo-router";
import { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('yourname@gmail.com');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
  console.log("Sign up pressed");
  router.push("/(auth)/otp");
};

const handleLogin = () => {
  router.replace("/(auth)/login");
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>Hello</Text>
            <Text style={styles.headerText}>Create your</Text>
            <Text style={styles.headerText}>account !</Text>
          </View>

          <View style={styles.formWrapper}>
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder=""
                  placeholderTextColor="#B8B8C7"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder=""
                  placeholderTextColor="#B8B8C7"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gmail</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="yourname@gmail.com"
                  placeholderTextColor="#B8B8C7"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder=""
                  placeholderTextColor="#B8B8C7"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={handleSignUp}
              >
                <Text style={styles.signUpButtonText}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginText}>Login here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#383F78',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.04,
  },
  header: {
    marginBottom: height * 0.04,
    paddingLeft: width * 0.03,
  },
  headerText: {
    fontSize: width * 0.09,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: width * 0.11,
  },
  formWrapper: {
    marginBottom: height * 0.03,
  },
  formContainer: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: width * 0.08,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.04,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ rotate: '0deg' }],
  },
  inputGroup: {
    marginBottom: height * 0.03,
  },
  label: {
    fontSize: width * 0.04,
    color: '#9B9BAA',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
    paddingVertical: 10,
    fontSize: width * 0.04,
    color: '#333333',
  },
  signUpButton: {
    backgroundColor: '#5B5F8D',
    borderRadius: 30,
    paddingVertical: height * 0.022,
    alignItems: 'center',
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: width * 0.038,
    marginBottom: 5,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: width * 0.038,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});