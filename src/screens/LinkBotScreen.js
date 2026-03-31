import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
import { authStorage } from '../services/authStorage';
import { AuthService } from '../services/apiService';

export default function RegisterScreen({ navigation }) {

    return (
        <View style={styles.fullScreen}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Avatar.Icon size={64} icon="brain" style={styles.icon} />
                        <Text style={styles.title}>FocusBot</Text>
                        <Text style={styles.subtitle}>
                            Registro de Nuevo Bot
                        </Text>
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