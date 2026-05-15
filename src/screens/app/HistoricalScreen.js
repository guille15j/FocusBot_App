import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, useColorScheme, Pressable, RefreshControl } from 'react-native';
import { Text, Surface, Icon} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import RecordDetailModal from '../../components/historical/RecordDetailModal';
import GenerateRecordModal from '../../components/historical/GenerateRecordModal';
import { useHistory } from '../../hooks/useHistory';

export default function HistoricalRecords({ navigation }) {
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(colors), [colors]);
  const { isWeb, platform } = useResponsiveLayout();

  const { records = [], loading, refresh, createRecord } = useHistory();
  const [activeTab, setActiveTab] = useState('Semana');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [isExtended, setIsExtended] = useState(true);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  const formatTimeShort = (minutes) => `${Math.round(minutes / 60)}h ${minutes % 60}m`;

  const onScroll = ({ nativeEvent }) => {
    setIsExtended(nativeEvent.contentOffset.y <= 0);
  };

  const filteredRecords = useMemo(() => {
    const now = new Date();
    return records.filter(r => {
      const recordDate = new Date(r.end_date_range);
      const diffDays = (now - recordDate) / (1000 * 3600 * 24);
      if (activeTab === 'Semana') return diffDays <= 7;
      if (activeTab === 'Mes') return diffDays <= 30;
      return true;
    });
  }, [records, activeTab]);

  const kpiStats = useMemo(() => {
    const totalCompletados = filteredRecords.reduce((acc, r) => acc + (r.num_completo || 0), 0);
    const totalHoras = filteredRecords.reduce((acc, r) => acc + (r.total_used_time || 0), 0);
    const categorias = filteredRecords.reduce((acc, r) => {
      acc[r.most_category] = (acc[r.most_category] || 0) + 1;
      return acc;
    }, {});
    
    const topCat = Object.entries(categorias).sort((a, b) => b[1] - a[1])[0]?.[0] || '---';

    return [
      { label: 'Completados', value: totalCompletados.toString(), icon: 'check-all', color: '#81C784' },
      { label: 'Tiempo total', value: `${Math.round(totalHoras / 60)}h`, icon: 'clock-fast', color: '#4FC3F7' },
      { label: 'Categoría Top', value: topCat, icon: 'star-circle', color: '#BA68C8' },
    ];
  }, [filteredRecords]);

  // Lógica de Gráfica con Manejo de Estado Vacío
  const { weekChartData, maxChartValue, hasChartData } = useMemo(() => {
    const last7DaysData = [...records]
      .sort((a, b) => new Date(a.end_date_range) - new Date(b.end_date_range))
      .slice(-7);

    const hasData = last7DaysData.length > 0;
    
    // Si no hay datos, creamos 7 días vacíos para mantener la estética
    const displayData = hasData 
      ? last7DaysData.map(r => ({
          day: new Date(r.end_date_range).toLocaleDateString('es-ES', { weekday: 'narrow' }).toUpperCase(),
          completado: r.num_completo || 0,
          normal: r.num_pendiente || 0,
          cancelado: r.num_cancelado || 0,
        }))
      : ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => ({ day: d, completado: 0, normal: 0, cancelado: 0 }));

    const maxVal = Math.max(...displayData.map(d => d.completado + d.normal + d.cancelado), 10);
    return { weekChartData: displayData, maxChartValue: maxVal, hasChartData: hasData };
  }, [records]);

  return (
    <ScreenWrapper withScroll={false}>
      <View style={[isWeb ? globalStyles.container_web : globalStyles.container_movil, { flex: 1 }, {backgroundColor: colors.background}]}>
        <Text style={[globalStyles.tituloPagina, { marginTop: 8, marginBottom: 16 }]}>Historial</Text>

        <ScrollView 
          onScroll={onScroll} 
          scrollEventThrottle={16} 
          style={{ flex: 1 }} 
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} colors={[colors.primary]} />}
          contentContainerStyle={{ paddingBottom: isWeb ? 10 : (platform === 'ios' ? 40 : 65) }}
        >
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Resumen</Text>
            <View style={styles.kpiWrap}>
              {kpiStats.map((kpi, i) => (
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
                {!hasChartData && (
                  <View style={styles.emptyChartOverlay}>
                    <Icon source="chart-bar-stacked" size={24} color={colors.placeholder} />
                    <Text style={{ color: colors.textLight, fontSize: 10, marginTop: 4 }}>Sin datos recientes</Text>
                  </View>
                )}
                {weekChartData.map((day, i) => (
                  <View key={i} style={[styles.chartBarWrap, { opacity: hasChartData ? 1 : 0.2 }]}>
                    <Text style={[styles.chartVal, { color: colors.text }]}>{hasChartData ? (day.completado + day.normal + day.cancelado) : ''}</Text>
                    <View style={styles.barStack}>
                      <View style={[styles.barSegment, { height: Math.max((day.cancelado / maxChartValue) * 80, 2), backgroundColor: '#E5989B' }]} />
                      <View style={[styles.barSegment, { height: Math.max((day.normal / maxChartValue) * 80, 2), backgroundColor: colors.primary, marginBottom: 1 }]} />
                      <View style={[styles.barSegment, { height: Math.max((day.completado / maxChartValue) * 80, 2), backgroundColor: '#81C784', marginBottom: 1}]} />
                    </View>
                    <Text style={[styles.chartDay, { color: colors.textLight }]}>{day.day}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.legend}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#81C784' }]} /><Text style={[styles.legendText, { color: colors.textLight }]}>Completado</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primary }]} /><Text style={[styles.legendText, { color: colors.textLight }]}>Pendiente</Text></View>
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
                  <Text style={{ color: activeTab === tab ? colors.background : colors.textLight, fontSize: 12, fontWeight: '600' }}>{tab}</Text>
                </Pressable>
              ))}
            </View>

            <Surface style={[styles.recordList, { backgroundColor: colors.surface, minHeight: filteredRecords.length === 0 ? 150 : 0 }]}>
              {filteredRecords.length === 0 ? (
                <View style={styles.emptyListContainer}>
                  <MaterialCommunityIcons name="clipboard-text-search-outline" size={32} color={colors.placeholder} />
                  <Text style={{ color: colors.textLight, marginTop: 8, fontSize: 13 }}>No hay registros en este periodo</Text>
                </View>
              ) : (
                filteredRecords.map((record) => (
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
                ))
              )}
            </Surface>
          </View>
        </ScrollView>

        <CustomAnimatedFAB icon="plus" label="Nuevo registro" onPress={() => setGenerateModalVisible(true)} isExtended={isExtended} />
        <RecordDetailModal visible={detailModalVisible} onDismiss={() => setDetailModalVisible(false)} record={selectedRecord} />
        <GenerateRecordModal 
          visible={generateModalVisible} 
          onDismiss={() => setGenerateModalVisible(false)} 
          onGenerate={createRecord} // <-- Pasamos la función aquí
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  kpiWrap: { flexDirection: 'row', justifyContent: 'space-between' },
  kpiPill: { width: '31%', padding: 10, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  kpiValue: { fontSize: 14, fontWeight: 'bold' },
  kpiLabel: { fontSize: 9, opacity: 0.7 },
  chartCard: { padding: 16, borderRadius: 20, elevation: 1, position: 'relative' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, paddingTop: 10 },
  chartBarWrap: { alignItems: 'center', flex: 1 },
  chartVal: { fontSize: 9, fontWeight: 'bold', marginBottom: 4 },
  barStack: { width: 18, borderRadius: 4, overflow: 'hidden', flexDirection: 'column-reverse' },
  barSegment: { width: '100%' },
  chartDay: { fontSize: 9, marginTop: 8, fontWeight: '600' },
  emptyChartOverlay: {
  position: 'absolute',
  top: '70%',
  left: '50%',
  transform: [{ translateX: -50 }, { translateY: -50 }],
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},

  legend: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10 },
  tabBar: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  recordList: { borderRadius: 20, overflow: 'hidden', elevation: 1 },
  emptyListContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  recordItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, gap: 12 },
  recordIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  recordDate: { fontSize: 14, fontWeight: 'bold' },
  recordDetail: { fontSize: 11, marginTop: 2 },
  recordBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }
});