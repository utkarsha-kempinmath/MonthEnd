import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, googleLogin } from "../services/authService"; // <-- Ensure googleLogin is imported
import { saveToken } from "../services/tokenService";
import { COLORS } from "../constants/theme";
import { useGoogleAuth } from "../services/googleAuth";
import * as WebBrowser from "expo-web-browser";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { request, response, promptAsync } = useGoogleAuth();
    

    // Listen for Google Auth Response
    useEffect(() => {
        if (response?.type === "success") {
            const idToken = response.authentication?.idToken || response.params?.id_token;
            
            if (idToken) {
                WebBrowser.dismissBrowser();
            
            // 2. Wait 500ms before doing the heavy lifting and changing screens
            setTimeout(() => {
                handleGoogleSignIn(idToken); // NOTE: Use handleGoogleSignUp in your SignupScreen
            }, 500);
            } else {
                console.log("Uh oh, Google response missing token:", response);
                alert("Failed to grab token from Google.");
            }
        }
    }, [response]);

    const handleGoogleSignIn = async (idToken) => {
        setLoading(true);
        try {
            const res = await googleLogin({ token: idToken }); // Calls backend /auth/google
            await AsyncStorage.removeItem('isNewUser');
            await saveToken(res.data.token);
            // RootNavigator will automatically navigate to Home!
        } catch (err) {
            console.log("Google API ERROR:", err.response?.data || err.message);
            alert("Google Sign-In failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await login({ email, password });
            await AsyncStorage.removeItem('isNewUser');
            await saveToken(res.data.token);
        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MonthEnd</Text>
            <Text style={styles.subtitle}>Understand your money. Not just track it.</Text>
            
            <TextInput placeholder="Email" placeholderTextColor="#888" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput placeholder="Password" placeholderTextColor="#888" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>LOGIN</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.googleButton} 
                onPress={() => promptAsync()} 
                disabled={!request || loading}
            >
                <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.footer}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, justifyContent: "center", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", color: COLORS.textPrimary, marginBottom: 8 },
    subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 30 },
    input: { backgroundColor: COLORS.input, color: COLORS.textPrimary, padding: 14, borderRadius: 14, marginBottom: 15 },
    button: { backgroundColor: COLORS.accentOrange, padding: 15, borderRadius: 14, alignItems: "center", marginTop: 10 },
    buttonText: { color: COLORS.white, fontWeight: "bold", fontSize: 16, letterSpacing: 1 },
    googleButton: { marginTop: 15, padding: 14, borderRadius: 14, alignItems: "center", backgroundColor: COLORS.white, borderWidth: 1, borderColor: "#ccc" },
    googleText: { color: "#333", fontWeight: "600" },
    footer: { marginTop: 20, textAlign: "center", color: COLORS.textSecondary },
});