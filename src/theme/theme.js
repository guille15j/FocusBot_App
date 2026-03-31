import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { StyleSheet } from 'react-native';

// Definición de colores amigables para TDAH 
// (Tonos suaves, menos "agresivos" que el azul eléctrico o blanco puro)
export const AppColors = {
  primary: '#ef5d5d',     // Un violeta suave, no chillón
  secondary: '#70D6FF',   // Azul claro para calma
  background: '#ef5d5d46',  // Off-white para evitar el brillo excesivo
  surface: '#FFFFFF',
  text: '#2D3436',        // Gris muy oscuro en lugar de negro puro
  error: '#FF6B6B',
  placeholder: '#A2A2A2',
  accent: '#FFD93D',      // Amarillo suave para elementos de atención
};

// Configuración de fuentes (Legibilidad es clave para TDAH)
const fontConfig = {
  fontFamily: 'System', // O una fuente Sans Serif limpia
};

// 1. OBJETO PARA REACT NATIVE PAPER (Componentes de la librería)
export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: AppColors.primary,
    secondary: AppColors.secondary,
    background: AppColors.background,
    surface: AppColors.surface,
    onSurface: AppColors.text,
    outline: AppColors.primary,
  },
  roundness: 3, // Esquinas un poco más redondeadas transmiten calma
};

// 2. HOJA DE ESTILOS GLOBAL (Para tus contenedores y vistas propias)
export const globalStyles = StyleSheet.create({
    fullScreen: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 24, // Más espacio (aire) para evitar sensación de encierro
        backgroundColor: AppColors.background 
    },
    card: { 
        backgroundColor: AppColors.surface,
        elevation: 2, 
        borderRadius: 16, 
        padding: 16,
        marginTop: 150,
        marginBottom: 150
    },
    header: { 
        alignItems: 'center', 
        marginBottom: 30 
    },
    icon: { 
        backgroundColor: AppColors.primary, 
        marginBottom: 12 
    },
    title: { 
        fontSize: 26, 
        fontWeight: '700', 
        color: AppColors.text,
        textAlign: 'center',
        letterSpacing: 0.5 // Mejor legibilidad
    },
    subtitle: { 
        color: '#636E72', 
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22 
    },
    border_radius: {
        borderRadius: 16,
    },
    input: { 
        backgroundColor: AppColors.surface,
        marginTop: 5,
        marginBottom: 5
    },
    botonera: {
        flexDirection: 'row',
        gap: 12,
        padding: 5,
        width: '100%',     
        marginTop: 16
    },

    button: { 
        flex: 1,
        paddingVertical: 6, 
        borderRadius: 160, 
        maxHeight: 50
    },

    link: {
        alignSelf: "center",
        padding: 10
    },
    linkText: {
        color: AppColors.primary,
        fontWeight: "600",
    },
    fab: { 
        backgroundColor: AppColors.primary, 
        position: 'absolute', 
        margin: 16, 
        right: 0, 
        bottom: 0 
    },
    container: { 
        flex: 1, 
        padding: 20, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    info: { 
        marginTop: 10, 
        color: 'gray' 
    },
});