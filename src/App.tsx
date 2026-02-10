import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './shared/Theme';
import { GlobalStyle } from './shared/GlobalStyle';
import Layout from './shared/ui/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { setNavigateFunction } from './shared/lib/navigate';


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout/>
    </ThemeProvider>
  )
}

export default App

