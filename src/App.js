import '@picocss/pico'
import './App.css'
import Header from './sections/Header'
import SideNav from './sections/SideNav'
import Footer from './sections/Footer'
import First from './sections/First'
import MainPanel from './sections/MainPanel'

function App() {
  return (
    <div className="App">
        <Header/>
        <First/>
        <main id="assets" style={{paddingTop: '102px'}} >
          <SideNav/>
          <MainPanel/>
        </main>
        <Footer/>
    </div>
  );
}

export default App;
