import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Rect, ClipPath } from 'react-native-svg';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// 🚀 EXPORTACIÓN NOMBRADA (Satisface el import { BotIcon } de tu LoadingScreen)
export const BotIcon = ({ size = 240, loading = false, state = 'IDLE' }) => {
  const scale = size / 240;
  
  const { isWeb, platform } = useResponsiveLayout();
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(60)).current; 

  const BOT_COLORS = {
    BLUE_ELECTRIC: '#00EAFF', 
    PURPLE: 'rgb(0, 0, 0)',      
    WHITE: '#FFFFFF',      
  };

  useEffect(() => {
    let rotationLoop = null;
    let isMounted = true;

    if (loading) {
      rotationLoop = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: !isWeb,
        })
      );
      rotationLoop.start();
    } else {
      Animated.timing(rotationAnim, { toValue: 0, duration: 300, useNativeDriver: !isWeb }).start();
    }

    if (state === 'IDLE') {
      const startBlink = () => {
        if (!isMounted) return;
        Animated.sequence([
          Animated.delay(3500), 
          Animated.timing(blinkAnim, { toValue: 6, duration: 150, useNativeDriver: false }),  
          Animated.timing(blinkAnim, { toValue: 60, duration: 150, useNativeDriver: false }), 
        ]).start((result) => {
          if (result.finished && isMounted) {
            startBlink();
          }
        });
      };
      startBlink();
    } else {
      blinkAnim.setValue(state === 'FOCUS' ? 35 : 60);
    }

    return () => {
      isMounted = false;
      if (rotationLoop) rotationLoop.stop();
      blinkAnim.stopAnimation();
      rotationAnim.stopAnimation();
    };
  }, [loading, state]);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const eyeY = blinkAnim.interpolate({
    inputRange: [6, 60],
    outputRange: [117, 90], 
  });

  const eyeColor = state === 'FOCUS' ? BOT_COLORS.PURPLE : BOT_COLORS.BLUE_ELECTRIC;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      {/* ANILLO DE ACTIVIDAD EXTERIOR (Girando perfecto sin wobble effect) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: spin }, { scale: scale }],
          }
        ]}
      >
        <Svg width={240} height={240} viewBox="0 0 240 240" style={styles.absoluteTarget}>
          <Defs>
            <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={BOT_COLORS.BLUE_ELECTRIC} />
              <Stop offset="100%" stopColor={BOT_COLORS.PURPLE} />
            </LinearGradient>
          </Defs>
          <Path d="M 194.25 45.75 A 105 105 0 1 1 170 29" stroke="url(#ringGradient)" strokeWidth="6" strokeLinecap="round" fill="none" />
          <Circle cx="194.25" cy="45.75" r="6" fill={BOT_COLORS.BLUE_ELECTRIC} />
        </Svg>
      </Animated.View>

      {/* DISEÑO ORIGINAL DE OJOS Y PARPADEO (Fijo y nítido) */}
      <View style={{ transform: [{ scale: scale }], width: 240, height: 240, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={240} height={240} viewBox="0 0 240 240">
          <Defs>
            <ClipPath id="leftEyeClip">
              <AnimatedRect x="58" y={eyeY} width="45" height={blinkAnim} rx={state === 'FOCUS' ? 8 : 15} />
            </ClipPath>
            <ClipPath id="rightEyeClip">
              <AnimatedRect x="138" y={eyeY} width="45" height={blinkAnim} rx={state === 'FOCUS' ? 8 : 15} />
            </ClipPath>
          </Defs>

          <AnimatedRect x="58" y={eyeY} width="45" height={blinkAnim} rx={state === 'FOCUS' ? 8 : 15} fill={eyeColor} />
          
          <G clipPath="url(#leftEyeClip)">
            {state !== 'FOCUS' ? (
              <Circle cx={120 - 40 + 10} cy={120 - 20} r="4" fill={BOT_COLORS.WHITE} />
            ) : (
              <G>
                <Circle cx={120 - 40 + 10} cy={120 - 5} r="3" fill={BOT_COLORS.WHITE} />
                <Circle cx={120 - 40 + 18} cy={120 + 5} r="2" fill={BOT_COLORS.WHITE} />
              </G>
            )}
          </G>

          <AnimatedRect x="138" y={eyeY} width="45" height={blinkAnim} rx={state === 'FOCUS' ? 8 : 15} fill={eyeColor} />
          
          <G clipPath="url(#rightEyeClip)">
            {state !== 'FOCUS' ? (
              <Circle cx={120 + 40 + 10} cy={120 - 20} r="4" fill={BOT_COLORS.WHITE} />
            ) : (
              <G>
                <Circle cx={120 + 40 + 10} cy={120 - 5} r="3" fill={BOT_COLORS.WHITE} />
                <Circle cx={120 + 40 + 18} cy={120 + 5} r="2" fill={BOT_COLORS.WHITE} />
              </G>
            )}
          </G>
        </Svg>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  absoluteTarget: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
  }
});

// 🚀 EXPORTACIÓN POR DEFECTO (Escudo por si acaso otra pantalla lo pide sin llaves)
export default BotIcon;