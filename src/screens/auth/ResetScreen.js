import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';

import { globalStyles } from '../../theme/theme';

export default function ResetScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const ejecutarCambio = async () => {
        console.log("Remplazo de contrasña")
    };

    const volver = async () => {
        navigation.replace('Login');
    };

    return (
        <View style={globalStyles.fullScreen}>
            <Card style={globalStyles.card}>
                <Card.Content>
                    <View style={globalStyles.header}>
                        <Avatar.Icon size={64} icon="robot" style={globalStyles.icon} /><Text style={globalStyles.title}>FocusBot</Text>
                        <Text style={globalStyles.subtitle}>
                            Reseto de contraseña
                        </Text>

                        
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
                        label="Nueva Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        style={globalStyles.input}
                        outlineStyle = {globalStyles.border_radius}
                    />

                    <TextInput
                        label="Repetir Contraseña"
                        value={password2}
                        onChangeText={setPassword2}
                        mode="outlined"
                        secureTextEntry
                        style={globalStyles.input}
                        outlineStyle = {globalStyles.border_radius}
                    />

                    <View style={globalStyles.botonera}>
                        <Button 
                            mode="contained" 
                            onPress={ejecutarCambio}
                            style={globalStyles.button}
                        >
                            Restablecer
                        </Button>
                        
                        <Button 
                            mode="outlined" 
                            onPress={volver}
                            style={globalStyles.button}
                        >
                            Cancelar
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}
