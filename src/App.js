import '@picocss/pico'
import './App.css'
import Header from './sections/Header'
import SideNav from './sections/SideNav'
import Footer from './sections/Footer'
import First from './sections/First'

function App() {
  return (
    <div className="App">
        <Header/>
        <First/>
        <main id="assets" style={{marginTop: '102px'}} className="container-fluid">
          <SideNav/>
          <div className='main-content'>
          </div>
        </main>
        <Footer/>
    </div>
  );
}

export default App;
