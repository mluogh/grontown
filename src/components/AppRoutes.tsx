import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GameManager } from "components/GameManager";
import Login from "components/Login";
import { EastworldClient } from "eastworld-client";

const RedirectToLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

const RedirectToGame = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/game");
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
          navigate("/game");
        } catch (error) {
          if (error instanceof Error && error?.message === "Unauthorized") {
            setAuthStatus(AuthStatus.NotAuthenticated);
            navigate("/");
          }
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
              return <RedirectToGame />;
            case AuthStatus.Pending:
              return <></>;
            default:
              return null;
          }
        })()}
      ></Route>
      <Route
        path="/game"
        element={
          authStatus === AuthStatus.Authenticated ? (
            <GameManager />
          ) : (
            <RedirectToLogin />
          )
        }
      />
      <Route
        path="*"
        element={
          authStatus === AuthStatus.Authenticated ? (
            <RedirectToGame />
          ) : (
            <RedirectToLogin />
          )
        }
      />{" "}
      {/* Catch-all route */}
    </Routes>
  );
};

export default AppRoutes;
