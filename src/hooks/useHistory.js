import { useState, useCallback, useEffect } from 'react';
import { HistoryService } from '../api/apiService';

export const useHistory = () => {
    const [records, setRecords] = useState([]);
    
    // NUEVO: Estado para la tendencia semanal en vivo con una estructura inicial segura
    const [weeklyDashboard, setWeeklyDashboard] = useState({
        summary: {
            total_completados: 0,
            total_used_time: 0,
            top_category: 'Sin registros',
            total_pendientes_actuales: 0
        },
        weekChartData: []
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //Obtención combinada (Historicos Persistentes + Dashboard Semanal)
    const fetchHistoryData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Ejecutamos ambas peticiones en paralelo para optimizar el rendimiento de la red
            const [recordsResponse, dashboardResponse] = await Promise.all([
                HistoryService.getRecords(),
                HistoryService.getWeeklyDashboard()
            ]);

            // Guardamos los informes manuales persistidos
            setRecords(recordsResponse.records || []);

            // Guardamos los datos volátiles de la semana actual
            if (dashboardResponse) {
                setWeeklyDashboard(dashboardResponse);
            }
        } catch (err) {
            setError(err.message);
            console.error("Error al obtener los datos integrados de historial:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Mapeo de POST /history/calculate
    const createRecord = async (initDate, endDate) => {
        setLoading(true);
        try {
            const response = await HistoryService.calculateRecord(initDate, endDate);
            
            // Tras calcular un informe con éxito, refrescamos TODO de forma reactiva
            await fetchHistoryData();
            
            return { success: true, record: response.record };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Mapeo de GET /history/<record_id>
    const getRecordDetail = async (recordId) => {
        try {
            const data = await HistoryService.getRecordById(recordId);
            return data.record;
        } catch (err) {
            console.error("Error al obtener detalle del registro:", err);
            return null;
        }
    };

    // Efecto de carga inicial al montar la pantalla
    useEffect(() => {
        fetchHistoryData();
    }, [fetchHistoryData]);

    return {
        records,
        weeklyDashboard,       
        loading,
        error,
        refresh: fetchHistoryData, 
        createRecord,
        getRecordDetail
    };
};