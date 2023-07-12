import '@picocss/pico';
import './App.css';

import { Box, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';

import First from './sections/First';
import GraphPanel from './sections/GraphPanel';
import Header from './sections/Header';
import SideNav from './sections/SideNav';
import SmartLTVPanel from './sections/SmartLTVPanel';
import mainStore from './stores/main.store';
import { darkTheme, lightTheme } from './config';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // runs once after app is fully loaded
    const searchQs = mainStore.getSearchQs()
    if (searchQs) {
      mainStore.search(searchQs)
    }
  }, [])
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');


  const theme = darkMode ? createTheme(darkTheme) : createTheme(lightTheme);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Box id="heroZone" sx={{scrollSnapAlign:"center"}}>
          <Header />
          <First />
        </Box>
        <Box id="mainSection" sx={{display: 'flex', flexDirection: 'row', height: '200vh'}}>
          <SideNav />
          <Box sx={{display: 'flex', flexDirection: 'column', height: '200vh', width:"93vw"}}>
            <SmartLTVPanel />
            <GraphPanel />
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
export default App;
