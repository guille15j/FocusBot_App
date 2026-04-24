import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Alert, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, IconButton, Menu, TouchableRipple, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import BotCarousel from '../../components/bots/BotCarrusel';

const BOTS_DATA = [
  { bot_id: "BOT001", name: "FocusBot Alpha", ssid: "FocusNet_Alpha", mac_address: "00:1A:7D:DA:71:13", status: "IDLE", version: "1.2.3", last_sync: "2026-04-17T19:45:00" },
  { bot_id: "BOT002", name: "FocusBot Beta", ssid: "FocusNet_Beta", mac_address: "00:1A:7D:DA:71:14", status: "OFFLINE", version: "1.2.3", last_sync: "2026-04-17T19:50:00" },
  { bot_id: "BOT003", name: "FocusBot Gamma", ssid: "FocusNet_Gamma", mac_address: "00:1A:7D:DA:71:15", status: "FOCUSING", version: "1.2.3", last_sync: "2026-04-17T19:55:00" },
  { bot_id: "BOT004", name: "FocusBot Delta", ssid: "FocusNet_Delta", mac_address: "00:1A:7D:DA:71:16", status: "IDLE", version: "1.2.4", last_sync: "2026-04-17T20:00:00" },
  { bot_id: "BOT005", name: "FocusBot Epsilon", ssid: "FocusNet_Epsilon", mac_address: "00:1A:7D:DA:71:17", status: "OFFLINE", version: "1.2.4", last_sync: "2026-04-17T20:05:00" },
];

const CATEGORY_LIST = [
  { label: 'Deporte', value: 'DEPORTES', icon: 'dumbbell', color: '#FFD54F' },
  { label: 'Lectura', value: 'LECTURA', icon: 'book-open-variant', color: '#FF8A65' },
  { label: 'Estudio', value: 'ESTUDIOS', icon: 'school', color: '#81C784' },
  { label: 'Descanso', value: 'DESCANSO', icon: 'weather-night', color: '#9575CD' },
  { label: 'Hogar', value: 'HOGAR', icon: 'home', color: '#F06292' },
  { label: 'Otros', value: 'OTRAS', icon: 'dots-horizontal', color: '#BDBDBD' },
];

const ACTIVITY_TYPE_LIST = [
  { label: 'Pomodoro', value: 'POMODORO', icon: 'timer', color: '#EF5350' },
  { label: 'Hito', value: 'HITO', icon: 'flag', color: '#FFA726' },
  { label: 'Temporizador', value: 'TEMPORIZADOR', icon: 'timer-sand', color: '#42A5F5' },
  { label: 'Libre', value: 'LIBRE', icon: 'infinity', color: '#66BB6A' },
];

export default function CreateActivityScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const activity = route?.params?.activity || null;
  const isEditing = activity !== null;

  const [selectedBot, setSelectedBot] = useState(activity?.bot_id || null);
  const [title, setTitle] = useState(activity?.title || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [category, setCategory] = useState(activity?.category || '');
  const [activityType, setActivityType] = useState('');

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const [focusTime, setFocusTime] = useState('25');
  const [shortBreak, setShortBreak] = useState('5');
  const [longBreak, setLongBreak] = useState('15');
  const [cyclesBeforeLong, setCyclesBeforeLong] = useState('4');

  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('25');
  const [timerSeconds, setTimerSeconds] = useState('00');

  const [hitos, setHitos] = useState([{ nombre: '', descripcion: '' }]);

  const selectedCategory = CATEGORY_LIST.find(c => c.value === category);
  const selectedType = ACTIVITY_TYPE_LIST.find(t => t.value === activityType);

  const addHito = () => {
    if (hitos.length < 10) {
      setHitos([...hitos, { nombre: '', descripcion: '' }]);
    }
  };

  const removeHito = (index) => {
    if (hitos.length > 1) {
      setHitos(hitos.filter((_, i) => i !== index));
    }
  };

  const updateHito = (index, field, value) => {
    const newHitos = [...hitos];
    newHitos[index][field] = value;
    setHitos(newHitos);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Selecciona una categoría');
      return;
    }
    if (!activityType) {
      Alert.alert('Error', 'Selecciona un tipo de actividad');
      return;
    }
    Alert.alert(
      isEditing ? 'Actividad Actualizada' : 'Actividad Creada',
      `La actividad "${title}" se ha ${isEditing ? 'actualizado' : 'creado'} correctamente.`,
      [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScreenWrapper withScroll={true}>
      <View style={[isWeb ? globalStyles.container_web : globalStyles.container_movil, { flex: 1, minHeight: 0 }]}>
        
        <View style={[styles.header, { borderBottomColor: colors.placeholder + '30' }]}>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} iconColor={colors.text} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isEditing ? 'Editar Actividad' : 'Nueva Actividad'}
          </Text>
          <View style={{ width: 48 }} />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            
            <Text style={[styles.label, { color: colors.textLight, marginTop: 20 }]}>SELECCIONAR BOT</Text>
            <BotCarousel 
              bots={BOTS_DATA} 
              selectedBot={selectedBot}
              onBotPress={(bot) => setSelectedBot(bot.bot_id)}
              globalStyles={globalStyles}
              colors={colors}
            />

            <Text style={[styles.label, { color: colors.textLight, marginTop: 24 }]}>NOMBRE DE LA ACTIVIDAD</Text>
            <TextInput
              label="Título"
              mode="outlined"
              outlineStyle={{ borderRadius: 30 }}
              style={globalStyles.input}
              value={title}
              onChangeText={setTitle}
              left={<TextInput.Icon icon="format-title" />}
            />

            <Text style={[styles.label, { color: colors.textLight, marginTop: 24 }]}>CATEGORÍA</Text>
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <TouchableRipple 
                  onPress={() => setCategoryMenuVisible(true)} 
                  style={[styles.dropdown, { backgroundColor: selectedCategory ? selectedCategory.color + '20' : colors.surface, borderColor: selectedCategory ? selectedCategory.color : colors.placeholder + '40' }]}
                >
                  <View style={styles.dropdownContent}>
                    {selectedCategory && <MaterialCommunityIcons name={selectedCategory.icon} size={20} color={selectedCategory.color} style={{ marginRight: 8 }} />}
                    <Text style={{ color: selectedCategory ? selectedCategory.color : colors.placeholder, fontSize: 16, fontWeight: selectedCategory ? '600' : 'normal' }}>
                      {selectedCategory ? selectedCategory.label : 'Seleccionar categoría'}
                    </Text>
                  </View>
                </TouchableRipple>
              }
            >
              {CATEGORY_LIST.map((item) => (
                <Menu.Item key={item.value} title={item.label} leadingIcon={() => <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />} onPress={() => { setCategory(item.value); setCategoryMenuVisible(false); }} />
              ))}
            </Menu>

            <Text style={[styles.label, { color: colors.textLight, marginTop: 24 }]}>TIPO DE ACTIVIDAD</Text>
            <Menu
              visible={typeMenuVisible}
              onDismiss={() => setTypeMenuVisible(false)}
              anchor={
                <TouchableRipple 
                  onPress={() => setTypeMenuVisible(true)} 
                  style={[styles.dropdown, { backgroundColor: selectedType ? selectedType.color + '20' : colors.surface, borderColor: selectedType ? selectedType.color : colors.placeholder + '40' }]}
                >
                  <View style={styles.dropdownContent}>
                    {selectedType && <MaterialCommunityIcons name={selectedType.icon} size={20} color={selectedType.color} style={{ marginRight: 8 }} />}
                    <Text style={{ color: selectedType ? selectedType.color : colors.placeholder, fontSize: 16, fontWeight: selectedType ? '600' : 'normal' }}>
                      {selectedType ? selectedType.label : 'Seleccionar tipo'}
                    </Text>
                  </View>
                </TouchableRipple>
              }
            >
              {ACTIVITY_TYPE_LIST.map((item) => (
                <Menu.Item key={item.value} title={item.label} leadingIcon={() => <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />} onPress={() => { setActivityType(item.value); setTypeMenuVisible(false); }} />
              ))}
            </Menu>

            {activityType === 'POMODORO' && (
              <>
                <Text style={[styles.label, { color: colors.textLight, marginTop: 24 }]}>CONFIGURACIÓN POMODORO</Text>
                <View style={styles.pomodoroGrid}>
                  <View style={styles.pomodoroField}>
                    <TextInput label="Enfoque (min)" mode="outlined" outlineStyle={{ borderRadius: 30 }} style={globalStyles.input} value={focusTime} onChangeText={setFocusTime} keyboardType="numeric" left={<TextInput.Icon icon="brain" />} />
                  </View>
                  <View style={styles.pomodoroField}>
                    <TextInput label="Descanso corto (min)" mode="outlined" outlineStyle={{ borderRadius: 30 }} style={globalStyles.input} value={shortBreak} onChangeText={setShortBreak} keyboardType="numeric" left={<TextInput.Icon icon="coffee" />} />
                  </View>
                  <View style={styles.pomodoroField}>
                    <TextInput label="Descanso largo (min)" mode="outlined" outlineStyle={{ borderRadius: 30 }} style={globalStyles.input} value={longBreak} onChangeText={setLongBreak} keyboardType="numeric" left={<TextInput.Icon icon="tea" />} />
                  </View>
                  <View style={styles.pomodoroField}>
                    <TextInput label="Ciclos hasta descanso largo" mode="outlined" outlineStyle={{ borderRadius: 30 }} style={globalStyles.input} value={cyclesBeforeLong} onChangeText={setCyclesBeforeLong} keyboardType="numeric" left={<TextInput.Icon icon="repeat" />} />
                  </View>
                </View>
              </>
            )}

            {activityType === 'HITO' && (
              <>
                <Text style={[styles.label, { color: colors.textLight, marginTop: 24 }]}>HITOS</Text>
                {hitos.map((hito, index) => (
                  <Surface key={index} style={[styles.hitoCard, { backgroundColor: colors.surface, borderColor: colors.placeholder + '30' }]}>
                    <View style={styles.hitoHeader}>
                      <MaterialCommunityIcons name="flag" size={20} color={selectedType?.color || '#FFA726'} />
                      <Text style={[styles.hitoNumber, { color: colors.text }]}>Hito {index + 1}</Text>
                      <IconButton 
                        icon="close-circle" 
                        size={20} 
                        onPress={() => removeHito(index)} 
                        iconColor={colors.error}
                        style={{ marginLeft: 'auto' }}
                      />
                    </View>
                    <TextInput
                      label="Nombre del hito"
                      mode="outlined"
                      outlineStyle={{ borderRadius: 30 }}
                      style={[globalStyles.input, { marginTop: 8 }]}
                      value={hito.nombre}
                      onChangeText={(text) => updateHito(index, 'nombre', text)}
                      left={<TextInput.Icon icon="flag-variant" />}
                    />
                    <TextInput
                      label="Descripción"
                      mode="outlined"
                      outlineStyle={{ borderRadius: 30 }}
                      style={[globalStyles.input, { marginTop: 8 }]}
                      value={hito.descripcion}
                      onChangeText={(text) => updateHito(index, 'descripcion', text)}
                      multiline
                      numberOfLines={2}
                      left={<TextInput.Icon icon="text-box" />}
                    />
                  </Surface>
                ))}
                
                {hitos.length < 10 && (
                  <Button 
                    mode="outlined" 
                    onPress={addHito}
                    style={[globalStyles.buttonOutline, { marginTop: 12, borderColor: selectedType?.color || '#FFA726' }]}
                    textColor={selectedType?.color || '#FFA726'}
                    icon="plus"
                  >
                    Añadir hito ({hitos.length}/10)
                  </Button>
                )}
              </>
            )}

            {activityType === 'TEMPORIZADOR' && (
              <>
                <Text style={[styles.label, { color: colors.textLight, marginTop: 24 }]}>DURACIÓN</Text>
                <View style={styles.timerRow}>
                  <View style={styles.timerField}>
                    <TextInput label="Horas" mode="outlined" outlineStyle={{ borderRadius: 30 }} value={timerHours} onChangeText={setTimerHours} keyboardType="numeric" maxLength={2} left={<TextInput.Icon icon="clock-start" />} />
                  </View>
                  <Text style={[styles.timerSeparator, { color: colors.text }]}>:</Text>
                  <View style={styles.timerField}>
                    <TextInput label="Minutos" mode="outlined" outlineStyle={{ borderRadius: 30 }} value={timerMinutes} onChangeText={setTimerMinutes} keyboardType="numeric" maxLength={2} left={<TextInput.Icon icon="timer" />} />
                  </View>
                  <Text style={[styles.timerSeparator, { color: colors.text }]}>:</Text>
                  <View style={styles.timerField}>
                    <TextInput label="Segundos" mode="outlined" outlineStyle={{ borderRadius: 30 }} value={timerSeconds} onChangeText={setTimerSeconds} keyboardType="numeric" maxLength={2} left={<TextInput.Icon icon="timer-sand" />} />
                  </View>
                </View>
              </>
            )}

            {activityType === 'LIBRE' && (
              <>
                <Text style={[styles.label, { color: colors.textLight, marginTop: 24 }]}>DESCRIPCIÓN</Text>
                <TextInput
                  label="Descripción"
                  mode="outlined"
                  outlineStyle={{ borderRadius: 30 }}
                  style={globalStyles.input}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  left={<TextInput.Icon icon="text-box" />}
                />
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.bottomButtons, { backgroundColor: colors.surface, borderTopColor: colors.placeholder + '30', paddingBottom: insets.bottom || 16 }]}>
          <Button mode="contained" onPress={handleSave} style={[globalStyles.button, { flex: 1 }]} buttonColor={colors.primary} textColor={colors.background} icon="content-save">Guardar</Button>
          <Button mode="outlined" onPress={() => navigation.goBack()} style={[globalStyles.buttonOutline, { flex: 1 }]} textColor={colors.text} icon="close">Cancelar</Button>
        </View>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
    opacity: 0.7,
  },
  dropdown: {
    marginTop: 8,
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pomodoroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  pomodoroField: {
    width: '47%',
  },
  hitoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
  },
  hitoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hitoNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  timerField: {
    flex: 1,
  },
  timerSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 0.5,
  },
});