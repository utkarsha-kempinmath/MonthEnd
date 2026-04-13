import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { login } from "../services/authService";
import { saveToken } from "../services/tokenService";
import { COLORS } from "../constants/theme";
import { useGoogleAuth } from "../services/googleAuth";

export default function LoginScreen({ navigation }) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
            justifyContent: "center",
            padding: 20,
        },

        title: {
            fontSize: 28,
            fontWeight: "bold",
            color: COLORS.textDark,
            marginBottom: 20,
        },

        subtitle: {
            fontSize: 14,
            color: COLORS.textLight,
            marginBottom: 30,
        },

        input: {
            backgroundColor: COLORS.input,
            padding: 14,
            borderRadius: 14,
            marginBottom: 15,
        },

        button: {
            backgroundColor: COLORS.primary,
            padding: 15,
            borderRadius: 14,
            alignItems: "center",
            marginTop: 10,
        },

        buttonText: {
            color: COLORS.white,
            fontWeight: "bold",
            fontSize: 16,
        },

        googleButton: {
            marginTop: 15,
            padding: 14,
            borderRadius: 14,
            alignItems: "center",
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: "#ccc",
        },

        googleText: {
            color: COLORS.textDark,
            fontWeight: "600",
        },

        footer: {
            marginTop: 20,
            textAlign: "center",
            color: COLORS.textLight,
        },
    });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { response, promptAsync } = useGoogleAuth();

    useEffect(() => {
        if (response?.type === "success") {
            console.log("Google login success");
        }
    }, [response]);

    const handleLogin = async () => {
        try {
            const res = await login({ email, password });
            await saveToken(res.data.token);

            alert("Welcome back");
        } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Signup failed");
    }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MonthEnd</Text>

            <Text style={styles.subtitle}>
                Understand your money. Not just track it.
            </Text>

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton} onPress={promptAsync}>
                <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.footer}>
                    Don’t have an account? Sign up
                </Text>
            </TouchableOpacity>
        </View>
    );
}