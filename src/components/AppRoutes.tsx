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

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const eastworldClient = new EastworldClient({
    BASE: "/api",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      async function checkAuthentication() {
        try {
          const response = await eastworldClient.authorization.check();
          if (response.isAuthenticated) {
            setIsAuthenticated(true);
            navigate("/game");
          } else {
            setIsAuthenticated(false);
            navigate("/");
          }
        } catch (error) {
          console.error("Failed to check authentication", error);
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
        element={!isAuthenticated ? <Login /> : <RedirectToGame />}
      ></Route>
      <Route
        path="/game"
        element={isAuthenticated ? <GameManager /> : <RedirectToLogin />}
      />
      <Route
        path="*"
        element={isAuthenticated ? <RedirectToGame /> : <RedirectToLogin />}
      />{" "}
      {/* Catch-all route */}
    </Routes>
  );
};

export default AppRoutes;
