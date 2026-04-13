import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { signup } from "../services/authService";
import { saveToken } from "../services/tokenService";
import { COLORS } from "../constants/theme";
import { useGoogleAuth } from "../services/googleAuth";

export default function SignupScreen({ navigation }) {
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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { response, promptAsync } = useGoogleAuth();

    useEffect(() => {
        if (response?.type === "success") {
            console.log("Google signup success");
        }
    }, [response]);

    const handleSignup = async () => {
    try {
        // Assign the response to 'res'
        const res = await signup({ username: name, email, password });
        
        // Now 'res' exists and can be used
        await saveToken(res.data.token);
        
        console.log("Sending:", {
            username: name,
            email,
            password,
        });

        alert("Account created!");
    } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Signup failed");
    }
};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                placeholder="Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

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

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton} onPress={promptAsync}>
                <Text style={styles.googleText}>Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footer}>
                    Already a user? Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}