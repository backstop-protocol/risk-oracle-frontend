import '@picocss/pico';
import './App.css';

import { useEffect } from 'react';

import First from './sections/First';
import Header from './sections/Header';
import MainPanel from './sections/MainPanel';
import SideNav from './sections/SideNav';
import mainStore from './stores/main.store';

function App() {
  useEffect(()=> {
    // runs once after app is fully loaded
    const searchQs = mainStore.getSearchQs()
    if(searchQs){
      mainStore.search(searchQs)
    }
  }, [])
  return (
    <div className="App">
        <Header/>
        <First/>
        <main id="assets" style={{paddingTop: '102px'}} >
          <SideNav/>
          <MainPanel/>
        </main>
    </div>
  );
}

export default App;
