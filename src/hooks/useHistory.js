import { useState, useCallback, useEffect } from 'react';
import { HistoryService } from '../api/apiService';

export const useHistory = () => {
    const [records, setRecords] = useState([]);
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
    const [recomendaciones, setRecomendaciones] = useState([]);

    const fetchHistoryData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [recordsResponse, dashboardResponse] = await Promise.all([
                HistoryService.getRecords(),
                HistoryService.getWeeklyDashboard()
            ]);

            setRecords(recordsResponse.records || []);

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

    const fetchRecommendations = useCallback(async () => {
        try {
            const data = await HistoryService.getRecommendations();
            setRecomendaciones(data.recomendaciones || []);
        } catch (err) {
            console.error('Error al obtener recomendaciones:', err);
            setRecomendaciones([]);
        }
    }, []);

    const createRecord = async (initDate, endDate) => {
        setLoading(true);
        try {
            const response = await HistoryService.calculateRecord(initDate, endDate);
            await fetchHistoryData();
            return { success: true, record: response.record };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const getRecordDetail = async (recordId) => {
        try {
            const data = await HistoryService.getRecordById(recordId);
            return data.record;
        } catch (err) {
            console.error("Error al obtener detalle del registro:", err);
            return null;
        }
    };

    // Carga inicial de todos los datos
    useEffect(() => {
        fetchHistoryData();
        fetchRecommendations();    
    }, [fetchHistoryData, fetchRecommendations]);

    return {
        records,
        weeklyDashboard,
        loading,
        error,
        recomendaciones,          
        refresh: fetchHistoryData,
        createRecord,
        getRecordDetail,
        fetchRecommendations      
    };
};