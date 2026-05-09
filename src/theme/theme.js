// theme.js - CORREGIDO
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Platform, StyleSheet } from 'react-native';

export const LightColors = {
  "primary": "#2E7D7A",
  "secondary": "#7FD1C8",
  "background": "#F4F7F7",
  "surface": "#FFFFFF",
  "text": "#1F2A2E",
  "textLight": "#6B7C85",
  "error": "#E85C5C",
  "placeholder": "#AAB8BE"
};

export const DarkColors = {
  "primary": "#4DB6AC",
  "secondary": "#2E7D7A",
  "background": "#0F1416",
  "surface": "#172025",
  "text": "#E6F1F0",
  "textLight": "#9BB3B1",
  "error": "#FF7A7A",
  "placeholder": "#5F7A78"
};

export const getColors = (scheme) => {
  return scheme === 'dark' ? DarkColors : LightColors;
};

export const updateAppColors = (scheme) => {
  return getColors(scheme);
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

export const getglobalStyles = (scheme, isWeb = false) => {
  const colors = getColors(scheme);

  return StyleSheet.create({
    container_web:{
      backgroundColor: colors.background,
      minHeight: '100vh',
    },
    container_movil:{
      backgroundColor: colors.background,
      minHeight: '100%',   
    },
    section:{
      paddingHorizontal: 20,
      paddingVertical: 20,
      margin: 20,
      maxHeight: 1000,
      borderRadius:20,
      backgroundColor: colors.secondary + '20',
    },
    section_huge:{
      paddingHorizontal: 10,
      paddingVertical: 0,
      marginHorizontal: 20,
      maxHeight: 1000,
      borderRadius:20,
      backgroundColor: colors.secondary + '20',
      overflow: Platform.OS === 'web' ? 'scroll' : 'visible',
    },
    logoutButton: {
      margin: 20,
      marginTop: 30,
      marginBottom: 100,
      borderColor: colors.error,
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
      color: colors.primary,
      marginBottom: 8,
    },
    logo_bot: {
      fontSize: 42,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    logoSubtitle: {
      fontSize: 16,
      color: colors.textLight,
    },
    authContainer: {
      flex: 1,
      display: 'flex',
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
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      maxWidth: 500,
      minWidth: 300,
    },
    input: {
      backgroundColor: colors.surface,
      marginBottom: 12,
    },
    button: {
      marginTop: 12,
      borderRadius: 30,
      backgroundColor: colors.primary,
    },
    buttonOutline: {
      marginTop: 12,
      borderRadius: 30,
      borderColor: colors.primary,
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      // marginTop: 20
    },
    link: {
      color: colors.primary,
      fontWeight: '600',
      textAlign: 'center'
    },
    botonera: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    fab: { 
      backgroundColor: colors.primary, 
      position: 'absolute', 
      margin: 16, 
      right: 0, 
      bottom: 100, 
      borderRadius: 150
    },
    tituloPagina: {
      fontSize: 42,
      alignItems: 'center',
      marginHorizontal: 20, 
      color: colors.primary
    }
  });
};