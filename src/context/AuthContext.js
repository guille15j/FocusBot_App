// Un Contexto en React permite compartir datos entre muchos
// componentes sin tener que pasar props manualmente por cada nivel
import React, { createContext } from 'react';

// Creamos el contexto con un valor inicial null
// Esto es lo que otros archivos importarán
export const AuthContext = createContext(null);