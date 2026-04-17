import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, Surface, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';

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
    <ScreenWrapper>
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
            style={globalStyles.logoutButton}
            textColor={AppColors.error}
            icon="logout"
          >
            Cerrar Sesión
          </Button>
          
        </ScrollView>

        <FAB
        icon="robot"
        style={globalStyles.fab}
        // onPress={() => navigation.replace('LinkBot')}
        
        />
        
      </SafeAreaView>
    </ScreenWrapper>
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
  
});