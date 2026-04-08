import { Modal, View, Text, Button, StyleSheet } from 'react-native';

export const InfoModal = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text>Este es un Modal</Text>
        <Button title="Cerrar" onPress={onClose} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', padding: 35, borderRadius: 20 }
});