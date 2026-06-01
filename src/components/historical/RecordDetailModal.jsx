import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Portal, Modal, Text, IconButton, Button, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

const CATEGORIES_CONFIG = {
  ESTUDIOS: { icon: 'school', color: '#81C784', label: 'Estudios' },
  LECTURA: { icon: 'book-open-variant', color: '#64B5F6', label: 'Lectura' },
  HOGAR: { icon: 'home', color: '#FFD54F', label: 'Hogar' },
  DEPORTES: { icon: 'run', color: '#FF8A65', label: 'Deportes' },
  DESCANSO: { icon: 'bed', color: '#BA68C8', label: 'Descanso' },
  OTRAS: { icon: 'dots-horizontal', color: '#90A4AE', label: 'Otras' },
};

const RecordDetailModal = ({ visible, onDismiss, record }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(colors), [colors]);

  if (!record) return null;

  const catInfo = CATEGORIES_CONFIG[record.most_category] || CATEGORIES_CONFIG.OTRAS;
  
  const successRate = record.total_activities > 0 
    ? ((record.num_completo / record.total_activities) * 100).toFixed(0) 
    : 0;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          marginTop: -insets.top, 
          marginBottom: -insets.bottom 
        }}
        contentContainerStyle={[
          styles.modal, 
          { backgroundColor: colors.surface, margin: isWeb ? 700 : 20 }
        ]}
      >
        {/* HEADER ESTILO GENERATE MODAL */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.primary }]}>Detalles del Informe</Text>
            <Text style={[styles.sub, { color: colors.textLight }]}>
              {formatDate(record.init_date_range)} — {formatDate(record.end_date_range)}
            </Text>
          </View>
          <IconButton icon="close-circle" size={28} onPress={onDismiss} iconColor={colors.textLight} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* SECCIÓN 1: KPI GRID */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#81C784' }]}>{record.num_completo}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Completas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{record.num_pospuesto}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Pospuestos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#E57373' }]}>{record.num_cancelado}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Canceladas</Text>
            </View>
          </View>

          <Divider style={{ marginVertical: 20, opacity: 0.2 }} />

          {/* SECCIÓN 2: INFORMACIÓN DETALLADA */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Análisis del Periodo</Text>
          
          <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <MaterialCommunityIcons name={catInfo.icon} size={24} color={catInfo.color} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.cardLabel, { color: colors.textLight }]}>Categoría más frecuente</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>{catInfo.label}</Text>
            </View>
          </Surface>

          <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4FC3F7" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.cardLabel, { color: colors.textLight }]}>Tiempo total invertido</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>
                {Math.floor(record.total_used_time / 60)}h {record.total_used_time % 60}m
              </Text>
            </View>
          </Surface>

          <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <MaterialCommunityIcons name="bullseye-arrow" size={24} color="#F06292" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.cardLabel, { color: colors.textLight }]}>Tasa de éxito</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>{successRate}% de efectividad</Text>
            </View>
          </Surface>

          <Button
            mode="contained"
            onPress={onDismiss}
            style={{ marginTop: 12, marginBottom: 10, borderRadius: 30 }}
            buttonColor={colors.primary}
            textColor={colors.background}
          >
            Cerrar Detalle
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: { padding: 24, borderRadius: 24 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 16 
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  sub: { fontSize: 13, marginTop: 2 },
  statsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 10, textTransform: 'uppercase', marginTop: 4, letterSpacing: 0.5 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    elevation: 0,
  },
  cardLabel: { fontSize: 11, opacity: 0.8 },
  cardValue: { fontSize: 15, fontWeight: '600' },
});

export default RecordDetailModal;