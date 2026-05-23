import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ICONS = {
  success: { name: 'check-circle-outline', color: '#4CAF50' },
  error: { name: 'alert-circle-outline', color: '#F44336' },
  info: { name: 'information-outline', color: '#2196F3' },
  debug: { name: 'bug-outline', color: '#FF9800' },
};

const TOAST_DURATION = 3000;

const StatusToast = ({ message, type = 'info', visible, onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isVisible, setIsVisible] = useState(visible);
  const timerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      // Animación de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Autogestión del tiempo
      timerRef.current = setTimeout(() => {
        hideToast();
      }, TOAST_DURATION);
    }
    return () => clearTimeout(timerRef.current);
  }, [visible, message]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onDismiss && onDismiss();
    });
  };

  if (!isVisible) return null;

  const icon = ICONS[type] || ICONS.info;

  return (
    <Portal>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: Platform.OS === 'web' ? null : slideAnim }] },
        ]}
      >
        <TouchableOpacity onPress={hideToast} activeOpacity={0.9}>
          <View style={[styles.pill, { borderLeftColor: icon.color }]}>
            <MaterialCommunityIcons
              name={icon.name}
              size={22}
              color={icon.color}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.message} numberOfLines={2}>
              {message}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 303 : 90,
    left: Platform.OS === 'web' ? null : 20,
    right:  Platform.OS === 'web' ? 10: 20,
    alignItems: 'center',
    zIndex: 9999,
    
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    minWidth: Platform.OS === 'web' ? null : 300,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});

export default StatusToast;