import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, useColorScheme, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import RecordDetailModal from '../../components/historical/RecordDetailModal';
import GenerateRecordModal from '../../components/historical/GenerateRecordModal';

const RECORDS_DATA = [
  // ... (tus datos igual)
  { record_id: 1, user_id: 1, init_date_range: "2026-04-21T00:00:00", end_date_range: "2026-04-24T00:00:00", num_completo: 14, num_pospuesto: 2, num_cancelado: 1, num_pendiente: 3, most_category: "ESTUDIOS", total_activities: 20, total_used_time: 480.0 },
  // ... (el resto de registros)
];

export default function HistoricalRecords({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb, platform } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const [isExtended, setIsExtended] = useState(true);
  const [activeTab, setActiveTab] = useState('Semana');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const onScroll = ({ nativeEvent }) => setIsExtended(nativeEvent.contentOffset.y <= 0);

  const today = new Date();
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const monthAgo = new Date(today); monthAgo.setMonth(today.getMonth() - 1);

  const filteredRecords = useMemo(() => {
    if (activeTab === 'Semana') return RECORDS_DATA.filter(r => new Date(r.end_date_range) >= weekAgo);
    if (activeTab === 'Mes') return RECORDS_DATA.filter(r => new Date(r.end_date_range) >= monthAgo);
    return RECORDS_DATA;
  }, [activeTab]);

  const kpiData = useMemo(() => {
    const total = filteredRecords.reduce((acc, r) => ({
      completado: acc.completado + r.num_completo,
      pospuesto: acc.pospuesto + r.num_pospuesto,
      cancelado: acc.cancelado + r.num_cancelado,
      pendiente: acc.pendiente + r.num_pendiente,
      tiempo: acc.tiempo + r.total_used_time,
      categorias: { ...acc.categorias, [r.most_category]: (acc.categorias[r.most_category] || 0) + 1 },
    }), { completado: 0, pospuesto: 0, cancelado: 0, pendiente: 0, tiempo: 0, categorias: {} });

    const topCategory = Object.entries(total.categorias).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const formatTimeShort = (min) => {
      const h = Math.floor(min / 60);
      const m = Math.round(min % 60);
      return h > 0 ? `${h}h ${m}min` : `${m}min`;
    };

    return [
      { label: 'Complet.', value: total.completado.toString(), icon: 'check-circle', color: '#81C784' },
      { label: 'Tiempo', value: formatTimeShort(total.tiempo), icon: 'clock-outline', color: '#4FC3F7' },
      { label: 'Pend.', value: total.pendiente.toString(), icon: 'clock-alert', color: '#FFB74D' },
      { label: 'Top', value: topCategory, icon: 'trophy', color: '#BA68C8' },
      { label: 'Cancel.', value: total.cancelado.toString(), icon: 'close-circle', color: '#E5989B' },
    ];
  }, [filteredRecords]);

  const weekChartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayRecords = RECORDS_DATA.filter(r => r.init_date_range.split('T')[0] <= dateStr && r.end_date_range.split('T')[0] >= dateStr);
      days.push({
        day: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()],
        completado: dayRecords.reduce((acc, r) => acc + r.num_completo, 0),
        normal: dayRecords.reduce((acc, r) => acc + r.num_pendiente + r.num_pospuesto, 0),
        cancelado: dayRecords.reduce((acc, r) => acc + r.num_cancelado, 0),
      });
    }
    return days;
  }, []);

  const maxChartValue = Math.max(...weekChartData.map(d => d.completado + d.normal + d.cancelado), 1);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const formatTimeShort = (min) => { const h = Math.floor(min / 60); const m = Math.round(min % 60); return h > 0 ? `${h}h ${m}min` : `${m}min`; };

  return (
    <ScreenWrapper withScroll={false}>
      <View style={[isWeb ? globalStyles.container_web : globalStyles.container_movil, { flex: 1 }]}>
        <Text style={[globalStyles.tituloPagina, { marginTop: 8, marginBottom: 16 }]}>Historial</Text>

        <ScrollView 
          onScroll={onScroll} 
          scrollEventThrottle={16} 
          style={{ flex: 1 }} 
          contentContainerStyle={{ paddingBottom: isWeb ? 10 : (platform === 'ios' ? 40 : 65) }}
        >
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Resumen</Text>
            <View style={styles.kpiWrap}>
              {kpiData.map((kpi, i) => (
                <Surface key={i} style={[styles.kpiPill, { backgroundColor: colors.surface, borderColor: colors.placeholder + '20' }]}>
                  <MaterialCommunityIcons name={kpi.icon} size={14} color={kpi.color} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.kpiValue, { color: colors.text }]} numberOfLines={1}>{kpi.value}</Text>
                    <Text style={[styles.kpiLabel, { color: colors.textLight }]}>{kpi.label}</Text>
                  </View>
                </Surface>
              ))}
            </View>

            <Surface style={[styles.chartCard, { backgroundColor: colors.surface, marginTop: 20 }]}>
              <Text style={[styles.sectionTitle, { color: colors.textLight, marginBottom: 12 }]}>Tendencia Semanal</Text>
              <View style={styles.chartBars}>
                {weekChartData.map((day, i) => (
                  <View key={i} style={styles.chartBarWrap}>
                    <Text style={[styles.chartVal, { color: colors.text }]}>{day.completado + day.normal + day.cancelado}</Text>
                    <View style={styles.barStack}>
                      <View style={[styles.barSegment, { height: Math.max((day.cancelado / maxChartValue) * 80, 2), backgroundColor: '#E5989B' }]} />
                      <View style={[styles.barSegment, { height: Math.max((day.normal / maxChartValue) * 80, 2), backgroundColor: colors.primary }]} />
                      <View style={[styles.barSegment, { height: Math.max((day.completado / maxChartValue) * 80, 2), backgroundColor: '#81C784', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }]} />
                    </View>
                    <Text style={[styles.chartDay, { color: colors.textLight }]}>{day.day}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.legend}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#81C784' }]} /><Text style={[styles.legendText, { color: colors.textLight }]}>Completado</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primary }]} /><Text style={[styles.legendText, { color: colors.textLight }]}>Normal</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#E5989B' }]} /><Text style={[styles.legendText, { color: colors.textLight }]}>Cancelado</Text></View>
              </View>
            </Surface>

            <Text style={[styles.sectionTitle, { color: colors.textLight, marginTop: 24 }]}>Registros</Text>
            <View style={styles.tabBar}>
              {['Semana', 'Mes', 'Todos'].map(tab => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={({ pressed }) => [
                    styles.tab,
                    {
                      backgroundColor: activeTab === tab ? colors.primary : colors.surface,
                      borderColor: activeTab === tab ? colors.primary : colors.placeholder + '30',
                      opacity: pressed ? 0.8 : 1,
                    }
                  ]}
                >
                  <Text style={{ color: activeTab === tab ? colors.background : colors.textLight, fontSize: 12, fontWeight: '600' }}>
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Surface style={[styles.recordList, { backgroundColor: colors.surface }]}>
              {filteredRecords.map((record) => (
                <Pressable
                  key={record.record_id}
                  onPress={() => { setSelectedRecord(record); setDetailModalVisible(true); }}
                  style={({ pressed }) => [
                    styles.recordItem,
                    { borderBottomColor: colors.placeholder + '15', opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <Surface style={[styles.recordIcon, { backgroundColor: '#81C78420' }]}>
                    <MaterialCommunityIcons name="calendar-check" size={18} color="#81C784" />
                  </Surface>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.recordDate, { color: colors.text }]}>{formatDate(record.init_date_range)} - {formatDate(record.end_date_range)}</Text>
                    <Text style={[styles.recordDetail, { color: colors.textLight }]}>{record.num_completo} ok • {formatTimeShort(record.total_used_time)} • {record.most_category}</Text>
                  </View>
                  <Surface style={[styles.recordBadge, { backgroundColor: '#81C78420' }]}>
                    <Text style={{ color: '#81C784', fontSize: 11, fontWeight: '600' }}>{record.total_activities > 0 ? ((record.num_completo / record.total_activities) * 100).toFixed(0) : 0}%</Text>
                  </Surface>
                </Pressable>
              ))}
            </Surface>
          </View>
        </ScrollView>

        <CustomAnimatedFAB icon="plus" label="Nuevo registro" onPress={() => setGenerateModalVisible(true)} isExtended={isExtended} />

        <RecordDetailModal visible={detailModalVisible} onDismiss={() => setDetailModalVisible(false)} record={selectedRecord} />
        <GenerateRecordModal visible={generateModalVisible} onDismiss={() => setGenerateModalVisible(false)} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, opacity: 0.7 },
  kpiWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  kpiPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, width: '31%' },
  kpiValue: { fontSize: 15, fontWeight: 'bold' },
  kpiLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3 },
  chartCard: { padding: 16, borderRadius: 16 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 90 },
  chartBarWrap: { flex: 1, alignItems: 'center' },
  barStack: { width: '100%', maxWidth: 28, flexDirection: 'column-reverse', borderRadius: 4, overflow: 'hidden' },
  barSegment: { width: '100%', minHeight: 2 },
  chartVal: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  chartDay: { fontSize: 9, marginTop: 4 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 9 },
  tabBar: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  recordList: { borderRadius: 16, overflow: 'hidden' },
  recordItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 0.5 },
  recordIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  recordDate: { fontSize: 13, fontWeight: '600' },
  recordDetail: { fontSize: 11, marginTop: 2 },
  recordBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
});