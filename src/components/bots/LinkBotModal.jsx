import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Portal, Modal, TextInput, Button, Text, IconButton, HelperText } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MacAddressInput from '../forms/MACInput';

const LinkBotModal = ({ visible, onDismiss, colors, globalStyles, isWeb }) => {
    const insets = useSafeAreaInsets();
    const [macAddress, setMacAddress] = useState('');
    const [botName, setBotName] = useState('FocusBot');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const resetForm = () => {
        setMacAddress('');
        setBotName('FocusBot');
        setErrors({});
        setTouched({});
    };

    const validateField = (field, value) => {
        const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
        
        if (field === 'mac') {
            if (!value.trim()) return 'La dirección MAC es obligatoria';
            if (!macRegex.test(value)) return 'Introduce una MAC válida de 6 pares (ej: 00:1A:2B:3C:4D:5E)';
        }
        
        if (field === 'name') {
            if (!value.trim()) return 'El nombre del bot es obligatorio';
            if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
        }
        
        return '';
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const value = field === 'mac' ? macAddress : botName;
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleMacChange = (value) => {
        setMacAddress(value);
        if (touched.mac) {
            const error = validateField('mac', value);
            setErrors(prev => ({ ...prev, mac: error }));
        }
    };

    const handleNameChange = (value) => {
        setBotName(value);
        if (touched.name) {
            const error = validateField('name', value);
            setErrors(prev => ({ ...prev, name: error }));
        }
    };

    const validateForm = () => {
        const macError = validateField('mac', macAddress);
        const nameError = validateField('name', botName);
        
        setErrors({ mac: macError, name: nameError });
        setTouched({ mac: true, name: true });
        
        return !macError && !nameError;
    };

    const handleLink = () => {
        if (validateForm()) {
        Alert.alert(
            'Bot Vinculado',
            `"${botName}" se ha conectado correctamente.\n\nMAC: ${macAddress.toUpperCase()}`,
            [{ text: 'Aceptar', onPress: () => { resetForm(); onDismiss(); } }]
        );
        }
    };

    const handleDismiss = () => {
        resetForm();
        onDismiss();
    };

    const getMacHelperText = () => {
        if (touched.mac && !errors.mac) return 'Formato válido';
        return 'Formato: 00:1A:2B:3C:4D:5E';
    };

    return (
        <Portal>
        <Modal 
            visible={visible} 
            onDismiss={handleDismiss} 
            style={{ 
                backgroundColor: 'rgba(0,0,0,0.7)',
                marginTop: -insets.top,
                marginBottom: -insets.bottom,}
            }
            contentContainerStyle={[
            styles.modalContainer, 
            { backgroundColor: colors.background, marginHorizontal: isWeb? '35%' : 20}
            ]}
        >
            <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={[styles.title, { color: colors.primary }]}>Vincular Nuevo Bot</Text>
            </View>
            <IconButton 
                icon="close-circle" 
                size={28} 
                onPress={handleDismiss}
                iconColor={colors.textLight}
            />
            </View>

            <Text style={styles.subtitle}>
            Introduce los datos de tu dispositivo FocusBot
            </Text>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Dirección MAC</Text>
            <MacAddressInput
            value={macAddress}
            onChange={handleMacChange}
            />
            <HelperText 
            type={touched.mac && errors.mac ? 'error' : 'info'}
            visible={true}
            style={touched.mac && !errors.mac ? { color: '#4CAF50' } : {}}
            >
            {touched.mac && errors.mac ? errors.mac : getMacHelperText()}
            </HelperText>

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>
            Nombre del Dispositivo
            </Text>
            <TextInput
            label="Nombre del Bot"
            mode="outlined"
            outlineStyle={{ borderRadius: 30 }}
            style={styles.input}
            value={botName}
            onChangeText={handleNameChange}
            onBlur={() => handleBlur('name')}
            error={touched.name && !!errors.name}
            left={<TextInput.Icon icon="robot" />}
            />
            <HelperText 
            type={touched.name && errors.name ? 'error' : 'info'}
            visible={true}
            style={touched.name && !errors.name && botName.trim() ? { color: '#4CAF50' } : {}}
            >
            {touched.name && errors.name ? errors.name : touched.name && !errors.name ? '✅ Nombre válido' : 'Asigna un nombre a tu bot'}
            </HelperText>

            <Button 
            mode="contained" 
            onPress={handleLink} 
            style={styles.button}
            buttonColor={colors.primary}
            textColor={colors.background}
            contentStyle={styles.buttonContent}
            icon="link-variant"
            >
            Vincular Dispositivo
            </Button>
        </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        margin: 20,
        padding: 24,
        borderRadius: 24,
        
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        fontSize: 28,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 13,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        opacity: 0.6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        marginTop: 4,
    },
    button: {
        marginTop: 24,
        borderRadius: 30,
    },
    buttonContent: {
        paddingVertical: 6,
    },
});

export default LinkBotModal;