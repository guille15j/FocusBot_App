import React, { useState } from 'react';
import { View} from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
// En src/screens/RegisterScreen.js
import DatePicker from '../components/DatePicker';

import { globalStyles } from '../theme/theme';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [nickname, setNickname] = useState('');
    const [birthdate, setBthdate] = useState(new Date());

    const [fullTimestamp, setFullTimestamp] = useState(new Date());


    const ejecutarRegistro = async () => {
        console.log("Registrando")
    };

    const volver = async () => {
        navigation.replace('Login');
    };

    return (
        <View style={globalStyles.fullScreen}>
            <Card style={globalStyles.card}>
                <Card.Content>
                    <View style={globalStyles.header}>
                        <Avatar.Icon size={64} icon="brain" style={globalStyles.icon} />
                        <Text style={globalStyles.title}>FocusBot</Text>
                        <Text style={globalStyles.subtitle}>
                            Registro de Nuevo Usuario
                        </Text>
                    </View>

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

                    <DatePicker
                        label="Selecciona Fecha y Hora (Timestamp)"
                        mode="datetime"
                        value={fullTimestamp} // Usamos el nuevo estado
                        onChange={(val) => setFullTimestamp(val)} // Cambiado de setTimestamp a setFullTimestamp
                    />



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
                </Card.Content>
            </Card>
        </View>
    );
}
