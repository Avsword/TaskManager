import React from 'react';
import { useEffect, createContext, useState } from 'react';

const ThemeContext = createContext();
const getTheme = () => {
  //Check the localstorage for a theme
  const theme = localStorage.getItem('theme');
  //If there isn't a theme, set it to light as default
  if (!theme) {
    localStorage.setItem('theme', 'dark');
    return 'dark';
  } else {
    //if it is found, then return the current theme
    return theme;
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getTheme);

  function toggleTheme() {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }

  //Every time that the theme is updated, then we want to refresh it
  useEffect(() => {
    const refreshTheme = () => {
      localStorage.setItem('theme', theme);
    };

    refreshTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
