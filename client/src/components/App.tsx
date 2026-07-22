import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';
import { AuthProvider } from '../context/AuthContext';
import NavBar from './NavBar/NavBar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NavBar />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
