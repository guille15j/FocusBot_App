import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, Platform, useColorScheme, Pressable } from 'react-native'; 
import { Avatar, Text, IconButton } from 'react-native-paper';
import { getColors } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';
import { BotIcon } from '../BotIcon';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';



const UserHeader = ({ user, navigation }) => {
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const { isWeb, platform } = useResponsiveLayout();
  const { signOut } = useContext(AuthContext);
  const styles = useMemo(() => getStyles(colors, isWeb), [colors]);

  if (!user) return null;
  else {
    // console.log("--- DEBUG FOTO ---");
    // console.log("¿Existe objeto user?:", !!user);
    // console.log("¿Tiene profile_img?:", !!user?.profile_img);
    // console.log("Longitud del string:", user?.profile_img?.length);
    // console.log("Comienzo del string:", user?.profile_img?.substring(0, 50));
    // console.log("------------------");
  }

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  const avatarSource = useMemo(() => {
    return user.profile_img 
      ? { uri: user.profile_img } 
      : require('../../assets/avatar.png');
  }, [user.profile_img]);

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.topBarContainer,
        !isWeb && pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] } // Feedback sutil al presionar la barra
      ]}
      onPress={() => navigation && navigation.navigate('Profile')}
    >
      <View style={styles.userContainer}>
        {!isWeb ? (
          <>
            {/* VISTA MÓVIL OPTIMIZADA */}
            <Avatar.Image 
              size={54} 
              source={avatarSource} 
              style={styles.avatarShadow}
            />
            <View style={styles.textContainer}>
              <Text variant="titleMedium" style={styles.userName} numberOfLines={1}>
                {user.first_name} {user.last_name}
              </Text>
              {/* 🚀 CORRECCIÓN: Paréntesis para evitar que concatene '#' con undefined */}
              <Text variant="bodySmall" style={styles.userDetail} numberOfLines={1}>
                {user.nickname ? `@${user.nickname}` : user.email}
              </Text>
            </View>
            
            <View style={{ flex: 1 }} />
            
            {/* 🚀 REDISEÑO: Botón de logout más limpio y con hitSlop para evitar falsas pulsaciones al ir al perfil */}
            <IconButton 
              mode="subtle" 
              icon="logout" 
              size={20} 
              onPress={ejecutarLogout} 
              iconColor={colors.error || '#E57373'} // Un color rojizo sutil o tu color de error
              containerColor={colors.error + '10'}  // Fondo translúcido suave
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} 
            />
          </>
        ) : (
          /* VISTA WEB OPTIMIZADA */
          <View style={styles.webWrapper}>
            <Avatar.Image size={80} source={avatarSource} style={styles.avatarShadow} />
            <View style={styles.textContainerWeb}>
              <Text style={styles.userTitleWeb}>¡Hola de nuevo!</Text>
              <Text style={styles.userNameWeb}>{user.first_name} {user.last_name}</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
};


const getStyles = (colors, isWeb) => StyleSheet.create({
  topBarContainer: {
    backgroundColor: isWeb ? 'transparent' : colors.surface,
    borderRadius: isWeb ? 0 : 20,
    marginHorizontal: isWeb ? 0 : 16,
    marginTop: isWeb ? 0 : 8,
    marginBottom: isWeb ? 0 : 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: isWeb ? 0 : 2, 
    shadowColor: isWeb ? 'transparent' : '#000',
    shadowOffset: isWeb ? { width: 0, height: 0 } : { width: 0, height: 2 },
    shadowOpacity:isWeb ? 0 : 0.08,
    shadowRadius: isWeb? 0 : 3,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarShadow: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
      android: { elevation: 1 }
    })
  },
  userName: {
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.1,
  },
  userDetail: {
    fontWeight: '500',
    color: colors.placeholder,
    marginTop: 1,
  },
  /* ESTILOS ESPECÍFICOS PARA LA WEB */
  webWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    margin: 20 
  },
  textContainerWeb: {
    marginLeft: 20,
  },
  userTitleWeb: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  userNameWeb: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  }
});

export default UserHeader;