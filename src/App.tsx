import { ThemeProvider } from 'styled-components';
import { theme } from './shared/Theme';
import { GlobalStyle } from './shared/GlobalStyle';

import { Outlet } from "react-router-dom";


function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle>
          <Outlet />
        </GlobalStyle>
      </ThemeProvider>
      
    </>
  )
}

export default App
