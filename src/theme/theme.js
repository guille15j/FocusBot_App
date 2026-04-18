import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAppColors } from '../hooks/useAppColors';


export const LightColors = {
  primary:     '#0095C7', // Color 2: Azul vibrante (Enfoque activo)
  secondary:   '#29B9E0', // Color 1: Cyan eléctrico (Acentos leves)
  background:  '#F5F7FA', // Blanco gélido para limpieza absoluta
  surface:     '#FFFFFF', 
  text:        '#03045E', // Color 5: El azul más profundo para el texto
  textLight:   '#023C88', // Color 4: Azul marino para jerarquía secundaria
  error:       '#D11149',
  placeholder: '#7E9EC9', 
};

export const DarkColors = {
  primary:     '#29B9E0', // Color 1: Ahora es el protagonista sobre el fondo oscuro
  secondary:   '#0095C7', // Color 2: Para estados secundarios
  background:  '#01021A', // Una versión más profunda del Color 5 (Lujo espacial)
  surface:     '#03045E', // Color 5: Tarjetas que emergen del fondo
  text:        '#F0F9FF', // Blanco azulado (Suave, no puro)
  textLight:   '#0077B8', // Color 3: Azul medio para detalles
  error:       '#FF4D4D',
  placeholder: '#023C88', // Color 4
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

