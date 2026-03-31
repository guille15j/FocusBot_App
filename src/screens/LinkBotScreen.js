import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';

import { globalStyles } from '../theme/theme';

export default function RegisterScreen({ navigation }) {

    return (
        <View style={globalStyles.fullScreen}>
            <Card style={globalStyles.card}>
                <Card.Content>
                    <View style={globalStyles.header}>
                        <Avatar.Icon size={64} icon="brain" style={globalStyles.icon} />
                        <Text style={globalStyles.title}>FocusBot</Text>
                        <Text style={globalStyles.subtitle}>
                            Registro de Nuevo Bot
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}
