import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function MacAddressInput({ value, onChange }) {
  const formatMac = (text) => {
    const cleaned = text.replace(/[^0-9A-Fa-f]/g, '').slice(0, 12);
    const parts = cleaned.match(/.{1,2}/g) || [];
    return parts.join(':').toUpperCase();
  };

  const handleChange = (text) => {
    const formatted = formatMac(text);
    onChange(formatted);
  };

  return (
    <TextInput
      label="Dirección MAC"
      mode="outlined"
      outlineStyle={{ borderRadius: 30 }}
      value={value}
      onChangeText={handleChange}
      autoCapitalize="characters"
      maxLength={17}
      placeholder="AA:BB:CC:DD:EE:FF"
    />
  );
}