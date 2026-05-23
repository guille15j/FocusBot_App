import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, useColorScheme } from 'react-native';
import { Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getColors } from '../../theme/theme';

const ConfirmDialog = ({ visible, title, message, icon = 'alert-circle-outline', iconColor, actions = [], onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);

  // Si no se especifica un color para el icono, usar el color de error del tema
  const finalIconColor = iconColor || colors.error;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Portal>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.dialog, { backgroundColor: colors.surface, transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.iconContainer, { backgroundColor: finalIconColor + '20' }]}>
            <MaterialCommunityIcons name={icon} size={32} color={finalIconColor} />
          </View>
          {title ? <Text style={[styles.title, { color: colors.text }]}>{title}</Text> : null}
          <Text style={[styles.message, { color: colors.textLight }]}>{message}</Text>
          <View style={styles.actions}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (action.onPress) action.onPress();
                  onDismiss();
                }}
                style={[
                  styles.actionButton,
                  action.primary 
                    ? [styles.primaryButton, { backgroundColor: colors.error }]
                    : [styles.secondaryButton, { backgroundColor: colors.primary + '15' }]
                ]}
              >
                <Text style={[
                  styles.actionText,
                  action.primary 
                    ? styles.primaryText 
                    : [styles.secondaryText, { color: colors.primary }]
                ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  },
  dialog: {
    borderRadius: 20, padding: 24,
    marginHorizontal: 30, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 15, maxWidth: 400,
  },
  iconContainer: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  message: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  actions: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', minWidth: 150 },
  primaryText: { color: '#FFFFFF', fontWeight: '600' },
  secondaryText: { fontWeight: '600' },
});

export default ConfirmDialog;