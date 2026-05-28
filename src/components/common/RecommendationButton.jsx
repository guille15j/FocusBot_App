import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { Surface, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { HistoryService } from '../../api/apiService';
import { getColors } from '../../theme/theme';

export default function RecommendationButton({ size = 1 }) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const [visible, setVisible] = useState(false);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await HistoryService.getRecommendations();
      setRecomendaciones(data.recomendaciones || []);
    } catch (err) {
      console.error('Error al obtener recomendaciones:', err);
      setRecomendaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (recomendaciones.length === 0) {
      fetchRecommendations();
    }
    setVisible(true);
  };

  // Asignar un icono según el contenido de la frase
  const getIconForRecommendation = (frase) => {
    if (frase.includes('categoría')) return 'tag-outline';
    if (frase.includes('sesiones') || frase.includes('minutos')) return 'clock-outline';
    if (frase.includes('mañanas') || frase.includes('tardes') || frase.includes('noches')) return 'weather-sunset-up';
    if (frase.includes('tipo')) return 'diamond-outline';
    if (frase.includes('Completa más')) return 'playlist-check';
    return 'lightbulb-on-outline';
  };

  return (
    <>
      {/* Botón según el tamaño */}
      {size === 1 ? (
        <TouchableOpacity onPress={handlePress} style={styles.circleButton}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#FFB74D" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handlePress} style={styles.textButton}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#FFB74D" />
          <Text style={styles.textButtonLabel}>Recomendaciones</Text>
        </TouchableOpacity>
      )}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>

            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={32} color="#FFB74D" />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Recomendaciones para ti</Text>
            </View>

            <View style={styles.bodyContainer}>
              {loading ? (
                <Text style={[styles.loadingText, { color: colors.textLight }]}>Analizando tu actividad...</Text>
              ) : recomendaciones.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="playlist-check" size={48} color={colors.placeholder} />
                  <Text style={[styles.emptyText, { color: colors.textLight }]}>
                    Completa más actividades para recibir recomendaciones personalizadas.
                  </Text>
                </View>
              ) : (
                recomendaciones.map((frase, idx) => (
                  <View key={idx} style={styles.recommendationCard}>
                    <MaterialCommunityIcons
                      name={getIconForRecommendation(frase)}
                      size={22}
                      color={colors.primary}
                      style={styles.cardIcon}
                    />
                    <Text style={[styles.recommendationText, { color: colors.text }]}>{frase}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Botón de cierre */}
            <Button
              mode="contained"
              onPress={() => setVisible(false)}
              style={styles.closeButton}
              labelStyle={{ fontSize: 14, fontWeight: '600' }}
              buttonColor={colors.primary}
              textColor={colors.background}
            >
              Entendido
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFB74D20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFB74D15',
    gap: 6,
  },
  textButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFB74D',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%', // límite de pantalla, pero sin scroll
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyContainer: {
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  cardIcon: {
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    borderRadius: 12,
    marginTop: 8,
  },
});