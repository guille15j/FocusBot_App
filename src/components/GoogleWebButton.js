import React, { useEffect } from 'react';
import { Button } from 'react-native-paper';
import { AuthService } from '../api/apiService';

export default function GoogleWebButton({ onSuccess, colors, globalStyles, clientId }) {  // ✅ recibimos clientId

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,   
        callback: async (response) => {
          const credential = response.credential;
          const res = await AuthService.googleLoggin(credential);

          console.log("Respuesta backend Google:", res);
          onSuccess(res.token, res.user);
        }
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleHiddenBtn"),
        { theme: "outline", size: "large" }
      );
    };
  }, [clientId]); 

  const handleCustomGoogleLogin = () => {
    const hiddenBtn = document
      .getElementById("googleHiddenBtn")
      ?.querySelector("div");

    if (hiddenBtn) hiddenBtn.click();
  };

  return (
    <>
      <Button
        mode="outlined"
        icon="google"
        onPress={handleCustomGoogleLogin}
        style={[
          globalStyles.buttonOutline,
          { marginTop: 0, borderRadius: 30, height: 40 }
        ]}
        labelStyle={{
          fontSize: 16,
          fontWeight: '600',
          color: colors.primary
        }}
      >
        Continuar con Google
      </Button>
      <div
        id="googleHiddenBtn"
        style={{
          opacity: 0,
          position: "relative",
          top: -40,
        }}
      ></div>
    </>
  );
}