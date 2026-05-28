import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Portal, Modal, Button, Text, IconButton, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { getColors } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from '../../context/ToastContext';

const GenerateRecordModal = ({ visible, onDismiss, onGenerate }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  
  const { isWeb, platform } = useResponsiveLayout();
  const DateTimePicker = !isWeb ? require('@react-native-community/datetimepicker').default : null;

  const showToast = useToast();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  const [showPicker, setShowPicker] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeNative = (event, selectedDate) => {
    if (event.type === 'dismissed' || !selectedDate) {
      setShowPicker(null);
      return;
    }

    if (showPicker === 'start_date') {
      const updated = new Date(startDate);
      updated.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setStartDate(updated);
      setShowPicker('start_time');
    } else if (showPicker === 'start_time') {
      const updated = new Date(startDate);
      updated.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setStartDate(updated);
      setShowPicker(null);
    } else if (showPicker === 'end_date') {
      const updated = new Date(endDate);
      updated.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setEndDate(updated);
      setShowPicker('end_time');
    } else if (showPicker === 'end_time') {
      const updated = new Date(endDate);
      updated.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setEndDate(updated);
      setShowPicker(null);
    }
  };

  const onChangeWeb = (type, value) => {
    if (!value) return;
    const selectedDate = new Date(value);
    if (type === 'start') setStartDate(selectedDate);
    if (type === 'end') setEndDate(selectedDate);
  };

  const handleGenerate = async () => {
    if (startDate >= endDate) {
      showToast('La fecha de inicio debe ser anterior a la de fin.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onGenerate(startDate.toISOString(), endDate.toISOString());
      
      if (result && (result.success || result.status === 200 || result.status === 201 || result.id)) {
        onDismiss();
      } else {
        onDismiss();
      }
    } catch (error) {
      showToast('Ocurrió un problema al procesar el reporte.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toHTML5DateTimeString = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const DateSelector = ({ label, date, type }) => {
    const formattedText = date.toLocaleString('es-ES', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });

    if (isWeb) {
      return (
        <View style={styles.selectorContainer}>
          <Text style={[styles.label, { color: colors.textLight }]}>{label}</Text>
          <input
            type="datetime-local"
            value={toHTML5DateTimeString(date)}
            max={toHTML5DateTimeString(new Date())}
            onChange={(e) => onChangeWeb(type, e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              border: `1px solid ${colors.border || 'rgba(0,0,0,0.12)'}`,
              backgroundColor: colors.background,
              color: colors.text,
              fontFamily: 'inherit',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.selectorContainer}>
        <Text style={[styles.label, { color: colors.textLight }]}>{label}</Text>
        <Surface style={[styles.surface, { backgroundColor: colors.background }]} elevation={0}>
          <Pressable 
            onPress={() => setShowPicker(type === 'start' ? 'start_date' : 'end_date')} 
            style={styles.pressable}
          >
            <MaterialCommunityIcons 
              name={type === 'start' ? "calendar-import" : "calendar-export"} 
              size={20} 
              color={colors.primary} 
            />
            <Text style={[styles.dateText, { color: colors.text }]}>{formattedText}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textLight} />
          </Pressable>
        </Surface>
      </View>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal, 
          { backgroundColor: colors.surface, marginBottom: insets.bottom + 20 }
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>Generar Registro</Text>
          <IconButton icon="close-circle" size={24} iconColor={colors.placeholder} onPress={onDismiss} />
        </View>

        <Text style={[styles.description, { color: colors.textLight }]}>
          Elige el intervalo de tiempo para calcular tus estadísticas.
        </Text>

        <DateSelector label="DESDE" date={startDate} type="start" />
        <DateSelector label="HASTA" date={endDate} type="end" />

        {!isWeb && showPicker && DateTimePicker && (
          <DateTimePicker
            value={showPicker.startsWith('start') ? startDate : endDate}
            mode={showPicker.endsWith('date') ? 'date' : 'time'}
            display={platform === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeNative}
            maximumDate={new Date()}
          />
        )}

        <Button
          mode="contained"
          icon= 'content-save'
          onPress={handleGenerate}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={[styles.btn, {color: colors.text}]}
          contentStyle={{ height: 50 }}
          textColor= {colors.surface}
        >
          Calcular Informe
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: { margin: 20,
    padding: 24, 
    borderRadius: 28, 
    maxWidth: 500, 
    alignSelf: 'center', 
    width: Platform.OS === 'web' ? '100%' : 'auto' 
  },
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