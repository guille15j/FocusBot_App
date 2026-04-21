import React, { useState } from 'react'; // 1. Añadido useState
import { View, useColorScheme, ScrollView, Platform } from 'react-native';
// 2. Añadidos los componentes que faltaban de Paper
import { 
  Text, 
  Avatar, 
  TextInput, 
  Surface, 
  IconButton, 
  Button, 
  SegmentedButtons 
} from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getglobalStyles, updateAppColors } from '../../theme/theme';
import DatePicker from '../../components/forms/DatePicker';

export default function ProfilePage({ navigation }) {
  const scheme = useColorScheme();
  
  // IMPORTANTE: updateAppColors devuelve el objeto de colores, lo llamamos 'colors'
  const colors = updateAppColors(scheme); 
  const globalStyles = getglobalStyles(scheme);
  const { isWeb } = useResponsiveLayout();

  // ESTADOS
  const [firstName, setFirstName] = useState('Juan');
  const [lastName, setLastName] = useState('Pérez');
  const [nickname, setNickname] = useState('juanpi_99');
  const [phone, setPhone] = useState('+34 600 000 000');
  const [birthdate, setBirthdate] = useState(new Date('1995-05-15'));
  const [bio, setBio] = useState('Usuario de FocusApp dedicado a la productividad.');
  const [severity, setSeverity] = useState('LEVE');
  const [loading, setLoading] = useState(false);

  const ejecutarActualizacion = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <ScreenWrapper withScroll={false}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            <Text style={[globalStyles.tituloPagina, { textAlign: 'center', marginTop: 20 }]}>
              Perfil
            </Text>
          
            {/* CABECERA: AVATAR */}
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
              <View style={{ position: 'relative' }}>
                <Avatar.Image
                  size={120}
                  source={require('../../assets/avatar.png')} 
                  style={{ backgroundColor: colors.secondary + '40' }}
                />
                <Surface 
                  style={{ 
                    position: 'absolute', 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: colors.primary, 
                    borderRadius: 20 
                  }} 
                  elevation={4}
                >
                  <IconButton
                    icon="camera"
                    size={20}
                    iconColor={colors.surface}
                    onPress={() => console.log("Cambiar foto")}
                  />
                </Surface>
              </View>
              <Text style={{ marginTop: 12, fontWeight: 'bold', color: colors.text }}>
                @{nickname}
              </Text>
            </View>

            {/* FORMULARIO: Usando tus estilos globales */}
            <View style={[globalStyles.form, isWeb && { alignSelf: 'center' }]}>
              
              <TextInput
                label="Nombre"
                mode="outlined"
                value={firstName}
                onChangeText={setFirstName}
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 15 }}
              />

              <TextInput
                label="Apellidos"
                mode="outlined"
                value={lastName}
                onChangeText={setLastName}
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 15 }}
              />

              <TextInput
                label="Nombre de usuario"
                mode="outlined"
                value={nickname}
                onChangeText={setNickname}
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 15 }}
                left={<TextInput.Icon icon="at" />}
              />

              <TextInput
                label="Teléfono"
                mode="outlined"
                value={phone}
                onChangeText={setPhone}
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 15 }}
                left={<TextInput.Icon icon="phone" />}
              />

              <DatePicker
                label="Fecha de Nacimiento"
                value={birthdate}
                onChange={setBirthdate}
              />

              <TextInput
                label="Biografía"
                mode="outlined"
                multiline
                numberOfLines={3}
                value={bio}
                onChangeText={setBio}
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 15 }}
              />

              <Text style={{ fontSize: 14, fontWeight: 'bold', marginVertical: 10, color: colors.textLight }}>
                Prioridad
              </Text>
              
              <SegmentedButtons
                value={severity}
                onValueChange={setSeverity}
                buttons={[
                  { value: 'LEVE', label: 'Leve' },
                  { value: 'MODERADO', label: 'Medio' },
                  { value: 'URGENTE', label: 'Alto' },
                ]}
                style={{ marginBottom: 20 }}
              />

              {/* BOTONERA GLOBAL */}
              <View style={globalStyles.botonera}>
                <Button 
                  mode="contained" 
                  onPress={ejecutarActualizacion}
                  loading={loading}
                  disabled={loading}
                  style={[globalStyles.button, { flex: 1 }]}
                >
                  Guardar
                </Button>
                
                <Button 
                  mode="outlined" 
                  onPress={() => navigation?.goBack()}
                  disabled={loading}
                  textColor={colors.error}
                  style={[globalStyles.buttonOutline, { flex: 1, borderColor: colors.error }]}
                >
                  Cancelar
                </Button>
              </View>
            </View>
        
          </ScrollView>
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}