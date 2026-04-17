import { MD3LightTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const AppColors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  background: '#F8F9FE',
  surface: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
  error: '#FF6B6B',
  placeholder: '#A0A0A0',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: AppColors.primary,
    secondary: AppColors.secondary,
    background: AppColors.background,
    surface: AppColors.surface,
    onSurface: AppColors.text,
  },
  roundness: 16,
};

export const CombinedDefaultTheme = theme;

export const globalStyles = StyleSheet.create({
  container_web:{
    // backgroundColor: '#f00',
    minHeight: '100dvh'
  },
  container_movil:{
    // backgroundColor: 'rgb(0, 13, 255)',
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
    bottom: 100, 
    borderRadius: 150
  },
});