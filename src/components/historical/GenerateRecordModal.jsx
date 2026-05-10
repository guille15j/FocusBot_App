import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Alert, Pressable, Platform } from 'react-native';
import { Portal, Modal, Button, Text, IconButton, Surface } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'; // Necesitas instalar esto
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { getColors } from '../../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GenerateRecordModal = ({ visible, onDismiss, onGenerate }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(null); // 'start' | 'end' | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(null); // Cerrar el picker
    if (selectedDate) {
      if (showPicker === 'start') setStartDate(selectedDate);
      if (showPicker === 'end') setEndDate(selectedDate);
    }
  };

  const handleGenerate = async () => {
    if (startDate >= endDate) {
      Alert.alert("Rango Inválido", "La fecha de inicio debe ser anterior a la de fin.");
      return;
    }

    setIsSubmitting(true);
    // Convertimos a ISO para tu API de Python
    const result = await onGenerate(startDate.toISOString(), endDate.toISOString());
    setIsSubmitting(false);
    
    if (result.success) onDismiss();
  };

  const DateSelector = ({ label, date, onPress, icon }) => (
    <View style={styles.selectorContainer}>
      <Text style={[styles.label, { color: colors.textLight }]}>{label}</Text>
      <Surface style={[styles.surface, { backgroundColor: colors.background }]} elevation={0}>
        <Pressable onPress={onPress} style={styles.pressable}>
          <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {date.toLocaleString('es-ES', { 
              day: '2-digit', month: '2-digit', year: 'numeric', 
              hour: '2-digit', minute: '2-digit' 
            })}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textLight} />
        </Pressable>
      </Surface>
    </View>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: colors.surface, marginBottom: insets.bottom + 20 }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>Generar Registro</Text>
          <IconButton icon="close-circle" size={24} onPress={onDismiss} />
        </View>

        <Text style={[styles.description, { color: colors.textLight }]}>
          Elige el intervalo de tiempo para calcular tus estadísticas.
        </Text>

        <DateSelector 
          label="DESDE" 
          date={startDate} 
          icon="calendar-import"
          onPress={() => setShowPicker('start')} 
        />

        <DateSelector 
          label="HASTA" 
          date={endDate} 
          icon="calendar-export"
          onPress={() => setShowPicker('end')} 
        />

        {showPicker && (
          <DateTimePicker
            value={showPicker === 'start' ? startDate : endDate}
            mode="datetime" // Permite elegir fecha y hora
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            maximumDate={new Date()} // No permitir fechas futuras
          />
        )}

        <Button
          mode="contained"
          onPress={handleGenerate}
          loading={isSubmitting}
          style={styles.btn}
          contentStyle={{ height: 50 }}
        >
          Calcular Informe
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: { margin: 20, padding: 24, borderRadius: 28 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold' },
  description: { fontSize: 14, marginBottom: 25, lineHeight: 20 },
  selectorContainer: { marginBottom: 18 },
  label: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  surface: { borderRadius: 16, overflow: 'hidden' },
  pressable: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  dateText: { flex: 1, fontSize: 15, fontWeight: '500' },
  btn: { marginTop: 10, borderRadius: 16 },
});

export default GenerateRecordModal;