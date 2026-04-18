import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Platform, StyleSheet } from 'react-native';
import { useAppColors } from '../hooks/useAppColors';


export const LightColors = {
  primary:     '#A8DADC', // Menta empolvado (Calma visual)
  secondary:   '#BDB2FF', // Lavanda suave (Creatividad)
  background:  '#FDFCFB', // Blanco pergamino (Lujo orgánico)
  surface:     '#FFFFFF', 
  text:        '#4A4E69', // Gris malva oscuro (Elegante y legible)
  textLight:   '#9A8C98', // Arena grisáceo
  error:       '#E5989B', // Rosa coral pastel
  placeholder: '#948b89',
};

export const DarkColors = {
  primary:     '#BEE1E6', // Azul tiza (Luz suave)
  secondary:   '#E2ECE9', // Verde bruma
  background:  '#1E1E24', // Negro carbón suave (No absoluto)
  surface:     '#2D2D34', // Gris mineral
  text:        '#F0EFEB', // Blanco lino (Cálido y relajado)
  textLight:   '#ADACB5', // Gris seda
  error:       '#FFB7B2', // Melocotón pastel
  placeholder: '#5E5E66',
};

export let AppColors = DarkColors;

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
    section:{
      paddingHorizontal: 40,
      paddingVertical: 20,
      margin: 20,
      maxHeight: 1000,
      // minHeight: 300,
      borderRadius:20,
      backgroundColor: AppColors.secondary + 20,
      overflow: 'hidden'
    },
    section_huge:{
      paddingHorizontal: 0,
      paddingVertical: 0,
      // margin: 20,
      maxHeight: 1000,
      // minHeight: 300,
      borderRadius:20,
      backgroundColor: AppColors.secondary + 20,
      overflow: Platform.OS === 'web'? 'scroll' : 'visible',
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
      // paddingVertical: 6,
      borderRadius: 30,
      backgroundColor: AppColors.primary,
    },
    buttonOutline: {
      marginTop: 12,
      // paddingVertical: 6,
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
      bottom: 100, 
      borderRadius: 150
    },
  });
};

