
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type DevModeContextType = {
  isDevelopmentMode: boolean;
  toggleDevelopmentMode: () => void;
};

const DevModeContext = createContext<DevModeContextType>({
  isDevelopmentMode: false,
  toggleDevelopmentMode: () => {},
});

export const useDevMode = () => useContext(DevModeContext);

interface DevModeProviderProps {
  children: ReactNode;
}

export const DevModeProvider: React.FC<DevModeProviderProps> = ({ children }) => {
  const [isDevelopmentMode, setIsDevelopmentMode] = useState<boolean>(false);

  // Check localStorage on initial load
  useEffect(() => {
    const storedMode = localStorage.getItem("devMode");
    if (storedMode) {
      setIsDevelopmentMode(storedMode === "true");
    }
  }, []);

  const toggleDevelopmentMode = () => {
    const newMode = !isDevelopmentMode;
    setIsDevelopmentMode(newMode);
    localStorage.setItem("devMode", String(newMode));
  };

  return (
    <DevModeContext.Provider
      value={{
        isDevelopmentMode,
        toggleDevelopmentMode,
      }}
    >
      {children}
    </DevModeContext.Provider>
  );
};

export default DevModeContext;
