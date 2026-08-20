import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";

function LoginPage() {
  const { user, initializeGoogleButton } = useAuth();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    initializeGoogleButton(googleButtonRef.current);
  }, [initializeGoogleButton]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl flex flex-col items-center justify-center m-auto mt-20">
      <h1 className="text-center text-3xl mb-5 text-white">
        Login with your Google account
      </h1>

      <div ref={googleButtonRef}></div>
    </div>
  );
}

export default LoginPage;
