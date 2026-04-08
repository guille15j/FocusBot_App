import React, { useState, useContext } from 'react';
import { View, Alert, ScrollView} from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
import DatePicker from '../components/DatePicker';

import { AuthService } from '../services/apiService';
import { authStorage } from '../services/authStorage';
import { AuthContext } from '../services/AuthContext'; // Importamos el contexto
import { globalStyles } from '../theme/theme';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [nickname, setNickname] = useState('');
    const [birthdate, setBthdate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const { signIn } = useContext(AuthContext);


    const ejecutarRegistro = async () => {
        // 1. Validación local
        if (!email || !password || !firstName || !lastName || !nickname) {
            Alert.alert("Atención", "Por favor, completa todos los campos obligatorios.");
            return;
        }

        setLoading(true);

        try {
            // 2. Preparar datos para el backend (nombres exactos de las keys de Flask)
            const userData = {
                first_name: firstName,
                last_name: lastName,
                nickname: nickname,
                email: email.toLowerCase().trim(),
                birth_date: birthdate.toISOString().split('T')[0], // Formato YYYY-MM-DD
                password: password,
                phone: "",
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                profile_img: ""
            };

            // 3. Llamada al servicio
            const data = await AuthService.register(userData);

            if (data && data.token) {
                console.log("Registro exitoso y token recibido");
                
                // 4. Guardar token y avisar al contexto (Auto-login)
                await authStorage.saveToken(data.token);
                Alert.alert("¡Bienvenido!", "Cuenta creada correctamente.");
                
                signIn(data.token); 
            } else {
                throw new Error("El servidor no devolvió un token tras el registro");
            }

        } catch (error) {
            // 5. El error aquí ya trae el mensaje de Flask gracias a la corrección de fetchApi
            Alert.alert("Error de registro", error.message);
        } finally {
            setLoading(false);
        }
    };
    const volver = async () => {
        navigation.replace('Login');
    };

    return (
        <View style={globalStyles.fullScreen}>
            <Card style={globalStyles.card}>
                <View style={globalStyles.header}>
                        <Avatar.Icon size={64} icon="robot" style={globalStyles.icon} /><Text style={globalStyles.title}>FocusBot</Text>
                        <Text style={globalStyles.subtitle}>
                            Registro de Nuevo Usuario
                        </Text>
                    </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    
                <Card.Content>
                    
                <TextInput
                        label="Usuario"
                        value={nickname}
                        onChangeText={setNickname}
                        mode="outlined"
                        style={globalStyles.input}
                        outlineStyle = {globalStyles.border_radius}
                    />

                    <TextInput
                        label="Nombre"
                        value={firstName}
                        onChangeText={setfirstName}
                        mode="outlined"
                        style={globalStyles.input}
                        outlineStyle = {globalStyles.border_radius}
                    />

                    <TextInput
                        label="Apellidos"
                        value={lastName}
                        onChangeText={setlastName}
                        mode="outlined"
                        style={globalStyles.input}
                        outlineStyle = {globalStyles.border_radius}
                    />

                    <TextInput
                        label="Email"
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

                    <DatePicker
                            label="Fecha de Nacimiento"
                            mode="date"
                            value={birthdate}
                            onChange={(val) => setBthdate(val)}
                        />            

                    
                </Card.Content>
                </ScrollView>

                <View style={globalStyles.botonera}>
                        <Button 
                            mode="contained" 
                            onPress={ejecutarRegistro}
                            style={globalStyles.button}
                        >
                            Registrar
                        </Button>
                        
                        <Button 
                            mode="outlined" 
                            onPress={volver}
                            style={globalStyles.button}
                        >
                            Cancelar
                        </Button>
                    </View>
            </Card>
        </View>
    );
}
