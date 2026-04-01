import React, { useState } from 'react';
import { View, ScrollView, Alert  } from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
import  MacAddressInput  from '../components/MACInput';

import { globalStyles } from '../theme/theme';
import { BotService } from '../services/apiService';

export default function RegisterScreen({ navigation }) {

    const [mac, setMac] = useState('');
    const [name, setName] = useState('FocusBot');
    const [loading, setLoading] = useState(false);

    const volver = async () => {
        navigation.replace('Home')
    };

    const emparejar = async () => {
        if (!mac){
            Alert.alert("Atención","Por favor, introduce la dirección MAC del bot.");
            return;
        }

        if (mac.length != 17) {
            Alert.alert("Atención", "MAC introducido incorrecto.")
            return;
        }

        setLoading(true);
        try{
            
            const data =await  BotService.linkBot(mac,name);

            if (data) {
                // console.log("data: " + data);
                // console.log("bot: "  + data.bot);
                // console.log("msg: "  + data.message);
                // console.log("error: "+ data.error);
                Alert.alert("FocusBot",data.message)
                navigation.replace('Home');
            }else{
                throw new Error("El servidor no respondió correctamente");
            }


        }catch(error){
            Alert.alert("Error de emparejamiento",error.message)
        }finally{
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.fullScreen}>
            <Card style={globalStyles.card}>
                <Card.Content>
                    <View style={globalStyles.header}>
                        <Avatar.Icon size={64} icon="robot" style={globalStyles.icon} />
                        <Text style={globalStyles.title}>Enparejamiento</Text>
                        <Text style={globalStyles.subtitle}>
                            Pair
                        </Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        <MacAddressInput value={mac} onChange={setMac} />
    
                        <TextInput
                            label="Nombre"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            style={globalStyles.input}
                            outlineStyle = {globalStyles.border_radius}
                        />
                    </ScrollView>

                    <View style={globalStyles.botonera}>
                        <Button
                            mode="contained" 
                            onPress={emparejar}
                            loading={loading}
                            disabled={loading}
                            style={globalStyles.button}
                        >
                            Emparejar
                        </Button>
                        <Button
                            mode="outlined" 
                            onPress={volver}
                            loading={loading}
                            disabled={loading}
                            style={globalStyles.button}
                        >
                            Volver
                        </Button>
                    </View>
                    
                </Card.Content>
            </Card>
        </View>
    );
}
