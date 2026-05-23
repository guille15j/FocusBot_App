import React, { useState, useMemo, useContext, useEffect } from 'react';
import { View, Pressable, useColorScheme, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {Text, Avatar, TextInput, Surface, IconButton, Button, List, Divider, HelperText, Menu} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';

import {AuthContext} from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext';

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
  const { user, signIn, signOut, deleteAccount } = useContext(AuthContext);
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();

  const showToast = useToast();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  // Campos básicos de identidad
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [timezone, setTimezone] = useState('UTC+0');
  const [name_detail, setNameDetail] = useState('');
  const [description_detail, setDescriptionDetail] = useState('');
  const [severity, setSeverity] = useState('LEVE');

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 

  const [severityMenuVisible, setSeverityMenuVisible] = useState(false);
  const [timezoneMenuVisible, setTimezoneMenuVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const resetFormFields = () => {
    setFirstName(user?.first_name || '');
    setLastName(user?.last_name || '');
    setNickname(user?.nickname || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setProfileImg(user?.profile_img || null);
    setTimezone(user?.timezone || 'UTC+0');
    setNameDetail(user?.name_detail || '');
    setDescriptionDetail(user?.description_detail || '');
    setSeverity(user?.severity || 'LEVE');
    setErrors({});
  };

  useEffect(() => {
    resetFormFields();
  }, [user]);

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  const ejecutarBorrado = async () => {
    console.log('PResionado');
    try {
      await deleteAccount();
      console.log("Cuenta borrada");
    } catch (error) {
      console.error("Error al borrar cuenta:", error);
      showToast?.(`Error: ${error.message}`, 'error');
    }
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
        email: email.toLowerCase().trim(),
        phone: phone,
        profile_img: profileImg,
        timezone: timezone,
        name_detail: name_detail,
        description_detail: description_detail,
        severity: severity,
      };
      
      await UserService.updateUser(datosActualizados);
      const tokenActual = await authStorage.getToken();
      
      const usuarioParaContexto = {
        ...user,
        ...datosActualizados
      };
      
      await signIn(tokenActual, usuarioParaContexto); 
      setIsEditing(false);
      
      // Adaptación multiplataforma para alertas
      if (isWeb) {
        alert("Perfil actualizado correctamente");
      } else {
         showToast( "Perfil actualizado correctamente",'success');
      }
    } catch (error) {
      console.error("ERROR CRÍTICO EN ACTUALIZACIÓN:", error);
      showToast("Ocurrió un fallo al sincronizar los datos locales.",'error');
      // if (isWeb) {
      //   alert("Ocurrió un fallo al sincronizar los datos locales.");
      // } else {
      //    showToast("Ocurrió un fallo al sincronizar los datos locales.",'error');
      // }
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
      if (isWeb) alert('Necesitamos acceso a tus fotos.');
      else  showToast('Permiso denegado.Necesitamos acceso a tus fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, // Compresión estratégica para no sobrecargar almacenamiento Base64
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfileImg(base64Image);
    }
  };

  const severityLabel = SEVERITY_OPTIONS.find(opt => opt.value === severity)?.label || severity;
  const descLength = description_detail?.length || 0;

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        
        {/* SECCIÓN DEL AVATAR */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={120}
              source={profileImg ? { uri: profileImg } : require('../../assets/avatar.png')}
              style={{ backgroundColor: colors.surfaceVariant + '40'}}
            />
            {isEditing && (
              <Surface style={[styles.editBadge, { backgroundColor: colors.primary }]} elevation={4}>
                <IconButton icon="camera" size={18} iconColor={colors.surface} onPress={seleccionarImagen} style={styles.noMargin} />
              </Surface>
            )}
          </View>
          <Text style={[styles.headerNickname, { color: colors.text }]}>
            @{nickname || 'usuario'}
          </Text>
        </View>

        {/* MODO EDICIÓN FORMULARIO */}
        {isEditing ? (
          <View style={[styles.formWrapper, isWeb && styles.webFormWidth]}>
            
            <TextInput
              label="Nombre"
              value={firstName}
              onChangeText={handleChange(setFirstName, 'firstName')}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={styles.inputRound}
              left={<TextInput.Icon icon="account" />}
              error={!!errors.firstName}
            />
            <HelperText type="error" visible={!!errors.firstName}>{errors.firstName}</HelperText>

            <TextInput
              label="Apellidos"
              value={lastName}
              onChangeText={handleChange(setLastName, 'lastName')}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={styles.inputRound}
              left={<TextInput.Icon icon="account-group" />}
              error={!!errors.lastName}
            />
            <HelperText type="error" visible={!!errors.lastName}>{errors.lastName}</HelperText>

            <TextInput
              label="Usuario"
              value={nickname}
              onChangeText={handleChange(setNickname, 'nickname')}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={styles.inputRound}
              left={<TextInput.Icon icon="at" />}
              error={!!errors.nickname}
            />
            <HelperText type="error" visible={!!errors.nickname}>{errors.nickname}</HelperText>

            <TextInput
              label="Email"
              value={email}
              onChangeText={handleChange(setEmail, 'email')}
              mode="outlined"
              keyboardType="email-address"
              style={globalStyles.input}
              outlineStyle={styles.inputRound}
              left={<TextInput.Icon icon="email" />}
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

            {/* Selector de Zona Horaria */}
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
                      outlineStyle={styles.inputRound}
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
            <View style={styles.smallSpacer} />

            <TextInput
              label="Detalle / Condición"
              value={name_detail}
              onChangeText={setNameDetail}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={styles.inputRound}
              left={<TextInput.Icon icon="information" />}
            />
            <View style={styles.smallSpacer} />

            {/* Selector de Severidad */}
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
                      outlineStyle={styles.inputRound}
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
            <View style={styles.smallSpacer} />

            <TextInput
              label="Descripción"
              value={description_detail}
              onChangeText={handleChange(setDescriptionDetail, 'description')}
              mode="outlined"
              multiline
              numberOfLines={4}
              maxLength={250}
              style={styles.multilineInput}
              outlineStyle={styles.multilineRound}
              error={!!errors.description}
              right={
                <TextInput.Affix
                  text={`${descLength}/250`}
                  textStyle={{ fontSize: 12, color: descLength > 250 ? colors.error : colors.placeholder }}
                />
              }
            />
            <HelperText type={errors.description ? 'error' : 'info'} visible={true}>
              {errors.description ? errors.description : `${250 - descLength} caracteres restantes`}
            </HelperText>

            {/* Botones de acción formulario */}
            <View style={styles.rowButtons}>
              <Button
                mode="contained"
                icon="content-save"
                onPress={ejecutarActualizacion}
                loading={loading}
                style={styles.flexButton}
                textColor={colors.background}
              >
                Guardar
              </Button>
              <Button
                mode="outlined"
                onPress={resetFormFields} 
                style={styles.flexButton}
              >
                Cancelar
              </Button>
            </View>
          </View>
        ) : (
          
          /* MODO VISTA DE PERFIL */
          <View style={[styles.formWrapper, isWeb && styles.webFormWidth]}>
            <Surface style={[styles.cardSurface, { backgroundColor: colors.surface }]} elevation={1}>
              <List.Item title="Nombre Completo" description={`${firstName} ${lastName}`} left={p => <List.Icon {...p} icon="account" />} />
              <Divider />
              <List.Item title="Usuario" description={`@${nickname}`} left={p => <List.Icon {...p} icon="at" />} />
              <Divider />
              <List.Item title="Email" description={email} left={p => <List.Icon {...p} icon="email" />} />
              <Divider />
              <List.Item title="Zona Horaria" description={timezone} left={p => <List.Icon {...p} icon="clock" />} />
              <Divider />
              <List.Item title="Condición" description={name_detail || 'No especificada'} left={p => <List.Icon {...p} icon="medical-bag" />} />
              <Divider />
              <List.Item title="Grado" description={severityLabel} left={p => <List.Icon {...p} icon="alert-octagon" />} />
              <Divider />
              <List.Item title="Descripción" description={description_detail || 'Sin descripción'} descriptionNumberOfLines={0} left={p => <List.Icon {...p} icon="view-headline" />} />
            </Surface>

            <Button
              mode="contained"
              icon="pencil"
              onPress={() => setIsEditing(true)}
              style={globalStyles.button}
              textColor={colors.background}
            >
              Editar Perfil
            </Button>
            <Button
              mode="outlined"
              icon="logout"
              onPress={ejecutarLogout}
              style={globalStyles.buttonOutline}
              textColor={colors.primary} 
            >
              Cerrar Sesión
            </Button>
            <Button
              mode="outlined"
              icon="delete"
              onPress={ejecutarBorrado}
              style={[globalStyles.buttonOutline,{borderColor: colors.error}]}
              textColor={colors.error} 
            >
              Elimianr cuenta
            </Button>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center', 
    marginVertical: 20
  },
  avatarContainer: {
    position: 'relative'
  },
  editBadge: {
    position: 'absolute', 
    right: -4, 
    bottom: -4, 
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noMargin: {
    margin: 0
  },
  headerNickname: {
    marginTop: 12, 
    fontWeight: '700', 
    fontSize: 20,
    letterSpacing: 0.3
  },
  formWrapper: {
    marginHorizontal: '8%',
    marginBottom: 60,
  },
  webFormWidth: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  inputRound: {
    borderRadius: 28
  },
  multilineRound: {
    borderRadius: 16
  },
  multilineInput: {
    height: 110, 
    paddingTop: 8
  },
  smallSpacer: {
    height: 6
  },
  rowButtons: {
    flexDirection: 'row', 
    marginTop: 24, 
    gap: 12
  },
  flexButton: {
    flex: 1, 
    borderRadius: 28
  },
  cardSurface: {
    borderRadius: 20, 
    paddingVertical: 6, 
    paddingHorizontal: 4,
    marginBottom: 20
  }
});