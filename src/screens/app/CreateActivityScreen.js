import React, { useState, useMemo, useContext } from 'react';
import { View, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Text, TextInput, Button, IconButton, Menu, TouchableRipple, Surface, Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import BotCarousel from '../../components/bots/BotCarrusel';
import RecommendationButton from '../../components/common/RecommendationButton';

// CONTEXTOS
import { BotContext } from '../../context/BotContext';
import { ActivityContext } from '../../context/ActivityContext';
import { useToast } from '../../context/ToastContext';

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
];

const AUDIO_LIST = [
  { label: 'Sin Sonido', value: 'ninguno', icon: 'volume-off', color: '#BDBDBD' },
  { label: 'Fogata', value: 'fogata', icon: 'fire', color: '#FF7043' },
  { label: 'Bosque', value: 'bosque', icon: 'tree', color: '#66BB6A' },
  { label: 'Río', value: 'rio', icon: 'water', color: '#29B6F6' },
  { label: 'Lluvia', value: 'lluvia', icon: 'weather-pouring', color: '#78909C' },
  { label: 'Ruido Blanco', value: 'ruido blanco', icon: 'waves', color: '#AB47BC' },
];

const ACTIVITY_TYPE_INFO = {
  POMODORO: 'Técnica de gestión del tiempo que alterna periodos de trabajo enfocado con descansos cortos. Tras varios ciclos, se toma un descanso largo.\n\nLos ciclos totales representan cuantos tiempos de trabajo quieres realizar. Si se deja a cero serán infinitos y se acabara de manera manual.',
  HITO: 'Divide tu objetivo en pasos concretos y medibles. Puedes añadir hasta 10 hitos indicando el nombre de la tarea.',
  TEMPORIZADOR: 'Cuenta regresiva simple. Configura horas y minutos para tu actividad.',
};

export default function CreateActivityScreen({ navigation, route }) {
  const { addFullActivity, updateActivity, createType, loading } = useContext(ActivityContext);
  const { bots } = useContext(BotContext);
  const showToast = useToast();

  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const activity = route?.params?.activity || null;
  const isEditing = activity !== null;

  const [selectedBot, setSelectedBot] = useState(activity?.bot_id || null);
  const [title, setTitle] = useState(activity?.title || '');
  const [category, setCategory] = useState(activity?.category || '');
  const [activityType, setActivityType] = useState(activity?.type?.name_type || 'POMODORO');

  const [audioProfile, setAudioProfile] = useState(activity?.extra_data?.audio || 'ninguno');
  const [audioMenuVisible, setAudioMenuVisible] = useState(false);

  const [focusTime, setFocusTime] = useState(activity?.type?.work_duration?.toString() || '25');
  const [shortBreak, setShortBreak] = useState(activity?.type?.short_break?.toString() || '5');
  const [longBreak, setLongBreak] = useState(activity?.type?.long_break?.toString() || '15');
  const [cyclesBeforeLong, setCyclesBeforeLong] = useState(activity?.type?.cycles_before_long?.toString() || '4');
  const [totalCycles, setTotalCycles] = useState(activity?.extra_data?.total_ciclos || 4);
  const [timerHours, setTimerHours] = useState(activity?.type?.work_duration != null ? Math.floor(activity.type.work_duration / 60).toString() : '0');
  const [timerMinutes, setTimerMinutes] = useState(activity?.type?.work_duration != null ? (activity.type.work_duration % 60).toString() : '25');

  const [hitos, setHitos] = useState( activity?.extra_data?.hitos?.map(hito => ({ nombre: hito })) || [{ nombre: '' }] );
  const [hitosError, setHitosError] = useState(false);

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = CATEGORY_LIST.find(c => c.value === category);
  const selectedType = ACTIVITY_TYPE_LIST.find(t => t.value === activityType);
  const selectedAudio = AUDIO_LIST.find(a => a.value === audioProfile);

  const addHito = () => { if (hitos.length < 10) setHitos([...hitos, { nombre: '' }]); };
  const removeHito = (index) => { if (hitos.length > 1) setHitos(hitos.filter((_, i) => i !== index)); };
  const updateHito = (index, value) => {
    const newHitos = [...hitos];
    newHitos[index].nombre = value;
    setHitos(newHitos);
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (!title.trim() || !selectedBot || !category || !activityType) {
      showToast('Por favor, rellena los campos obligatorios.', 'error');
      return;
    }

    if (activityType === 'HITO') {
      const hitosValidos = hitos.filter(h => h.nombre.trim() !== '');
      if (hitosValidos.length === 0) {
        setHitosError(true);
        showToast('Debes añadir al menos un hito.', 'error');
        return;
      }
      setHitosError(false);
    }

    try {
      const extra_data = { audio: audioProfile };
      if (activityType === 'POMODORO') extra_data.total_ciclos = parseInt(totalCycles, 10);
      else if (activityType === 'HITO') extra_data.hitos = hitos.map(h => h.nombre).filter(n => n.trim() !== '');

      const shortBreakValue = activityType === 'POMODORO' ? parseInt(shortBreak || 0) : 0;
      const longBreakValue  = activityType === 'POMODORO' ? parseInt(longBreak || 0)  : 0;
      const cyclesValue     = activityType === 'POMODORO' ? parseInt(cyclesBeforeLong || 4) : 0;
      const workDuration = activityType === 'TEMPORIZADOR'
          ? (parseInt(timerHours || 0) * 60 + parseInt(timerMinutes || 0))
          : parseInt(focusTime || 0);

      const tipoResponse = await createType({
          name_type: activityType,
          work_duration: workDuration,
          short_break: shortBreakValue,
          long_break: longBreakValue,
          cycles_before_long: cyclesValue,
      });
      const nuevoTypeId = tipoResponse.id;

      await addFullActivity({ 
          title: title.trim(),
          bot_id: selectedBot,
          category: category,
          type_id: nuevoTypeId,
          extra_data: extra_data,
      });

      navigation.goBack();
    } catch (error) {
      showToast(error.message || 'Error al guardar', 'error');
    }
  };

  const handleEdit = async () => {
    setSubmitted(true);
    if (!title.trim() || !selectedBot || !category || !activityType) {
      showToast('Por favor, rellena los campos obligatorios.', 'error');
      return;
    }

    if (activityType === 'HITO') {
      const hitosValidos = hitos.filter(h => h.nombre.trim() !== '');
      if (hitosValidos.length === 0) {
        setHitosError(true);
        showToast('Debes añadir al menos un hito.', 'error');
        return;
      }
      setHitosError(false);
    }

    try {
      const extra_data = { audio: audioProfile };
      if (activityType === 'POMODORO') extra_data.total_ciclos = parseInt(totalCycles, 10);
      else if (activityType === 'HITO') extra_data.hitos = hitos.map(h => h.nombre).filter(n => n.trim() !== '');

      const shortBreakValue = activityType === 'POMODORO' ? parseInt(shortBreak || 0) : 0;
      const longBreakValue  = activityType === 'POMODORO' ? parseInt(longBreak || 0)  : 0;
      const cyclesValue     = activityType === 'POMODORO' ? parseInt(cyclesBeforeLong || 4) : 0;
      const workDuration = activityType === 'TEMPORIZADOR'
          ? (parseInt(timerHours || 0) * 60 + parseInt(timerMinutes || 0))
          : parseInt(focusTime || 0);

      const tipoResponse = await createType({
          name_type: activityType,
          work_duration: workDuration,
          short_break: shortBreakValue,
          long_break: longBreakValue,
          cycles_before_long: cyclesValue,
      });
      const nuevoTypeId = tipoResponse.id;

      await updateActivity(activity.activity_id, {
          title: title.trim(),
          bot_id: selectedBot,
          category: category,
          type_id: nuevoTypeId,
          extra_data: extra_data,
      });

      navigation.goBack();
    } catch (error) {
      showToast(error.message || 'Error al actualizar la actividad', 'error');
    }
  };

  const showError = (value, isDropdown = false) => {
    if (!submitted) return false;
    if (isDropdown) return !value;
    return !(value || '').trim();
  };

  return (
    <ScreenWrapper withScroll={true}>
      <View style={[isWeb ? [globalStyles.container_web,] : globalStyles.container_movil, { flex: 1 }]}>
        <View style={[styles.header, { borderBottomColor: colors.placeholder + '30' , marginRight: 16}]}>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} iconColor={colors.text} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? 'Editar Actividad' : 'Nueva Actividad'}</Text>
          <RecommendationButton size={1} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, marginHorizontal: 20 }}>
          <Text style={[styles.label, { color: colors.textLight, marginTop: 20 }]}>
            SELECCIONAR BOT <Text style={{ color: colors.error }}>*</Text>
          </Text>
          <BotCarousel 
            bots={bots} 
            selectedBot={selectedBot} 
            onIndexChange={(bot) => { if (bot && !bot.isAddButton) setSelectedBot(bot.bot_id); }} 
            globalStyles={globalStyles} 
            colors={colors} 
            selectedBotId={selectedBot}
          />
          {showError(selectedBot, true) && (
            <Text style={[styles.errorHint, { color: colors.error }]}>Debes seleccionar un bot</Text>
          )}

          <TextInput
            label="Título de la actividad"
            mode="outlined"
            outlineStyle={{ borderRadius: 30, borderColor: showError(title) ? colors.error : undefined }}
            outlineColor={showError(title) ? colors.error : undefined}
            style={globalStyles.input}
            value={title}
            onChangeText={setTitle}
          />
          {showError(title) && (
            <Text style={[styles.errorHint, { color: colors.error }]}>El título es obligatorio</Text>
          )}

          <View style={styles.dropdownRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textLight }]}>
                CATEGORÍA <Text style={{ color: colors.error }}>*</Text>
              </Text>
              <Menu visible={categoryMenuVisible} onDismiss={() => setCategoryMenuVisible(false)} anchor={
                <TouchableRipple onPress={() => setCategoryMenuVisible(true)} style={[styles.dropdown, { 
                  backgroundColor: selectedCategory ? selectedCategory.color + '15' : colors.surface, 
                  borderColor: showError(category, true) ? colors.error : (selectedCategory ? selectedCategory.color : colors.placeholder + '40')
                }]}>
                  <View style={styles.dropdownContent}>
                    {selectedCategory && <MaterialCommunityIcons name={selectedCategory.icon} size={20} color={selectedCategory.color} style={{ marginRight: 8 }} />}
                    <Text style={{ color: selectedCategory ? selectedCategory.color : colors.placeholder, fontWeight: '600' }}>{selectedCategory ? selectedCategory.label : 'Seleccionar'}</Text>
                  </View>
                </TouchableRipple>
              }>
                {CATEGORY_LIST.map((item) => (
                  <Menu.Item key={item.value} title={item.label} leadingIcon={item.icon} onPress={() => { setCategory(item.value); setCategoryMenuVisible(false); }} />
                ))}
              </Menu>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textLight }]}>AUDIO AMBIENTE</Text>
              <Menu visible={audioMenuVisible} onDismiss={() => setAudioMenuVisible(false)} anchor={
                <TouchableRipple onPress={() => setAudioMenuVisible(true)} style={[styles.dropdown, { 
                  backgroundColor: selectedAudio ? selectedAudio.color + '15' : colors.surface, 
                  borderColor: selectedAudio ? selectedAudio.color : colors.placeholder + '40'
                }]}>
                  <View style={styles.dropdownContent}>
                    <MaterialCommunityIcons name={selectedAudio?.icon} size={20} color={selectedAudio?.color} style={{ marginRight: 8 }} />
                    <Text style={{ color: selectedAudio?.color || colors.placeholder, fontWeight: '600' }}>{selectedAudio?.label || 'Sin sonido'}</Text>
                  </View>
                </TouchableRipple>
              }>
                {AUDIO_LIST.map((item) => (
                  <Menu.Item key={item.value} title={item.label} leadingIcon={item.icon} onPress={() => { setAudioProfile(item.value); setAudioMenuVisible(false); }} />
                ))}
              </Menu>
            </View>
          </View>

          <Text style={[styles.label, { color: colors.textLight, marginTop: 24 }]}>
            TIPO DE ACTIVIDAD <Text style={{ color: colors.error }}>*</Text>
          </Text>
          <Menu visible={typeMenuVisible} onDismiss={() => setTypeMenuVisible(false)} anchor={
            <TouchableRipple onPress={() => setTypeMenuVisible(true)} style={[styles.dropdown, { 
              height: 55, 
              borderColor: showError(activityType, true) ? colors.error : (selectedType?.color || colors.placeholder + '40')
            }]}>
              <View style={styles.dropdownContent}>
                <MaterialCommunityIcons name={selectedType?.icon} size={24} color={selectedType?.color} style={{ marginRight: 12 }} />
                <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', color: selectedType?.color }}>{selectedType?.label}</Text>
                <IconButton icon="information-outline" size={20} onPress={() => setInfoModalVisible(true)} />
              </View>
            </TouchableRipple>
          }>
            {ACTIVITY_TYPE_LIST.map((item) => (
              <Menu.Item key={item.value} title={item.label} leadingIcon={item.icon} onPress={() => { setActivityType(item.value); setTypeMenuVisible(false); }} />
            ))}
          </Menu>

          <View style={{ marginTop: 20 }}>
            {activityType === 'POMODORO' && (
              <View>
                <View style={styles.pomodoroGrid}>
                  <TextInput label="Enfoque" mode="outlined" style={styles.gridInput} value={focusTime} onChangeText={setFocusTime} keyboardType="numeric" />
                  <TextInput label="Descanso C." mode="outlined" style={styles.gridInput} value={shortBreak} onChangeText={setShortBreak} keyboardType="numeric" />
                  <TextInput label="Descanso L." mode="outlined" style={styles.gridInput} value={longBreak} onChangeText={setLongBreak} keyboardType="numeric" />
                  <TextInput label="Frecuencia" mode="outlined" style={styles.gridInput} value={cyclesBeforeLong} onChangeText={setCyclesBeforeLong} keyboardType="numeric" />
                </View>
                <View style={styles.stepperRow}>
                  <Text style={{ color: colors.text, fontWeight: '500' }}>Ciclos Totales</Text>
                  <View style={styles.stepper}>
                    <IconButton icon="minus" size={18} onPress={() => setTotalCycles(Math.max(0, totalCycles - 1))} />
                    <Text style={{ fontWeight: 'bold', fontSize: 16, minWidth: 25, textAlign: 'center' }}>{totalCycles}</Text>
                    <IconButton icon="plus" size={18} onPress={() => setTotalCycles(totalCycles + 1)} />
                  </View>
                </View>
              </View>
            )}

            {activityType === 'HITO' && (
              <View style={[hitosError && { borderColor: colors.error, borderWidth: 1, borderRadius: 12, padding: 8 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={[styles.label, { marginBottom: 0 }]}>
                    Hitos de la actividad <Text style={{ color: colors.error }}>*</Text>
                  </Text>
                  <Text style={[styles.label, { color: hitos.length >= 10 ? colors.error : colors.primary }]}>{hitos.length}/10</Text>
                </View>
                {hitos.map((hito, index) => (
                  <Surface key={index} style={[styles.hitoCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.hitoHeader}>
                      <MaterialCommunityIcons name="flag-variant" size={20} color={selectedType?.color} />
                      <Text style={{ marginLeft: 8, fontWeight: '600' }}>Hito {index + 1}</Text>
                      <IconButton icon="close" size={18} onPress={() => removeHito(index)} style={{ marginLeft: 'auto', margin: 0 }} />
                    </View>
                    <TextInput
                      label="¿Qué hay que hacer?"
                      mode="outlined"
                      dense
                      outlineStyle={{ borderRadius: 20 }}
                      value={hito.nombre}
                      onChangeText={(t) => updateHito(index, t)}
                    />
                  </Surface>
                ))}
                {hitosError && (
                  <Text style={[styles.errorHint, { color: colors.error, marginBottom: 8 }]}>
                    Al menos un hito es obligatorio.
                  </Text>
                )}
                {hitos.length < 10 && (
                  <Button icon="plus" mode="outlined" onPress={addHito} style={{ marginTop: 5, borderRadius: 20 }}>Hito</Button>
                )}
              </View>
            )}

            {activityType === 'TEMPORIZADOR' && (
              <View style={styles.timerRow}>
                <TextInput label="Horas" mode="outlined" style={{ flex: 1 }} value={timerHours} onChangeText={setTimerHours} keyboardType="numeric" />
                <TextInput label="Minutos" mode="outlined" style={{ flex: 1 }} value={timerMinutes} onChangeText={setTimerMinutes} keyboardType="numeric" />
              </View>
            )}
          </View>

          <Button mode="contained" 
            onPress={activity ? handleEdit : handleSave} 
            loading={loading} style={[globalStyles.button, { flex: 1 }]} 
            buttonColor={colors.primary} 
            textColor={colors.background} 
            icon={activity ? 'content-save' : 'playlist-plus'}
          >
            {activity ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </ScrollView>

        <Portal>
          {/* SE APLICA EL MARGEN CONDICIONAL DIRECTAMENTE EN EL CONTENT CONTAINER STYLE */}
          <Modal 
            visible={infoModalVisible} 
            onDismiss={() => setInfoModalVisible(false)} 
            contentContainerStyle={[
              styles.modal, 
              { backgroundColor: colors.surface },
              isWeb && styles.webModalMargin
            ]}
          >
             <View style={styles.modalHeader}>
                <MaterialCommunityIcons name={selectedType?.icon} size={32} color={selectedType?.color} />
                <Text style={[styles.modalTitle, { color: selectedType?.color, marginLeft: 12 }]}>{selectedType?.label}</Text>
                <IconButton icon="close-circle" size={24} onPress={() => setInfoModalVisible(false)} style={{ marginLeft: 'auto' }} />
             </View>
            <Text style={{ color: colors.text, lineHeight: 22, fontSize: 15 }}>{ACTIVITY_TYPE_INFO[activityType]}</Text>
          </Modal>
        </Portal>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  label: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 6, opacity: 0.6 },
  dropdownRow: { flexDirection: 'row', gap: 12, marginTop: 15 },
  dropdown: { height: 48, borderRadius: 24, borderWidth: 1, justifyContent: 'center', paddingHorizontal: 16 },
  dropdownContent: { flexDirection: 'row', alignItems: 'center' },
  pomodoroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridInput: { width: '47%', height: 50 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingHorizontal: 5},
  stepper: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 4 },
  hitoCard: { padding: 12, borderRadius: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  hitoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timerRow: { flexDirection: 'row', gap: 10 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 35 },
  btn: { flex: 1, borderRadius: 25, height: 48, justifyContent: 'center' },
  modal: { padding: 25, margin: 20, borderRadius: 28 },
  // ESTILO ESPECÍFICO PARA WEB
  webModalMargin: {
    marginHorizontal: 700,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 500, // Medida de seguridad por si la ventana se reduce
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  errorHint: { fontSize: 12, marginLeft: 4, marginTop: 2, marginBottom: 4 },
});