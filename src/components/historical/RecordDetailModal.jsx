import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Portal, Modal, Text, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { getColors } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

const CATEGORIES_CONFIG = {
  DEPORTES: { icon: 'dumbbell', color: '#FFD54F', label: 'Deporte' },
  LECTURA: { icon: 'book-open-variant', color: '#FF8A65', label: 'Lectura' },
  ESTUDIOS: { icon: 'school', color: '#81C784', label: 'Estudio' },
  DESCANSO: { icon: 'weather-night', color: '#9575CD', label: 'Descanso' },
  HOGAR: { icon: 'home', color: '#F06292', label: 'Hogar' },
  OTRAS: { icon: 'dots-horizontal', color: '#BDBDBD', label: 'Otros' },
};

const RecordDetailModal = ({ visible, onDismiss, record }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);

  if (!record) return null;

  const rate = record.total_activities > 0 ? ((record.num_completo / record.total_activities) * 100).toFixed(0) : 0;
  const catInfo = CATEGORIES_CONFIG[record.most_category] || CATEGORIES_CONFIG.OTRAS;
  const formatTime = (min) => {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', marginTop: -insets.top, marginBottom: -insets.bottom }}
        contentContainerStyle={[styles.modal, { backgroundColor: colors.surface, marginHorizontal: isWeb ? '35%' : 16 }]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="calendar-check" size={28} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>Detalle del Registro</Text>
            <IconButton icon="close-circle" size={28} onPress={onDismiss} iconColor={colors.textLight} style={{ marginLeft: 'auto' }} />
          </View>

          <Text style={[styles.dateRange, { color: colors.textLight }]}>
            {new Date(record.init_date_range).toLocaleDateString('es-ES')} - {new Date(record.end_date_range).toLocaleDateString('es-ES')}
          </Text>

          <View style={styles.kpiGrid}>
            <Surface style={[styles.kpiBox, { backgroundColor: '#81C78415' }]}>
              <Text style={styles.kpiNum}>{record.num_completo}</Text>
              <Text style={[styles.kpiSub, { color: '#81C784' }]}>Completado</Text>
            </Surface>
            <Surface style={[styles.kpiBox, { backgroundColor: '#FFB74D15' }]}>
              <Text style={styles.kpiNum}>{record.num_pendiente}</Text>
              <Text style={[styles.kpiSub, { color: '#FFB74D' }]}>Pendiente</Text>
            </Surface>
            <Surface style={[styles.kpiBox, { backgroundColor: '#BA68C815' }]}>
              <Text style={styles.kpiNum}>{record.num_pospuesto}</Text>
              <Text style={[styles.kpiSub, { color: '#BA68C8' }]}>Pospuesto</Text>
            </Surface>
            <Surface style={[styles.kpiBox, { backgroundColor: '#E5737315' }]}>
              <Text style={styles.kpiNum}>{record.num_cancelado}</Text>
              <Text style={[styles.kpiSub, { color: '#E57373' }]}>Cancelado</Text>
            </Surface>
          </View>

          <View style={styles.row}>
            <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name={catInfo.icon} size={24} color={catInfo.color} />
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Categoría Top</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{catInfo.label}</Text>
            </Surface>
            <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#4FC3F7" />
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Tiempo Total</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{formatTime(record.total_used_time)}</Text>
            </Surface>
          </View>

          <View style={styles.row}>
            <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="format-list-bulleted" size={24} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Total Actividades</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{record.total_activities}</Text>
            </Surface>
            <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="percent" size={24} color="#81C784" />
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Tasa Éxito</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{rate}%</Text>
            </Surface>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 24,
    borderRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 13,
    marginBottom: 20,
    marginLeft: 38,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  kpiBox: {
    width: '47%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  kpiNum: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4E69',
  },
  kpiSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  infoCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecordDetailModal;