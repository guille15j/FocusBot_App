import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Portal, Modal, TextInput, Button, Text, IconButton, HelperText } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

const formatDateInput = (text) => {
  const cleaned = text.replace(/[^0-9]/g, '').slice(0, 8);
  let result = '';
  if (cleaned.length > 0) result += cleaned.substring(0, 4);
  if (cleaned.length > 4) result += '-' + cleaned.substring(4, 6);
  if (cleaned.length > 6) result += '-' + cleaned.substring(6, 8);
  return result;
};

const formatTimeInput = (text) => {
  const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
  let result = '';
  if (cleaned.length > 0) result += cleaned.substring(0, 2);
  if (cleaned.length > 2) result += ':' + cleaned.substring(2, 4);
  return result;
};

const GenerateRecordModal = ({ visible, onDismiss }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const today = new Date().toISOString().split('T')[0];

  const [initDate, setInitDate] = useState(today);
  const [initTime, setInitTime] = useState('00:00');
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState('23:59');

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const resetForm = () => {
    setInitDate(today);
    setInitTime('00:00');
    setEndDate(today);
    setEndTime('23:59');
    setErrors({});
    setTouched({});
  };

  const validateDate = (value) => {
    if (!value.trim()) return 'Obligatorio';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Formato: YYYY-MM-DD';
    const d = new Date(value + 'T00:00:00');
    if (isNaN(d.getTime())) return 'Fecha inválida';
    return '';
  };

  const validateTime = (value) => {
    if (!value.trim()) return 'Obligatorio';
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return 'Formato: HH:MM (00-23:59)';
    return '';
  };

  const handleChangeInitDate = (text) => {
    const formatted = formatDateInput(text);
    setInitDate(formatted);
    if (touched.initDate) setErrors(prev => ({ ...prev, initDate: validateDate(formatted) }));
  };

  const handleChangeInitTime = (text) => {
    const formatted = formatTimeInput(text);
    setInitTime(formatted);
    if (touched.initTime) setErrors(prev => ({ ...prev, initTime: validateTime(formatted) }));
  };

  const handleChangeEndDate = (text) => {
    const formatted = formatDateInput(text);
    setEndDate(formatted);
    if (touched.endDate) setErrors(prev => ({ ...prev, endDate: validateDate(formatted) }));
  };

  const handleChangeEndTime = (text) => {
    const formatted = formatTimeInput(text);
    setEndTime(formatted);
    if (touched.endTime) setErrors(prev => ({ ...prev, endTime: validateTime(formatted) }));
  };

  const handleGenerate = () => {
    const initDateErr = validateDate(initDate);
    const initTimeErr = validateTime(initTime);
    const endDateErr = validateDate(endDate);
    const endTimeErr = validateTime(endTime);

    setErrors({ initDate: initDateErr, initTime: initTimeErr, endDate: endDateErr, endTime: endTimeErr });
    setTouched({ initDate: true, initTime: true, endDate: true, endTime: true });

    if (initDateErr || initTimeErr || endDateErr || endTimeErr) return;

    const init = new Date(`${initDate}T${initTime}:00`);
    const end = new Date(`${endDate}T${endTime}:00`);
    if (end <= init) {
      Alert.alert('Error', 'La fecha de fin debe ser posterior a la de inicio');
      return;
    }

    Alert.alert(
      'Registro Generado',
      `Rango: ${initDate} ${initTime} - ${endDate} ${endTime}`,
      [{ text: 'Aceptar', onPress: () => { resetForm(); onDismiss(); } }]
    );
  };

  const handleDismiss = () => { resetForm(); onDismiss(); };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', marginTop: -insets.top, marginBottom: -insets.bottom }}
        contentContainerStyle={[styles.modal, { backgroundColor: colors.surface, marginHorizontal: isWeb ? '35%' : 16 }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>Generar Registro</Text>
          <IconButton icon="close-circle" size={28} onPress={handleDismiss} iconColor={colors.textLight} />
        </View>

        <Text style={[styles.sub, { color: colors.textLight }]}>Selecciona el rango de fechas</Text>
        <Text style={[styles.section, { color: colors.text }]}>Fecha de Inicio</Text>

        <TextInput
          label="Fecha (YYYY-MM-DD)"
          mode="outlined"
          outlineStyle={{ borderRadius: 30 }}
          value={initDate}
          onChangeText={handleChangeInitDate}
          onBlur={() => setTouched(prev => ({ ...prev, initDate: true }))}
          error={touched.initDate && !!errors.initDate}
          keyboardType="number-pad"
          maxLength={10}
          left={<TextInput.Icon icon="calendar-start" />}
          style={{ marginBottom: 4 }}
        />
        {touched.initDate && errors.initDate ? <HelperText type="error" visible>{errors.initDate}</HelperText> : null}

        <TextInput
          label="Hora (HH:MM)"
          mode="outlined"
          outlineStyle={{ borderRadius: 30 }}
          value={initTime}
          onChangeText={handleChangeInitTime}
          onBlur={() => setTouched(prev => ({ ...prev, initTime: true }))}
          error={touched.initTime && !!errors.initTime}
          keyboardType="number-pad"
          maxLength={5}
          left={<TextInput.Icon icon="clock-start" />}
          style={{ marginBottom: 4 }}
        />
        {touched.initTime && errors.initTime ? <HelperText type="error" visible>{errors.initTime}</HelperText> : null}

        <Text style={[styles.section, { color: colors.text, marginTop: 20 }]}>Fecha de Fin</Text>

        <TextInput
          label="Fecha (YYYY-MM-DD)"
          mode="outlined"
          outlineStyle={{ borderRadius: 30 }}
          value={endDate}
          onChangeText={handleChangeEndDate}
          onBlur={() => setTouched(prev => ({ ...prev, endDate: true }))}
          error={touched.endDate && !!errors.endDate}
          keyboardType="number-pad"
          maxLength={10}
          left={<TextInput.Icon icon="calendar-end" />}
          style={{ marginBottom: 4 }}
        />
        {touched.endDate && errors.endDate ? <HelperText type="error" visible>{errors.endDate}</HelperText> : null}

        <TextInput
          label="Hora (HH:MM)"
          mode="outlined"
          outlineStyle={{ borderRadius: 30 }}
          value={endTime}
          onChangeText={handleChangeEndTime}
          onBlur={() => setTouched(prev => ({ ...prev, endTime: true }))}
          error={touched.endTime && !!errors.endTime}
          keyboardType="number-pad"
          maxLength={5}
          left={<TextInput.Icon icon="clock-end" />}
          style={{ marginBottom: 4 }}
        />
        {touched.endTime && errors.endTime ? <HelperText type="error" visible>{errors.endTime}</HelperText> : null}

        <Button
          mode="contained"
          onPress={handleGenerate}
          style={[globalStyles.button, { marginTop: 24 }]}
          buttonColor={colors.primary}
          textColor={colors.background}
          icon="calculator"
        >
          Calcular y Guardar
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: { padding: 24, borderRadius: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 'bold' },
  sub: { fontSize: 13, marginBottom: 20 },
  section: { fontSize: 13, fontWeight: '600', marginBottom: 6, opacity: 0.7 },
});

export default GenerateRecordModal;