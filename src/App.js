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
        <div style={{height:"8vh"}}/>
        <Box id="mainSection" sx={{display: 'flex', flexDirection: 'row', height: '200vh', width: '100vw'}}>
          <SideNav />
          <Box sx={{display: 'flex', flexDirection: 'column', height: '200vh', width: "93vw", paddingTop:"8vh"}}>
            <SmartLTVPanel />
            {/* <GraphPanel /> */}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
export default App;
