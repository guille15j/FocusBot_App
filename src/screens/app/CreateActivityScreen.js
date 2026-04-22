// src/screens/app/CreateActivityScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Surface,
  IconButton,
} from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import DatePicker from '../../components/forms/DatePicker';
import BotCarousel from '../../components/bots/BotCarrusel';

// Datos de ejemplo de bots (deberían venir del contexto/API)
const MOCK_BOTS = [
  { bot_id: 'BOT001', name: 'FocusBot Alpha', status: 'IDLE' },
  { bot_id: 'BOT002', name: 'FocusBot Beta', status: 'OFFLINE' },
  { bot_id: 'BOT003', name: 'FocusBot Gamma', status: 'FOCUSING' },
];

export default function CreateActivityScreen({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  // Estado del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBot, setSelectedBot] = useState(null);
  const [initDate, setInitDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // +1 hora
  const [category, setCategory] = useState('OTRAS');
  const [loading, setLoading] = useState(false);

  // Modal de selección de bot
  const [botModalVisible, setBotModalVisible] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }
    setLoading(true);
    // Simular envío
    const nuevaActividad = {
      title,
      description,
      bot_id: selectedBot?.bot_id || null,
      init_date: initDate.toISOString(),
      end_date: endDate.toISOString(),
      category,
      state: 'PENDIENTE',
    };
    console.log('Nueva actividad:', nuevaActividad);
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 800);
  };

  const styles = getStyles(colors, isWeb);

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={[globalStyles.tituloPagina, { marginTop: 20, marginBottom: 10 }]}>
            Nueva Actividad
          </Text>

          <Surface style={[globalStyles.section, { marginHorizontal: 20, padding: 20 }]}>
            {/* Título */}
            <TextInput
              label="Título"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
            />

            {/* Selector de Bot */}
            <TouchableOpacity onPress={() => setBotModalVisible(true)} style={styles.botSelector}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.text, flex: 1 }}>
                  {selectedBot ? `Bot: ${selectedBot.name}` : 'Seleccionar Bot'}
                </Text>
                <IconButton icon="chevron-down" size={20} />
              </View>
            </TouchableOpacity>

            {/* Descripción */}
            <TextInput
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={[globalStyles.input, { minHeight: 80 }]}
              outlineStyle={{ borderRadius: 20 }}
            />

            {/* Fechas */}
            <DatePicker
              label="Fecha y hora de inicio"
              mode="datetime"
              value={initDate}
              onChange={setInitDate}
            />
            <DatePicker
              label="Fecha y hora de fin"
              mode="datetime"
              value={endDate}
              onChange={setEndDate}
            />

            {/* Categoría */}
            <Text style={{ color: colors.text, marginBottom: 8, marginTop: 8 }}>Categoría</Text>
            <SegmentedButtons
              value={category}
              onValueChange={setCategory}
              buttons={[
                { value: 'DEPORTES', label: 'Deporte' },
                { value: 'ESTUDIOS', label: 'Estudio' },
                { value: 'HOGAR', label: 'Hogar' },
                { value: 'OTRAS', label: 'Otras' },
              ]}
              style={{ marginBottom: 20 }}
            />

            {/* Botón Guardar */}
            <Button
              mode="contained"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
              style={[globalStyles.button, { marginTop: 20 }]}
              labelStyle={{ fontSize: 16 }}
            >
              Crear Actividad
            </Button>
          </Surface>
        </ScrollView>

        {/* Modal para seleccionar Bot */}
        <Modal
          visible={botModalVisible}
          animationType="slide"
          onRequestClose={() => setBotModalVisible(false)}
        >
          <ScreenWrapper withScroll={false}>
            <View style={[isWeb ? globalStyles.container_web : globalStyles.container_movil, { padding: 20 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="headlineSmall" style={{ color: colors.text }}>Elige un Bot</Text>
                <IconButton icon="close" onPress={() => setBotModalVisible(false)} />
              </View>
              <BotCarousel
                bots={MOCK_BOTS}
                onBotPress={(bot) => {
                  setSelectedBot(bot);
                  setBotModalVisible(false);
                }}
                onAddPress={() => {
                  // Navegar a creación de bot (opcional)
                  console.log('Crear nuevo bot');
                }}
                globalStyles={globalStyles}
              />
            </View>
          </ScreenWrapper>
        </Modal>
      </View>
    </ScreenWrapper>
  );
}

const getStyles = (colors, isWeb) => StyleSheet.create({
  botSelector: {
    borderWidth: 1,
    borderColor: colors.outline || colors.primary,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
});