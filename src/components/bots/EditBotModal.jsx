import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Alert, useColorScheme } from 'react-native';
import { Portal, Modal, TextInput, Button, Text, IconButton, HelperText } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

const EditBotModal = ({ visible, bot, onDismiss, onUpdate, onDelete }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const [botName, setBotName] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sincronizamos el nombre cuando se abre el modal o cambia el bot
  useEffect(() => {
    if (bot) {
      setBotName(bot.name || bot.custom_name || '');
    }
  }, [bot, visible]);

  const resetForm = () => {
    setBotName(bot?.name || bot?.custom_name || '');
    setError('');
    setTouched(false);
  };

  const validateField = (value) => {
    if (!value.trim()) return 'El nombre del bot es obligatorio';
    if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  };

  const handleNameChange = (value) => {
    setBotName(value);
    if (touched) {
      setError(validateField(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateField(botName));
  };

  const handleSave = async () => {
    const validationError = validateField(botName);
    setError(validationError);
    setTouched(true);

    if (!validationError && bot) {
      try {
        setLoading(true);
        // Llamamos a la función del contexto. Enviamos el ID y el nuevo nombre.
        await onUpdate(bot.bot_id, { custom_name: botName });
        setLoading(false);
        onDismiss();
      } catch (err) {
        setLoading(false);
        console.error("Error al actualizar:", err);
        Alert.alert("Error", "No se pudo actualizar el bot.");
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Bot',
      `¿Estás seguro de que deseas eliminar "${bot?.name || bot?.custom_name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete(bot.bot_id);
              onDismiss();
            } catch (err) {
              console.error("Error al eliminar:", err);
              Alert.alert("Error", "No se pudo eliminar el bot.");
            }
          }
        },
      ]
    );
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={handleDismiss} 
        style={{ 
          backgroundColor: 'rgba(0,0,0,0.7)',
          marginTop: -insets.top,
          marginBottom: -insets.bottom,
        }}
        contentContainerStyle={[
          styles.modalContainer, 
          { 
            backgroundColor: colors.surface,
            marginHorizontal: isWeb ? '35%' : 20 
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <IconButton icon="pencil" size={24} iconColor={colors.primary} />
            <Text style={[styles.title, { color: colors.primary }]}>Editar Bot</Text>
          </View>
          <IconButton 
            icon="close-circle" 
            size={28} 
            onPress={handleDismiss}
            iconColor={colors.textLight}
          />
        </View>

        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Modifica el nombre de tu dispositivo
        </Text>

        <View style={[styles.infoRow, { borderBottomColor: colors.placeholder + '30' }]}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>MAC:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{bot?.mac_address}</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: colors.placeholder + '30' }]}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Estado:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{bot?.status || 'Desconocido'}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Nuevo Nombre
        </Text>
        <TextInput
          label="Nombre del Bot"
          mode="outlined"
          outlineStyle={{ borderRadius: 30 }}
          style={globalStyles.input}
          value={botName}
          onChangeText={handleNameChange}
          onBlur={handleBlur}
          error={touched && !!error}
          left={<TextInput.Icon icon="robot" />}
        />
        <HelperText 
          type={touched && error ? 'error' : 'info'}
          visible={true}
          style={touched && !error && botName.trim() ? { color: '#4CAF50' } : { color: colors.textLight }}
        >
          {touched && error ? error : touched && !error ? 'Nombre válido' : 'Cambia el nombre de tu bot'}
        </HelperText>

        <View style={globalStyles.botonera}>
          <Button 
            mode="contained" 
            onPress={handleSave} 
            style={[globalStyles.button, { flex: 1 }]}
            buttonColor={colors.primary}
            textColor={colors.background}
            contentStyle={styles.buttonContent}
            icon="content-save"
            loading={loading}
            disabled={loading}
          >
            Guardar
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={handleDelete} 
            style={[globalStyles.buttonOutline, { flex: 1, borderColor: colors.error }]}
            textColor={colors.error}
            contentStyle={styles.buttonContent}
            icon="delete"
            disabled={loading}
          >
            Eliminar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { padding: 24, borderRadius: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1 },
  infoLabel: { fontSize: 13, fontWeight: '600' },
  infoValue: { fontSize: 14, fontWeight: '500' },
  sectionTitle: { fontSize: 13, fontWeight: '600', marginBottom: 6, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 },
  buttonContent: { paddingVertical: 6 },
});

export default EditBotModal;