import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { GameManager } from "components/GameManager";
import Login from "components/Login";
import { EastworldClient } from "eastworld-client";

const RedirectToLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null;
};

const RedirectToGame = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/game');
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
    // This function checks with the backend if the user is authenticated
    if (!isAuthenticated) {
      async function checkAuthentication() {
        try {
          const response = await eastworldClient.authorization.check();
          if (response.isAuthenticated) {
            setIsAuthenticated(true);
            navigate('/game');
          } else {
            setIsAuthenticated(false);
            navigate('/login');
          }
        } catch (error) {
          console.error("Failed to check authentication", error);
        }
      }

      checkAuthentication();
    }
  }, [navigate, eastworldClient.authorization]);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <RedirectToGame/>}></Route>
      <Route path="/game" element={isAuthenticated ? <GameManager /> : <RedirectToLogin />} />
      <Route path="*" element={isAuthenticated ? <RedirectToGame/>: <RedirectToLogin />} /> {/* Catch-all route */}
    </Routes>
  );
};

export default AppRoutes;