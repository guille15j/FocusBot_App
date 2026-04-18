import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { DarkColors, LightColors } from '../theme/theme';

export const useAppColors = () => {
  // 1. Obtenemos el esquema del sistema (dark, light o null/undefined)
  const scheme = useColorScheme(); 

  // 2. Usamos useMemo para que los colores solo se recalculen si el scheme cambia
  // Esto evita cálculos innecesarios en cada renderizado.
  const colors = useMemo(() => {
    return scheme === 'dark' ? DarkColors : LightColors;
  }, [scheme]);

  return colors;
};