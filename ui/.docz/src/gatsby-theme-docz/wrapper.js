import React from 'react';
import { ThemeProvider } from 'styled-components';
import THEME from 'core/assets/themes';

export default ({ children }) => (
  <ThemeProvider theme={THEME.dark}>{children}</ThemeProvider>
)