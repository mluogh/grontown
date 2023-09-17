import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GameManager } from "components/GameManager";
import Login from "components/Login";
import { ApiError, EastworldClient } from "eastworld-client";

const RedirectToHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

enum AuthStatus {
  NotAuthenticated = "NotAuthenticated",
  Authenticated = "Authenticated",
  Pending = "Pending",
}

const AppRoutes = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Pending);
  const navigate = useNavigate();
  const eastworldClient = new EastworldClient({
    BASE: "/api",
  });

  useEffect(() => {
    if (authStatus !== AuthStatus.Authenticated) {
      async function checkAuthentication() {
        try {
          await eastworldClient.authorization.check();
          setAuthStatus(AuthStatus.Authenticated);
          navigate("/");
        } catch (error) {
          if (!(error instanceof ApiError && error?.status === 401)) {
            console.error("Failed to check authentication", error);
          }
          setAuthStatus(AuthStatus.NotAuthenticated);
          navigate("/");
        }
      }

      checkAuthentication();
    }
    // TODO: we should have a watchdog to check if the user is still authenticated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={(() => {
          switch (authStatus) {
            case AuthStatus.NotAuthenticated:
              return <Login />;
            case AuthStatus.Authenticated:
              return <GameManager />;
            case AuthStatus.Pending:
              return <></>;
            default:
              return null;
          }
        })()}
      ></Route>
      <Route path="*" element={<RedirectToHome />} /> {/* Catch-all route */}
    </Routes>
  );
};

export default AppRoutes;
