import React, { useEffect } from 'react';
import { AuthService } from '../api/apiService';

export default function GoogleWebButton({ onSuccess }) {

  useEffect(() => {
    /* Cargar script de Google */
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com",
        callback: async (response) => {
          const credential = response.credential;
          const res = await AuthService.googleLoggin(credential);
          
          console.log("Respuesta backend Google:", res);
          
          console.log("USUARIO:", res.user);
          onSuccess(res.token, res.user); //NUESTRO SINGING

        }
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );
    };
  }, []);

  return (
    <>
      {/* Botón nativo oculto */}
      <div
  id="googleHiddenBtn"
  style={{
    opacity: 0,
    pointerEvents: "none",
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden"
  }}
></div>


      {/* Botón bonito con tus estilos */}
      <Button
        mode="outlined"
        icon="google"
        onPress={handleCustomGoogleLogin}
        disabled={false}
        style={[
          globalStyles.buttonOutline,
          { marginTop: 0, borderRadius: 30 }
        ]}
        contentStyle={{ paddingVertical: 6 }}
        labelStyle={{
          fontSize: 16,
          fontWeight: '600',
          color: colors.text
        }}
      >
        Continuar con Google
      </Button>
    </>
  );
}
