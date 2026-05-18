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

  const { records = [], weeklyDashboard, loading, refresh, createRecord } = useHistory();
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

  // Formateamos el tiempo total usando formatTimeShort para que muestre -h --m
  const kpiStats = useMemo(() => {
    const { total_completados = 0, total_used_time = 0, top_category = 'Sin registros' } = weeklyDashboard?.summary || {};

    return [
      { label: 'Completados', value: total_completados.toString(), icon: 'check-all', color: '#81C784' },
      { label: 'Tiempo total', value: formatTimeShort(total_used_time), icon: 'clock-fast', color: '#4FC3F7' },
      { label: 'Categoría Top', value: top_category, icon: 'star-circle', color: '#BA68C8' },
    ];
  }, [weeklyDashboard]);

  const { weekChartData, maxChartValue, hasChartData } = useMemo(() => {
    const chartData = weeklyDashboard?.weekChartData || [];
    const hasData = chartData.some(d => d.hasValue);
    
    const maxVal = Math.max(...chartData.map(d => d.completado + d.normal + d.cancelado), 1);
    
    return { weekChartData: chartData, maxChartValue: maxVal, hasChartData: hasData };
  }, [weeklyDashboard]);

  return (
    <ScreenWrapper withScroll={false}>
      <View style={[isWeb ? globalStyles.container_web : globalStyles.container_movil, { flex: 1, backgroundColor: colors.background }]}>
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
                    <Text style={{ color: colors.textLight, fontSize: 10, marginTop: 4 }}>Sin datos esta semana</Text>
                  </View>
                )}
                {weekChartData.map((day, i) => {
                  const totalBarsValue = day.completado + day.normal + day.cancelado;
                  const emptySpaceFlex = maxChartValue - totalBarsValue;

                  return (
                    <View key={i} style={[styles.chartBarWrap, { opacity: hasChartData ? 1 : 0.25 }]}>
                      <Text style={[styles.chartVal, { color: colors.text }]}>
                        {day.hasValue && totalBarsValue > 0 ? totalBarsValue : ''}
                      </Text>
                      
                      <View style={[styles.barStackContainer, { height: 100 }]}>
                        {emptySpaceFlex > 0 && <View style={{ flex: emptySpaceFlex }} />}

                        {totalBarsValue === 0 ? (
                          <View style={[styles.emptyBarBase, { backgroundColor: colors.placeholder + '40' }]} />
                        ) : (
                          <View style={styles.barStack}>
                            {day.cancelado > 0 && <View style={{ flex: day.cancelado, backgroundColor: '#E5989B' }} />}
                            {day.normal > 0 && <View style={{ flex: day.normal, backgroundColor: colors.primary }} />}
                            {day.completado > 0 && <View style={{ flex: day.completado, backgroundColor: '#81C784' }} />}
                          </View>
                        )}
                      </View>
                      
                      <Text style={[styles.chartDay, { color: colors.textLight }]}>{day.day}</Text>
                    </View>
                  );
                })}
              </View>
              
              <View style={styles.legend}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#81C784' }]} /><Text style={[styles.legendText, { color: colors.textLight }]}>Completado</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primary }]} /><Text style={[styles.legendText, { color: colors.textLight }]}>Pospuesto</Text></View>
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
                filteredRecords.map((record) => {
                  const displayCategory = record.most_category && record.most_category.trim() !== '' 
                    ? record.most_category 
                    : 'Sin registros';
                  return (
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
                        <Text style={[styles.recordDetail, { color: colors.textLight }]}>{record.num_completo} ok • {formatTimeShort(record.total_used_time)} • {displayCategory}</Text>
                      </View>
                      <Surface style={[styles.recordBadge, { backgroundColor: '#81C78420' }]}>
                        <Text style={{ color: '#81C784', fontSize: 11, fontWeight: '600' }}>{record.total_activities > 0 ? ((record.num_completo / record.total_activities) * 100).toFixed(0) : 0}%</Text>
                      </Surface>
                    </Pressable>
                  );
                })
              )}
            </Surface>
          </View>
        </ScrollView>

        <CustomAnimatedFAB icon="plus" label="Nuevo registro" onPress={() => setGenerateModalVisible(true)} isExtended={isExtended} />
        <RecordDetailModal visible={detailModalVisible} onDismiss={() => setDetailModalVisible(false)} record={selectedRecord} />
        <GenerateRecordModal 
          visible={generateModalVisible} 
          onDismiss={() => setGenerateModalVisible(false)} 
          onGenerate={createRecord}
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
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, paddingTop: 10 },
  chartBarWrap: { alignItems: 'center', flex: 1 },
  chartVal: { fontSize: 9, fontWeight: 'bold', marginBottom: 4, height: 12 },
  barStackContainer: { width: 18, justifyContent: 'flex-end' },
  barStack: { width: '100%', borderRadius: 4, overflow: 'hidden', flex: 1, flexDirection: 'column' },
  emptyBarBase: { width: '100%', height: 3, borderRadius: 1.5 },
  chartDay: { fontSize: 9, marginTop: 8, fontWeight: '600' },
  emptyChartOverlay: {
    position: 'absolute',
    top: '55%',
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