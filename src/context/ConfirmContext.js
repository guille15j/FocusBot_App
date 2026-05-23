import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [confirm, setConfirm] = useState({
    visible: false,
    title: '',
    message: '',
    icon: 'alert-circle-outline',
    iconColor: '#FF9800',
    actions: [],
  });

  const showConfirm = useCallback(({ title, message, icon, iconColor, actions }) => {
    setConfirm({
      visible: true,
      title: title || '',
      message,
      icon: icon || 'alert-circle-outline',
      iconColor: iconColor || '#FF9800',
      actions: actions || [],
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirm(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <ConfirmContext.Provider value={showConfirm}>
      {children}
      <ConfirmDialog
        visible={confirm.visible}
        title={confirm.title}
        message={confirm.message}
        icon={confirm.icon}
        iconColor={confirm.iconColor}
        actions={confirm.actions}
        onDismiss={hideConfirm}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);