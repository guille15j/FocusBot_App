import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg'; // 🚀 Cambiado a LinearGradient
import { useAppColors } from '../../hooks/useAppColors';
import BotIcon from '../../components/BotIcon';

// Módulos
import { authStorage } from '../../core/authStorage';
import { AuthContext } from '../../context/AuthContext';

import apiService from '../../api/apiService'; 

const AnimatedView = Animated.createAnimatedComponent(View);

const MESSAGES = [
  "Iniciando Focus.Bot...",
  "Validando credenciales de acceso...",
  "Sincronizando perfil de usuario...",
  "Casi listo..."
];

export default function LoadingScreen() {
  const colors = useAppColors();
  const { setAuthSession } = useContext(AuthContext);
  const [messageIndex, setMessageIndex] = useState(0);

  // Animaciones 
  const fadeAnim = useRef(new Animated.Value(0)).current;      
  const pulseAnim = useRef(new Animated.Value(1)).current;     
  const textTranslateY = useRef(new Animated.Value(6)).current;
  const barProgressAnim = useRef(new Animated.Value(-140)).current;

  useEffect(() => {
    let isMounted = true;

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    const barLoop = Animated.loop(
      Animated.timing(barProgressAnim, {
        toValue: 140,
        duration: 1600,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    );
    barLoop.start();

    const messageInterval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(textTranslateY, { toValue: 6, duration: 350, useNativeDriver: true })
      ]).start(() => {
        if (!isMounted) return;
        setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(textTranslateY, { toValue: 0, duration: 350, useNativeDriver: true })
        ]).start();
      });
    }, 3000);

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(textTranslateY, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start();

    const iniciarValidacionDeSesion = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2200));

        const token = await authStorage.getToken();
        if (!token) {
          if (isMounted) setAuthSession(null, null);
          return;
        }

        const isExpired = await authStorage.isTokenExpired(token);
        if (isExpired) {
          await authStorage.deleteToken();
          await authStorage.deleteUser();
          if (isMounted) setAuthSession(null, null);
          return;
        }

        let userData = await authStorage.getUser();
        if (!userData) {
          try {
            userData = await apiService.getUserProfile(token); 
            await authStorage.saveUser(userData); 
          } catch (apiError) {
            await authStorage.deleteToken();
            await authStorage.deleteUser();
            if (isMounted) setAuthSession(null, null);
            return;
          }
        }

        if (isMounted) setAuthSession(token, userData);

      } catch (error) {
        if (isMounted) setAuthSession(null, null);
      }
    };

    iniciarValidacionDeSesion();

    return () => {
      isMounted = false;
      clearInterval(messageInterval);
      pulseLoop.stop();
      barLoop.stop();
      fadeAnim.stopAnimation();
      textTranslateY.stopAnimation();
    };
  }, []);

  const bgBase = colors.background === '#FFFFFF' || colors.background === 'rgb(255, 255, 255)' ? '#F5F7FA' : colors.background;
  const darkGradientAccent = '#090D1A'; 

  return (
    <View style={[styles.container, { backgroundColor: bgBase }]}>
      
      <AnimatedView style={[StyleSheet.absoluteFill, { transform: [{ scale: pulseAnim }] }]}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="linearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={bgBase} stopOpacity="1" />
              <Stop offset="60%" stopColor={colors.primary} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={darkGradientAccent} stopOpacity="0.95" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#linearGrad)" />
        </Svg>
      </AnimatedView>
      
      <View style={[StyleSheet.absoluteFill, styles.overlayScrim]} />

      {/* COMPONENTE CENTRAL */}
      <View style={styles.content}>
        <View style={styles.avatarShadowContainer}>
          <BotIcon size={160} loading={true} state="IDLE" />
        </View>
        
        {/* TEXTO Y BARRA */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: textTranslateY }], marginTop: 45, alignItems: 'center' }}>
          <Text style={[styles.loadingText, { color: '#FFFFFF' }]}>
            {MESSAGES[messageIndex]}
          </Text>
          
          <View style={styles.loaderBarContainer}>
            <Animated.View 
              style={[
                styles.loaderProgress, 
                { 
                  backgroundColor: colors.primary || '#00EAFF',
                  transform: [{ translateX: barProgressAnim }] 
                }
              ]} 
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  overlayScrim: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)', 
    zIndex: 1,
  },
  content: { 
    alignItems: 'center', 
    zIndex: 10 
  },
  avatarShadowContainer: {
    // Sutil efecto de elevación bajo el robot
    // shadowColor: '#00EAFF',r
    // shadowOffset: { width: 0, height: 12 },
    // shadowOpacity: 0.2,
    // shadowRadius: 16,
    // elevation: 10,
  },
  loadingText: { 
    fontSize: 15, 
    fontWeight: '600', 
    textAlign: 'center', 
    letterSpacing: 0.6,
    minHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  loaderBarContainer: { 
    width: 140, 
    height: 3,
    borderRadius: 1.5, 
    marginTop: 22, 
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  loaderProgress: { 
    width: '45%', 
    height: '100%', 
    borderRadius: 1.5 
  }
});