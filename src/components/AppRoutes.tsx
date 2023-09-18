import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GameManager } from "components/GameManager";
import Landing from "components/Landing";
import { ApiError, EastworldClient } from "eastworld-client";
import { AuthStatus } from "./util/auth";

const RedirectToHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

const AppRoutes = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Pending);
  const eastworldClient = new EastworldClient({
    BASE: "/api",
  });

  useEffect(() => {
    if (authStatus !== AuthStatus.Authenticated) {
      async function checkAuthentication() {
        try {
          await eastworldClient.authorization.check();
          setAuthStatus(AuthStatus.Authenticated);
        } catch (error) {
          if (!(error instanceof ApiError && error?.status === 401)) {
            console.error("Failed to check authentication", error);
          }
          setAuthStatus(AuthStatus.NotAuthenticated);
        }
      }
      checkAuthentication();
    }
    // TODO: we should have a watchdog to check if the user is still authenticated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing authStatus={authStatus} />}></Route>
      <Route
        path="/game"
        element={(() => {
          switch (authStatus) {
            case AuthStatus.NotAuthenticated:
              return <Landing authStatus={authStatus} />;
            case AuthStatus.Authenticated:
              return <GameManager />;
            case AuthStatus.Pending:
              return <></>;
            default:
              return null;
          }
        })()}
      />
      <Route path="*" element={<RedirectToHome />} />
    </Routes>
  );
};

export default AppRoutes;
