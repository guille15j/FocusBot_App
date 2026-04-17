import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Contexto para obtener datos del usuario y función de logout
import { AuthContext } from '../../context/AuthContext';
import { globalStyles, AppColors } from '../../theme/theme';

export default function HomeScreen({ navigation }) {
  
  // Obtenemos los datos del usuario y la función signOut del contexto
  const { user, signOut } = useContext(AuthContext);
  
  // Función para cerrar sesión
  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  return (
    <SafeAreaView style={globalStyles.container} edges={['top']}>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* ========== CABECERA CON DATOS DEL USUARIO ========== */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={50} 
              label={user?.first_name?.charAt(0) || 'U'} 
              style={{ backgroundColor: AppColors.primary }}
            />
            <View style={styles.userText}>
              <Text variant="titleMedium" style={styles.welcome}>
                Bienvenido,
              </Text>
              <Text variant="headlineSmall" style={styles.userName}>
                {user?.first_name} {user?.last_name}
              </Text>
            </View>
          </View>
        </View>
        
        {/* ========== TARJETA DE ESTADÍSTICAS ========== */}
        <Surface style={styles.statsCard} elevation={2}>
          <Text variant="titleMedium" style={styles.statsTitle}>
            Resumen de Hoy
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Sesiones</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0h</Text>
              <Text style={styles.statLabel}>Enfoque</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Bots</Text>
            </View>
          </View>
        </Surface>
        
        {/* ========== SECCIÓN DE ACTIVIDAD RECIENTE ========== */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Actividad Reciente
          </Text>
          
          <Card style={styles.activityCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={{ color: AppColors.textLight }}>
                No hay actividad reciente
              </Text>
              <Text variant="bodySmall" style={{ marginTop: 8, color: AppColors.placeholder }}>
                ¡Comienza una sesión de enfoque para ver tu progreso!
              </Text>
            </Card.Content>
          </Card>
        </View>
        
        <Button
          mode="outlined"
          onPress={ejecutarLogout}
          style={styles.logoutButton}
          textColor={AppColors.error}
          icon="logout"
        >
          Cerrar Sesión
        </Button>
        
      </ScrollView>
      
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 16,
  },
  welcome: {
    color: AppColors.textLight,
  },
  userName: {
    color: AppColors.text,
    fontWeight: '600',
  },
  statsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
  },
  statsTitle: {
    color: AppColors.text,
    marginBottom: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: AppColors.textLight,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    color: AppColors.text,
    marginBottom: 12,
    fontWeight: '500',
  },
  activityCard: {
    borderRadius: 16,
    backgroundColor: AppColors.surface,
  },
  logoutButton: {
    margin: 20,
    marginTop: 30,
    marginBottom: 100, // Espacio para la barra inferior
    borderColor: AppColors.error,
    borderRadius: 30,
  },
});