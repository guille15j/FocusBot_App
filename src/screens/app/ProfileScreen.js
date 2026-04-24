import React, { useState, useMemo } from 'react';
import { View, useColorScheme, ScrollView } from 'react-native';
import { 
  Text, Avatar, TextInput, Surface, IconButton, Button, List, Divider 
} from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';

export default function ProfilePage({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const [firstName, setFirstName] = useState('Juan');
  const [lastName, setLastName] = useState('Pérez');
  const [nickname, setNickname] = useState('juanpi_99');
  const [email, setEmail] = useState('juan.perez@example.com');
  const [password, setPassword] = useState('Password123');
  const [timezone, setTimezone] = useState('UTC+1');
  const [name_detail, setNameDetail] = useState('TDA');
  const [description_detail, setDescription] = useState('Descripción detallada de la condición del usuario.');
  const [severity, setSeverity] = useState('LEVE');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editar, setEditable] = useState(false); 

  const ejecutarActualizacion = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEditable(false); 
    }, 1000);
  };

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        {/* <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}> */}
          {/* <Text style={globalStyles.tituloPagina}>
            Perfil
          </Text> */}
        
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <View style={{ position: 'relative' }}>
              <Avatar.Image
                size={110}
                source={require('../../assets/avatar.png')} 
                style={{ backgroundColor: colors.secondary + '40' }}
              />
              {editar &&
                <Surface style={{ position: 'absolute', right: 0, bottom: 0, backgroundColor: colors.primary, borderRadius: 20 }} elevation={4}>
                  <IconButton icon="pencil" size={20} iconColor={colors.surface} onPress={() => {}} />
                </Surface>
              }
            </View>
            <Text style={{ marginTop: 12, fontWeight: 'bold', color: colors.text, fontSize: 18 }}>
              @{nickname}
            </Text>
          </View>

          {editar ? (
            <View style={[ {marginHorizontal: isWeb ? '25%' : '10%', marginBottom: isWeb? 100 : 50}]}>
              <TextInput label="Nombre" value={firstName} onChangeText={setFirstName} mode="outlined" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="account" />} />
              <TextInput label="Apellidos" value={lastName} onChangeText={setLastName} mode="outlined" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="account-group" />} />
              <TextInput label="Usuario" value={nickname} onChangeText={setNickname} mode="outlined" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="at" />} />
              <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="email" />} />
              
              <TextInput label="Zona Horaria" value={timezone} onChangeText={setTimezone} mode="outlined" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="clock" />} />
              <TextInput label="Detalle" value={name_detail} onChangeText={setNameDetail} mode="outlined" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="information" />} />
              <TextInput 
                label="Descripción" value={description_detail} onChangeText={setDescription} mode="outlined" multiline numberOfLines={4} 
                style={[globalStyles.input, { height: 100, paddingTop: 10 }]} outlineStyle={{ borderRadius: 20 }}
                left={<TextInput.Icon icon="text-subject" />} 
              />
              <TextInput label="Severidad" value={severity} onChangeText={setSeverity} mode="outlined" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="alert-circle" />} />

              <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
                <Button mode="contained" icon="content-save" onPress={ejecutarActualizacion} loading={loading} style={{ flex: 1, borderRadius: 30 }} textColor= {colors.background}>Guardar</Button>
                <Button mode="outlined" onPress={() => setEditable(false)} style={{ flex: 1, borderRadius: 30 }}>Cancelar</Button>
              </View>
            </View>
          ) : (
            <View style={[ {marginHorizontal: isWeb ? '25%' : '10%', marginBottom: isWeb? 100 : 50}]}>
              <Surface style={{ borderRadius: 20, padding: 10, backgroundColor: colors.surface }} elevation={1}>
                <List.Item title="Nombre Completo" description={`${firstName} ${lastName}`} left={p => <List.Icon {...p} icon="account" />} />
                <Divider />
                <List.Item title="Usuario" description={`@${nickname}`} left={p => <List.Icon {...p} icon="at" />} />
                <Divider />
                <List.Item title="Email" description={email} left={p => <List.Icon {...p} icon="email" />} />
                <Divider />
                <List.Item title="Zona Horaria" description={timezone} left={p => <List.Icon {...p} icon="clock" />} />
                <Divider />
                <List.Item title="Condición" description={name_detail} left={p => <List.Icon {...p} icon="medical-bag" />} />
                <Divider />
                <List.Item title="Descripción" description={description_detail} descriptionNumberOfLines={0} left={p => <List.Icon {...p} icon="text-subject" />} />
                <Divider />
                <List.Item title="Severidad" description={severity} left={p => <List.Icon {...p} icon="alert-octagon" />} />
              </Surface>

              <Button 
                mode="contained" icon="pencil" onPress={() => setEditable(true)} 
                style={{ marginTop: 30, borderRadius: 30 }}
                textColor= {colors.background}
              >
                Editar Perfil
              </Button>
            </View>
          )}
        {/* </ScrollView> */}
      </View>
    </ScreenWrapper>
  );
}