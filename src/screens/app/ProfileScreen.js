import React, { useState } from 'react'; // 1. Añadido useState
import { View, useColorScheme, ScrollView, Platform, KeyboardAvoidingView, } from 'react-native';
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
  const colors = updateAppColors(scheme); 
  const globalStyles = getglobalStyles(scheme);
  const { isWeb } = useResponsiveLayout();

  // ESTADOS
  const [firstName, setFirstName] = useState('Juan');
  const [lastName, setLastName] = useState('Pérez');
  const [nickname, setNickname] = useState('juanpi_99');
  const [phone, setPhone] = useState('+34 600 000 000');
  const [email,setEmail] = useState('correo sacado del user');
  const [birthdate, setBirthdate] = useState(new Date('1995-05-15'));
  const [severity, setSeverity] = useState('LEVE');
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [name_detail, setNameDetail] = useState('TDA');
  const [description_detail, setDescription] = useState('Descripción de lo que te pasa');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);

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

            <KeyboardAvoidingView 
              style={isWeb ?  globalStyles.authContainer_web : globalStyles.authContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

              <TextInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                mode="outlined"
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 30 }}
                left={<TextInput.Icon icon="account" />}
              />
              
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                mode="outlined"
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 30 }}
                left={<TextInput.Icon icon="account-group" />}
              />
              
              <TextInput
                label="Nickname"
                value={nickname}
                onChangeText={setNickname}
                mode="outlined"
                autoCapitalize="none"
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 30 }}
                left={<TextInput.Icon icon="at" />}
              />
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 30 }}
                left={<TextInput.Icon icon="email" />}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={globalStyles.input}
                outlineStyle={{ borderRadius: 30 }}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TextInput
                label = 'Timezone'
                value = {timezone}
                onChange = {setTimezone}
                mode = "outlined"
                style = {globalStyles.input}
                outlineStyle = {{borderRadius: 30}}
                left = {<TextInput.Icon icon="clock"/>}
              />

              <TextInput
                label = 'Detalle'
                value = {name_detail}
                onChange= {setNameDetail}
                mode = "outlined"
                style = {globalStyles.input}
                outlineStyle = {{borderRadius: 30}}
                left = {<TextInput.ICon icon="text"/>}
              />

              <TextInput
                label = 'Descripcion'
                value = {description_detail}
                onChange = {setDescription}
                mode = "outlined"
                style = {globalStyles.input}
                outlineStyle = {{borderRadius: 30}}
                left = {<TextInput.ICon icon="text"/>}
              />

              <TextInput
                label = 'Severidad'
                value = {severity}
                onChange={setSeverity}                
                mode = "outlined"
                style = {globalStyles.input}
                outlineStyle = {{borderRadius: 30}}
                left = {<TextInput.ICon icon="text"/>}
              />



              <View style={globalStyles.botonera}>
                <Button
                  mode="contained"
                  onPress={ejecutarActualizacion}
                  loading={loading}
                  disabled={loading}
                  style={[globalStyles.button, { flex: 1 }]}
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                >
                  Register
                </Button>
                
                <Button
                  mode="outlined"
                  onPress={()=> {}}
                  disabled={loading}
                  style={[globalStyles.buttonOutline, { flex: 1 }]}
                >
                  Cancel
                </Button>
              </View>  
              
            </KeyboardAvoidingView>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}