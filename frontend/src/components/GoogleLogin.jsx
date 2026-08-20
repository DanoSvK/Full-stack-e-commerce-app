import { useEffect, useRef } from "react";

function GoogleLogin() {
  const buttonRef = useRef(null);

  function handleGoogleResponse(response) {
    console.log(response);
  }

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
    });
  }, []);

  return <div ref={buttonRef}></div>;
}

export default GoogleLogin;
