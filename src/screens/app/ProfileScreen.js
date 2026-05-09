import React, { useState, useMemo, useContext } from 'react';
import { View, Pressable, useColorScheme, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {
  Text, Avatar, TextInput, Surface, IconButton, Button, List, Divider, HelperText, Menu
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';

import { AuthContext } from '../../context/AuthContext';
import { authStorage } from '../../core/authStorage';
import { UserService } from '../../api/apiService';

const SEVERITY_OPTIONS = [
  { label: 'Leve', value: 'LEVE' },
  { label: 'Medio', value: 'MEDIO' },
  { label: 'Alto', value: 'ALTO' },
];

const TIMEZONE_OPTIONS = [
  'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5',
  'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3',
  'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11',
  'UTC+12', 'UTC+13', 'UTC+14',
];

export default function ProfilePage({ navigation }) {
  const { user, signIn, signOut } = useContext(AuthContext);
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();

  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  // Campos básicos de identidad
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  // Imagen de perfil (Base64 / LargeText)
  const [profileImg, setProfileImg] = useState(user?.profile_img || null);
  // Preferencias y localización
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC+0');
  // Detalles médicos / Condición (campos específicos de tu DB)
  const [name_detail, setNameDetail] = useState(user?.name_detail || '');
  const [description_detail, setDescriptionDetail] = useState(user?.description_detail || '');
  const [severity, setSeverity] = useState(user?.severity || 'LEVE');

  const [loading, setLoading] = useState(false);
  const [editar, setEditable] = useState(false);

  const [severityMenuVisible, setSeverityMenuVisible] = useState(false);
  const [timezoneMenuVisible, setTimezoneMenuVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!firstName.trim()) nuevosErrores.firstName = 'El nombre es obligatorio';
    if (!lastName.trim()) nuevosErrores.lastName = 'Los apellidos son obligatorios';
    if (!nickname.trim()) nuevosErrores.nickname = 'El nombre de usuario es obligatorio';
    if (!email.trim() || !email.includes('@')) nuevosErrores.email = 'Introduce un email válido';
    if (description_detail.length > 250) nuevosErrores.description = 'La descripción no puede superar los 250 caracteres';
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const ejecutarActualizacion = async () => {
    if (!validarFormulario()) return;
    setLoading(true);

    try {
      const datosActualizados = {
        first_name: firstName,
        last_name: lastName,
        nickname: nickname,
        email: email.toLowerCase(),
        phone: phone,
        profile_img: profileImg,
        timezone: timezone,
        name_detail: name_detail,
        description_detail: description_detail,
        severity: severity,
      };
      
      console.log('1. Enviando a servidor...');
      await UserService.updateUser(datosActualizados);
      
      console.log('2. Obteniendo token...');
      const tokenActual = await authStorage.getToken();
      
      // IMPORTANTE: Creamos el objeto nuevo asegurándonos de no enviar undefined
      const usuarioParaContexto = {
        ...user, // Mantenemos lo que ya había (como el user_id)
        ...datosActualizados
      };

      console.log('3. Actualizando Contexto con:', usuarioParaContexto.nickname);
      
      // Llamamos al signIn
      await signIn(tokenActual, usuarioParaContexto); 
      
      console.log('4. ¡Contexto actualizado! Cerrando edición...');
      
      // SI LLEGA AQUÍ, SE CERRARÁ EL MODO EDICIÓN
      setEditable(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    
    } catch (error) {
      console.error("ERROR CRÍTICO EN ACTUALIZACIÓN:", error);
      Alert.alert("Error", "Ocurrió un fallo al sincronizar los datos locales.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setter, field) => (text) => {
    setter(text);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Cambiado de deprecated ImagePicker.MediaTypeOptions.Images
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, // Calidad baja para asegurar que el string Base64 no se bloquee
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      console.log('Imagen seleccionada. Longitud base64:', base64Image.length); // DEBUG VITAL
      setProfileImg(base64Image);
    } else if (!result.canceled) {
        console.warn("La imagen no contiene datos Base64");
    }
  };

  const severityLabel = SEVERITY_OPTIONS.find(opt => opt.value === severity)?.label || severity;

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <View style={{ position: 'relative' }}>
            <Avatar.Image
              size={120}
              /* IMPORTANTE: Aquí ocurre la "decodificación". 
                Al pasarle el string Base64 en el objeto { uri: ... }, 
                React Native lo renderiza automáticamente como imagen.
              */
              source={
                profileImg 
                  ? { uri: profileImg } 
                  : require('../../assets/avatar.png') // Imagen por defecto
              }
              style={{ backgroundColor: colors.surfaceVariant + 40}}
            />
            {editar && (
              // Cambbiar imagen de perfil
              <Surface style={{ position: 'absolute', right: 0, bottom: 0, backgroundColor: colors.primary, borderRadius: 20 }} elevation={4}>
                <IconButton icon="pencil" size={20} iconColor={colors.surface} onPress={seleccionarImagen} />
              </Surface>
            )}
          </View>
          <Text style={{ marginTop: 12, fontWeight: 'bold', color: colors.text, fontSize: 18 }}>
            @{nickname}
          </Text>
        </View>

        {editar ? (
          <View style={{ marginHorizontal: isWeb ? '25%' : '10%', marginBottom: isWeb ? 100 : 50 }}>
            {/* Nombre */}
            <TextInput
              label="Nombre"
              value={firstName}
              onChangeText={handleChange(setFirstName, 'firstName')}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="account" />}
              error={!!errors.firstName}
            />
            <HelperText type="error" visible={!!errors.firstName}>{errors.firstName}</HelperText>

            {/* Apellidos */}
            <TextInput
              label="Apellidos"
              value={lastName}
              onChangeText={handleChange(setLastName, 'lastName')}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="account-group" />}
              error={!!errors.lastName}
            />
            <HelperText type="error" visible={!!errors.lastName}>{errors.lastName}</HelperText>

            {/* Usuario */}
            <TextInput
              label="Usuario"
              value={nickname}
              onChangeText={handleChange(setNickname, 'nickname')}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="at" />}
              error={!!errors.nickname}
            />
            <HelperText type="error" visible={!!errors.nickname}>{errors.nickname}</HelperText>

            {/* Email */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={handleChange(setEmail, 'email')}
              mode="outlined"
              keyboardType="email-address"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="email" />}
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

            {/* Dropdown de Zona Horaria (ahora con estilo TextInput) */}
            <Menu
              visible={timezoneMenuVisible}
              onDismiss={() => setTimezoneMenuVisible(false)}
              anchor={
                <Pressable onPress={() => setTimezoneMenuVisible(true)}>
                  <View pointerEvents="none">
                    <TextInput
                      label="Zona Horaria"
                      value={timezone}
                      mode="outlined"
                      editable={false}
                      style={globalStyles.input}
                      outlineStyle={{ borderRadius: 30 }}
                      left={<TextInput.Icon icon="clock" />}
                      right={<TextInput.Icon icon="menu-down" />}
                    />
                  </View>
                </Pressable>
              }
            >
              {TIMEZONE_OPTIONS.map((zone) => (
                <Menu.Item
                  key={zone}
                  title={zone}
                  onPress={() => {
                    setTimezone(zone);
                    setTimezoneMenuVisible(false);
                  }}
                  leadingIcon={() => (
                    <MaterialCommunityIcons
                      name={zone === timezone ? 'radiobox-marked' : 'radiobox-blank'}
                      size={20}
                      color={colors.primary}
                    />
                  )}
                />
              ))}
            </Menu>

            {/* Detalle */}
            <TextInput
              label="Detalle"
              value={name_detail}
              onChangeText={setNameDetail}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="information" />}
            />

            {/* Dropdown de Severidad (ahora con estilo TextInput) */}
            <Menu
              visible={severityMenuVisible}
              onDismiss={() => setSeverityMenuVisible(false)}
              anchor={
                <Pressable onPress={() => setSeverityMenuVisible(true)}>
                  <View pointerEvents="none">
                    <TextInput
                      label="Severidad"
                      value={severityLabel}
                      mode="outlined"
                      editable={false}
                      style={globalStyles.input}
                      outlineStyle={{ borderRadius: 30 }}
                      left={<TextInput.Icon icon="alert-circle" />}
                      right={<TextInput.Icon icon="menu-down" />}
                    />
                  </View>
                </Pressable>
              }
            >
              {SEVERITY_OPTIONS.map((option) => (
                <Menu.Item
                  key={option.value}
                  title={option.label}
                  onPress={() => {
                    setSeverity(option.value);
                    setSeverityMenuVisible(false);
                  }}
                  leadingIcon={() => (
                    <MaterialCommunityIcons
                      name={option.value === severity ? 'radiobox-marked' : 'radiobox-blank'}
                      size={20}
                      color={colors.primary}
                    />
                  )}
                />
              ))}
            </Menu>

            {/* Descripción */}
            <TextInput
              label="Descripción"
              value={description_detail}
              onChangeText={handleChange(setDescriptionDetail, 'description')}
              mode="outlined"
              multiline
              numberOfLines={4}
              maxLength={250}
              style={[globalStyles.input, { height: 100, paddingTop: 10 }]}
              outlineStyle={{ borderRadius: 20 }}
              left={<TextInput.Icon icon="view-headline" />}
              error={!!errors.description}
              right={
                <TextInput.Affix
                  text={`${description_detail.length}/250`}
                  textStyle={{ fontSize: 12, color: description_detail.length > 250 ? colors.error : colors.textLight }}
                />
              }
            />
            <HelperText type={errors.description ? 'error' : 'info'} visible={!!errors.description || description_detail.length > 240}>
              {errors.description
                ? errors.description
                : description_detail.length >= 250
                  ? 'Has alcanzado el límite de caracteres'
                  : `${250 - description_detail.length} caracteres restantes`}
            </HelperText>

            

            {/* Botones */}
            <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
              <Button
                mode="contained"
                icon="content-save"
                onPress={ejecutarActualizacion}
                loading={loading}
                style={{ flex: 1, borderRadius: 30 }}
                textColor={colors.background}
              >
                Guardar
              </Button>
              <Button
                mode="outlined"
                onPress={() => { setEditable(false); setErrors({}); }}
                style={{ flex: 1, borderRadius: 30 }}
              >
                Cancelar
              </Button>
            </View>
          </View>
        ) : (
          <View style={{ marginHorizontal: isWeb ? '25%' : '10%', marginBottom: isWeb ? 100 : 50 }}>
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
              <List.Item title="Grado" description={severityLabel} left={p => <List.Icon {...p} icon="alert-octagon" />} />
              <Divider />
              <List.Item title="Descripción" description={description_detail} descriptionNumberOfLines={0} left={p => <List.Icon {...p} icon="view-headline" />} />
              
            </Surface>

            <Button
              mode="contained"
              icon="pencil"
              onPress={() => setEditable(true)}
              style={globalStyles.button}
              textColor={colors.background}
            >
              Editar Perfil
            </Button>
            <Button
              mode="outlined"
              icon="logout"
              onPress={() => ejecutarLogout() }
              style={globalStyles.buttonOutline}
            >
              Cerrar Sesion
            </Button>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}