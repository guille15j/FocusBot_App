import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
import { authStorage } from '../services/authStorage';
import { AuthService } from '../services/apiService';
import { AuthContext } from '../services/AuthContext'; // contexto de la aplicacion

import { globalStyles } from '../theme/theme';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn } = React.useContext(AuthContext);

    const ejecutarLogin = async () => {
        if (!email || !password) {
            Alert.alert("Atención", "Por favor, introduce tus credenciales");
            return;
        }

        setLoading(true);
        try {
            const data = await AuthService.login(email, password);
            if (data && data.token) {
                console.log("Token recibido:", data.token);
                await authStorage.saveToken(data.token);
                console.log("¡Token guardado con éxito!");
                // navigation.replace('Home'); 

                signIn(data.token); //avisamos a App.js del cambio para que represente lo que toque
            }else{
                throw new Error("El servidor no devolvió un token válido");
            }
            
        } catch (error) {
            Alert.alert("Error de acceso", error.message);
        } finally {
            setLoading(false);
        }
    };

    const ejecutarRegistro = async () => {
        navigation.replace('Register');
    };

    const ejecutarReset = async () => {
        navigation.replace('Reset');
    };

    return (
        <View style={globalStyles.fullScreen}>
            <Card style={globalStyles.card}>
                <Card.Content>
                    <View style={globalStyles.header}>
                        <Avatar.Icon size={64} icon="robot" style={globalStyles.icon} />
                        <Text style={globalStyles.title}>FocusBot</Text>
                        <Text style={globalStyles.subtitle}>Deep Focus Manager</Text>
                    </View>
                    
                    <TextInput
                        label="Email o Usuario"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={globalStyles.input}
                        outlineStyle = {globalStyles.border_radius}
                    />
                    
                    <TextInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        style={globalStyles.input}
                        outlineStyle = {globalStyles.border_radius}
                    />
                    
                    <TouchableOpacity 
                            onPress={ejecutarReset} style={globalStyles.link}>
                        <Text style={globalStyles.linkText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <View style={globalStyles.botonera}>
                        <Button 
                            mode="contained" 
                            onPress={ejecutarLogin}
                            loading={loading}
                            disabled={loading}
                            style={globalStyles.button}
                        >
                            Iniciar Sesión
                        </Button>
                        
                        <Button 
                            mode="outlined" 
                            onPress={ejecutarRegistro}
                            loading={loading}
                            disabled={loading}
                            style={globalStyles.button}
                        >
                            Registrarme
                        </Button>
                    </View>
                    
                </Card.Content>
            </Card>
        </View>
    );
}

