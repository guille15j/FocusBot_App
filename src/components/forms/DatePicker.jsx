import React, { useState, useMemo } from 'react';
import { 
  View, 
  Platform, 
  Text, 
  Pressable, 
  Modal, 
  StyleSheet, 
  Button as RNButton,
  useColorScheme 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getColors } from '../../theme/theme';

const DatePicker = ({ label, mode = 'date', value, onChange }) => {
  const scheme = useColorScheme();
  const AppColors = useMemo(() => getColors(scheme), [scheme]);

  const [show, setShow] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [tempDate, setTempDate] = useState(value instanceof Date ? value : new Date());

  const handleOnChange = (event, selectedDate) => {
    if (event.type === 'dismissed' && Platform.OS === 'android') {
      setShow(false);
      setCurrentMode(mode);
      return;
    }

    const currentDate = selectedDate || value;

    if (Platform.OS === 'android') {
      if (mode === 'datetime' && currentMode === 'date') {
        setCurrentMode('time');
        onChange(currentDate);
      } else {
        setShow(false);
        setCurrentMode(mode);
        onChange(currentDate);
      }
    } else {
      setTempDate(currentDate);
    }
  };

  const showPicker = () => {
    if (Platform.OS === 'ios') {
      setTempDate(value instanceof Date ? value : new Date());
      setCurrentMode(mode);
    }
    setShow(true);

    if (Platform.OS === 'android' && mode === 'datetime') {
      setCurrentMode('date');
    }
  };

  const confirmIOS = () => {
    onChange(tempDate);
    setShow(false);
  };

  const formatDisplay = (date) => {
    if (!date) return 'Seleccionar...';
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };

    if (mode === 'date') return date.toLocaleDateString('es-ES', optionsDate);
    return `${date.toLocaleDateString('es-ES', optionsDate)} ${date.toLocaleTimeString('es-ES', optionsTime)}`;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: AppColors.text }]}>
          {label}
        </Text>
      )}
      
      <Pressable 
        style={({ pressed }) => [
          styles.input, 
          { 
            borderColor: AppColors.outline || AppColors.primary,
            backgroundColor: scheme === 'dark' ? '#1E1E1E' : 'white',
            opacity: pressed ? 0.7 : 1 
          }
        ]} 
        onPress={showPicker}
      >
        <Text style={{ color: AppColors.text, fontSize: 16 }}>
          {formatDisplay(value)}
        </Text>
      </Pressable>

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: scheme === 'dark' ? '#2C2C2C' : 'white' }]}>
              <View style={styles.modalHeader}>
                <RNButton 
                  title="Cancelar" 
                  color={AppColors.error || '#FF5252'} 
                  onPress={() => setShow(false)} 
                />
                <Text style={{ color: AppColors.text, fontWeight: 'bold', fontSize: 17 }}>
                  Seleccionar
                </Text>
                <RNButton 
                  title="Hecho" 
                  color={AppColors.primary} 
                  onPress={confirmIOS} 
                />
              </View>
              <DateTimePicker
                value={tempDate}
                mode={currentMode}
                is24Hour={true}
                display="spinner"
                onChange={handleOnChange}
                textColor={AppColors.text}
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={value instanceof Date ? value : new Date()}
          mode={currentMode === 'datetime' ? 'date' : currentMode}
          is24Hour={true}
          display="default"
          onChange={handleOnChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
    marginLeft: 4,
  },
  input: {
    height: 55,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.3)',
  },
});

export default DatePicker;