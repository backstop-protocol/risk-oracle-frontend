import '@picocss/pico';
import './App.css';

import { Box } from '@mui/material';
import First from './sections/First';
import Header from './sections/Header';
import SideNav from './sections/SideNav';
import SmartLTV from './sections/SmartLTV';
import mainStore from './stores/main.store';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // runs once after app is fully loaded
    const searchQs = mainStore.getSearchQs()
    if (searchQs) {
      mainStore.search(searchQs)
    }
  }, [])
  return (
    <div className="App">
      <Box>
        <Header />
        <First />
      </Box>
      <Box sx={{ paddingTop: '8vh', display: 'flex', flexDirection: 'row', height: '100vh', width: '100%' }}>
        <SideNav />
        <Box>
          <SmartLTV />
        </Box>
      </Box>
    </div>
  );
}
export default App;
