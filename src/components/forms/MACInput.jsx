import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';

export default function MacAddressInput({ value, onChange }) {
  return (
    <TextInput
      label="Dirección MAC"
      mode="outlined"
      outlineStyle={globalStyles.border_radius}
      style={globalStyles.input}
      value={value}               
      onChangeText={onChange}
      render={props => (
        <MaskedTextInput
          {...props}
          mask="AA:AA:AA:AA:AA:AA"
          value={value}
          onChangeText={onChange}
          autoCapitalize="characters"
        //   style={globalStyles.input}
        />
      )}
    />
  );
}
