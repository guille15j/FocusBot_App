import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { getColors } from '../theme/theme';

export const useAppColors = () => {
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  return colors;
};