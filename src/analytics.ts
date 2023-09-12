import { isProduction } from "env";
import ReactGA from "react-ga4";

export const initGA = () => {
  const gaID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
  if (gaID) {
    ReactGA.initialize(gaID);
  } else if (isProduction) {
    console.warn("Google Analytics ID is not set");
  }
};

export const logStartGame = () => {
  if (ReactGA.isInitialized) {
    ReactGA.event("level_start", {
      level_name: "sf",
    });
  }
};

export const logEndGame = (success: boolean) => {
  if (ReactGA.isInitialized) {
    ReactGA.event("level_end", {
      level_name: "sf",
      success,
    });
  }
};

export const logPageView = () => {
  if (ReactGA.isInitialized) {
    ReactGA.send(window.location.pathname);
  }
};
