import '@picocss/pico';
import './App.css';

import { Box, ThemeProvider, createTheme } from '@mui/material';

import First from './sections/First';
import Footer from './sections/Footer';
import Header from './sections/Header';
import GraphPanel from './sections/GraphPanel';
import SideNav from './sections/SideNav';
import SmartLTVPanel from './sections/SmartLTVPanel';
import mainStore from './stores/main.store';
import { themeOptions } from './config';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // runs once after app is fully loaded
    const searchQs = mainStore.getSearchQs()
    if (searchQs) {
      mainStore.search(searchQs)
    }
  }, [])


  const theme = createTheme(themeOptions);
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Box>
        <Header />
        <First />
      </Box>
      <Box id="smartLTV" sx={{ paddingTop: '8vh', display: 'flex', flexDirection: 'row', height: '100vh', width: '100%' }}>
        <SideNav />
        <SmartLTVPanel />
      </Box>
      <GraphPanel />
      <Footer />
    </div>
    </ThemeProvider>
  );
}
export default App;
