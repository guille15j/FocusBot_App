import { useState, useCallback, useEffect } from 'react';
import { HistoryService } from '../api/apiService';

export const useHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Mapeo de GET /history/
    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await HistoryService.getRecords();
            // Validamos que records venga del backend según history_service.py
            setRecords(data.records || []);
        } catch (err) {
            setError(err.message);
            console.error("Error al obtener el historial:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Mapeo de POST /history/calculate
    const createRecord = async (initDate, endDate) => {
        setLoading(true);
        try {
            // El backend espera los campos 'init_date_range' y 'end_date_range'
            const response = await HistoryService.calculateRecord(initDate, endDate);
            
            // Actualización reactiva: Refrescamos la lista tras el cálculo exitoso
            await fetchHistory();
            
            return { success: true, record: response.record };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // 3. Mapeo de GET /history/<record_id>
    const getRecordDetail = async (recordId) => {
        try {
            const data = await HistoryService.getRecordById(recordId);
            return data.record; // Estructura {"record": {...}}
        } catch (err) {
            console.error("Error al obtener detalle del registro:", err);
            return null;
        }
    };

    // Efecto de carga inicial
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return {
        records,
        loading,
        error,
        refresh: fetchHistory, // Exponemos para el Pull-to-refresh
        createRecord,
        getRecordDetail
    };
};