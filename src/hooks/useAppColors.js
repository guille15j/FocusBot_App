import { Alert, useColorScheme } from 'react-native';

import { DarkColors, LightColors } from '../theme/theme';

export const useAppColors = () => {
  const scheme = useColorScheme(); 
  Alert.alert(scheme.toString())
  return scheme === 'dark' ? DarkColors : LightColors;
};
