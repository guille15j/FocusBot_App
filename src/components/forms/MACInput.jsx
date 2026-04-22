import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import MaskedTextInput from 'react-native-masked-text'; // Asumo que usas esta librería

export default function MacAddressInput({ value, onChange, globalStyles }) {
  return (
    <TextInput
      label="Dirección MAC"
      mode="outlined"
      outlineStyle={{ borderRadius: 30 }}
      style={globalStyles?.input}
      value={value}               
      onChangeText={onChange}
      render={props => (
        <MaskedTextInput
          {...props}
          type="custom"
          options={{ mask: 'AA:AA:AA:AA:AA:AA' }}
          value={value}
          onChangeText={onChange}
          autoCapitalize="characters"
        />
      )}
    />
  );
}