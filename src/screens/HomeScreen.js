// src/screens/HomeScreen.js
import React, {useState,useEffect} from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Button, FAB } from 'react-native-paper';
import { AuthContext } from '../services/AuthContext';
import { globalStyles,  } from '../theme/theme';
import ListaBots from '../components/ListBot';
import GridBots from '../components/GridBots';
import {BotService} from '../services/apiService'

const screenWidth = Dimensions.get('window').width;

// Si la pantalla es ancha (más de 600px), ponemos 3 columnas, si no, 2.
const columnas = screenWidth > 600 ? 5 : (screenWidth > 300 ? 2 : 1);

export default function HomeScreen({ navigation }) {
  const [bots, setBots] = useState([]);
  const [cargando, setCargando] = useState(true);

  const { signOut } = React.useContext(AuthContext);

  const ejecutarLogOut = async () => {
    try{
      await signOut();
      console.log("Sesión cerrada correctamente");
    }catch(error){
      console.error("Error al cerrar sesión", error);
    }
  };

  const obtenerBots = async () => {
    setCargando(true);
    try {
      setBots([]);
      const data = await BotService.getBots();
      setBots(data);
    } catch (error) {
      console.error("Error al obtener bots:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    //Cargar al inicializar
    obtenerBots();
  }, []);
  

  return (
    <View style={globalStyles.container}>
      
      
      <Text variant="headlineMedium">¡Bienvenido a FocusBot!</Text>
      <Text style={globalStyles.info}>Aquí aparecerán tus dispositivos pronto.</Text>
      <Button 
          mode="contained" 
          onPress={ejecutarLogOut}
      >
          Cerrar Sesion
      </Button>

      <Button 
          mode="contained" onPress={obtenerBots} >adsdas</Button>

      

      <GridBots data={bots} numColumns={columnas}/>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ListaBots data={bots}/>
      </ScrollView>
      
      <FAB
        icon="robot"
        style={globalStyles.fab}
        onPress={() => navigation.replace('LinkBot')}
        // onPress={() => console.log("Ir a vincular...")}
      />
    </View>
  );
}
