import { ThemeProvider } from 'styled-components';
import { theme } from './shared/Theme';
import { GlobalStyle } from './shared/GlobalStyle';
import Layout from './widgets/Layout/Layout';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout/>
    </ThemeProvider>
  )
}

export default App

