// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
import { AuthService } from '../services/apiService';
import { Link } from '@react-navigation/native';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const ejecutarLogin = async () => {
        if (!email || !password) {
            Alert.alert("Atención", "Por favor, introduce tus credenciales");
            return;
        }

        setLoading(true);
        try {
            const data = await AuthService.login(email, password);
            
            console.log("Token recibido:", data.token);

            navigation.replace('Home'); 
            
        } catch (error) {
            Alert.alert("Error de acceso", error.message);
        } finally {
            setLoading(false);
        }
    };

    const ejecutarRegistro = async () => {
        
    };


    return (
        <View style={styles.fullScreen}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Avatar.Icon size={64} icon="brain" style={styles.icon} />
                        <Text style={styles.title}>FocusBot</Text>
                        <Text style={styles.subtitle}>Deep Focus Manager</Text>
                    </View>
                    
                    <TextInput
                        label="Correo Electrónico"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    
                    <TextInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                    />
                    
                    
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>

                    <View style={styles.botonera}>
                        <Button 
                            mode="contained" 
                            onPress={ejecutarLogin}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                        >
                            Iniciar Sesión
                        </Button>

                        <Button 
                            mode="contained" 
                            onPress={ejecutarRegistro}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                        >
                            Registrarme
                        </Button>
                    </View>
                    
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f2f5' },
    card: { elevation: 4, borderRadius: 12 },
    header: { alignItems: 'center', marginBottom: 20 },
    icon: { backgroundColor: '#6200ee', marginBottom: 10 },
    title: { fontSize: 28, fontWeight: 'bold' },
    subtitle: { color: '#666' },
    input: { marginBottom: 15 },
    button: { marginTop: 10, paddingVertical: 5, flex: 1 },
    botonera: {flexDirection: 'row', gap: 10,marginTop: 10 },
    link: {flex: 1,textAlign: 'center', marginTop: 15, justifyContent: 'center', fontSize: 16 }
});