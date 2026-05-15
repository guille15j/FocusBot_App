import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Rect, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

// Creamos versiones animables de los componentes de SVG
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const BotIcon = ({ size = 240, isLoading = false, state = 'IDLE' }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    // 1. Animación de Rotación (Loading)
    if (isLoading) {
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotationAnim.setValue(0);
    }

    // 2. Animación de Parpadeo (Estado IDLE)
    if (state === 'IDLE') {
      const startBlink = () => {
        Animated.sequence([
          Animated.delay(3500), // BLINK_INTERVAL
          Animated.timing(blinkAnim, { toValue: 6, duration: 150, useNativeDriver: false }),
          Animated.timing(blinkAnim, { toValue: 60, duration: 150, useNativeDriver: false }),
        ]).start(() => startBlink());
      };
      startBlink();
    }
  }, [isLoading, state]);

  // Interpolación para la rotación
  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Svg width={size} height={size} viewBox="0 0 240 240">
      <Defs>
        <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0e7a7d" />
          <Stop offset="100%" stopColor="#7cf3ad" />
        </LinearGradient>
      </Defs>

      {/* Anillo y Punto Orbital */}
      <AnimatedG 
        style={{ transform: [{ rotate: spin }] }} 
        origin="120, 120"
      >
        <Path 
          d="M 194.25 45.75 A 105 105 0 1 1 170 29" 
          stroke="url(#ringGradient)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          fill="none" 
        />
        <Circle cx="194.25" cy="45.75" r="8" fill="#7cf3ad" />
      </AnimatedG>

      {/* Cuerpo de la Cara */}
      <Rect x="30" y="70" width="180" height="100" rx="50" fill="#2c3338" />

      {/* Ojos (Simetría exactas del C++) */}
      <AnimatedRect
        x="57.5"
        y={blinkAnim.interpolate({
          inputRange: [6, 60],
          outputRange: [117, 90]
        })}
        width="45"
        height={blinkAnim}
        rx={15}
        fill={state === 'FOCUS' ? "#981010" : "#7cf3ad"}
      />
      <AnimatedRect
        x="137.5"
        y={blinkAnim.interpolate({
          inputRange: [6, 60],
          outputRange: [117, 90]
        })}
        width="45"
        height={blinkAnim}
        rx={15}
        fill={state === 'FOCUS' ? "#981010" : "#7cf3ad"}
      />
    </Svg>
  );
};

export default BotIcon;