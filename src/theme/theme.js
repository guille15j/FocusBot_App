import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAppColors } from '../hooks/useAppColors';


export const LightColors = {
  primary:    '#5B4BFF', // Indigo elegante
  secondary:  '#FF6B8A', // Rosa coral suave
  background: '#F7F8FC', // Gris azulado premium
  surface:    '#FFFFFF', // Tarjetas limpias
  text:       '#1E1E1E', // Negro suave
  textLight:  '#6B7280', // Gris profesional
  error:      '#FF6B6B',
  placeholder:'#A0A4B8',
};

export const DarkColors = {
  primary:    '#8eff84', // Indigo más luminoso para dark
  secondary:  '#8ffff6',
  background: '#121212', // Negro real
  surface:    '#1E1E1E', // Tarjetas oscuras
  text:       '#E5E7EB', // Gris claro
  textLight:  '#9CA3AF',
  error:      '#FF6B6B',
  placeholder:'#6B7280',
};


export let AppColors = LightColors;

export const updateAppColors = (scheme) => {
  AppColors = scheme === 'dark' ? DarkColors : LightColors;
  return AppColors;
};


export const getAppTheme = (scheme) => {
  const colors = scheme === 'dark' ? DarkColors : LightColors;

  const baseTheme = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      surface: colors.surface,
      onSurface: colors.text,
    },
    roundness: 16,
  };
};


export const getglobalStyles = (scheme) => {
  updateAppColors(scheme);

  return StyleSheet.create({
    container_web:{
      backgroundColor: AppColors.background,
      minHeight: '100dvh'
    },
    container_movil:{
      backgroundColor: AppColors.background,
      minHeight: '100%'   
    },
    logoutButton: {
      margin: 20,
      marginTop: 30,
      marginBottom: 100, // Espacio para la barra inferior
      borderColor: AppColors.error,
      borderRadius: 30,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logoContainer_name: {
      display: 'flex',
      flexDirection: "row"

    },
    logo_focus: {
      fontSize: 42,
      fontWeight: 'bold',
      color: AppColors.primary,
      marginBottom: 8,
    },
    logo_bot: {
      fontSize: 42,
      fontWeight: 'bold',
      color: AppColors.text,
      marginBottom: 8,
    },
    logoSubtitle: {
      fontSize: 16,
      color: AppColors.textLight,
    },
    authContainer: {
      flex: 1,
      display: 'flex',
      // alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      backgroundColor: 'transparent',
    },
    authContainer_web: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      backgroundColor: 'transparent',
    },
    form: {
      backgroundColor: AppColors.surface,
      borderRadius: 20,
      padding: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      maxWidth: '500px',
      minWidth: '400px'
    },
    input: {
      backgroundColor: AppColors.surface,
      marginBottom: 12,
    },
    button: {
      marginTop: 12,
      paddingVertical: 6,
      borderRadius: 30,
      backgroundColor: AppColors.primary,
    },
    buttonOutline: {
      marginTop: 12,
      paddingVertical: 6,
      borderRadius: 30,
      borderColor: AppColors.primary,
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    link: {
      color: AppColors.primary,
      fontWeight: '600',
    },
    botonera: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    card: {
      backgroundColor: AppColors.surface,
      borderRadius: 20,
      padding: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    fab: { 
      backgroundColor: AppColors.primary, 
      position: 'absolute', 
      margin: 16, 
      right: 0, 
      // bottom: 100, 
      borderRadius: 150
    },
  });
};

