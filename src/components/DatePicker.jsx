import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Modal, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Importamos tus estilos y colores
import { globalStyles, AppColors } from '../theme/theme';

const DatePicker = ({ label, mode = 'date', value, onChange }) => {
  const [show, setShow] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  
  // Estado temporal para iOS (permite cancelar sin aplicar cambios)
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
      // En iOS solo actualizamos el valor temporal mientras el modal está abierto
      setTempDate(currentDate);
    }
  };

    const showPicker = () => {
        if (Platform.OS === 'ios') {
            setTempDate(value instanceof Date ? value : new Date());
            setCurrentMode(mode); // En iOS mantenemos el modo original (date o datetime)
        }
        
        setShow(true);

        if (Platform.OS === 'android') {
            if (mode === 'datetime') {
                setCurrentMode('date'); // Android requiere paso a paso
            } else {
                setCurrentMode(mode);
            }
        }
    };

  // Confirmación manual para iOS
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
      {/* Usamos el estilo de etiqueta de tu globalStyles */}
      {label && <Text style={globalStyles.subtitle}>{label}</Text>}
      
      <Pressable 
        style={({ pressed }) => [
          styles.input, 
          globalStyles.border_radius, 
          pressed && styles.pressed
        ]} 
        onPress={showPicker}
      >
        <Text style={styles.textValue}>{formatDisplay(value)}</Text>
      </Pressable>

      {/* LÓGICA IOS: Envoltorio en Modal para evitar desbordamiento */}
      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Button title="Cancelar" color={AppColors.error} onPress={() => setShow(false)} />
                <Text style={styles.modalTitle}>Seleccionar</Text>
                <Button title="Hecho" color={AppColors.primary} onPress={confirmIOS} />
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

      {/* LÓGICA ANDROID: Lanzamiento directo */}
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
    marginVertical: 5,
    width: '100%',
  },
  input: {
    height: 55,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: AppColors.primary, // Mantiene el color de tu tema
    backgroundColor: 'white', 
    justifyContent: 'center',
    marginTop: 5,
  },
  pressed: {
    backgroundColor: '#F9F9F9',
    opacity: 0.8,
  },
  textValue: {
    fontSize: 16,
    color: AppColors.text,
  },
  // Estilos del Modal para iOS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: AppColors.text,
  }
});

export default DatePicker;