import '@picocss/pico';
import './App.css';

import { Box, ThemeProvider, createTheme } from '@mui/material';

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

  const themeSwitcher = {
  
    // Config
    _scheme: 'auto',
    change: {
      light: '<i>Turn on dark mode</i>',
      dark: '<i>Turn off dark mode</i>',
    },
    buttonsTarget: '.theme-switcher',
    localStorageKey: 'picoPreferedColorScheme',
  
    // Init
    init() {
      this.scheme = this.schemeFromLocalStorage;
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        this.scheme = !!e.matches ? this._scheme = 'dark' : this._scheme = 'light';
      });
      this.initSwitchers();
    },
  
    // Get color scheme from local storage
    get schemeFromLocalStorage() {
      if (typeof window.localStorage !== 'undefined') {
        if (window.localStorage.getItem(this.localStorageKey) !== null) {
          return window.localStorage.getItem(this.localStorageKey);
        }
      }
      return this._scheme;
    },
  
    // Prefered color scheme
    get preferedColorScheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
  
    // Init switchers
    initSwitchers() {
      const buttons = document.querySelectorAll(this.buttonsTarget);
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          this.scheme == 'dark' ? this.scheme = 'light' : this.scheme = 'dark';
          if (window.rerender) {
            window.rerender();
          }
        }, false);
      });
    },
  
    // Add new button
    addButton(config) {
      let button = document.createElement(config.tag);
      button.className = config.class;
      document.querySelector(config.target).appendChild(button);
    },
  
    // Set scheme
    set scheme(scheme) {
      if (scheme == 'auto') {
        this.preferedColorScheme == 'dark' ? this._scheme = 'dark' : this._scheme = 'light';
      }
      else if (scheme == 'dark' || scheme == 'light') {
        this._scheme = scheme;
      }
      this.applyScheme();
      mainStore.darkTheme = scheme === "light" ? false : true;
      this.schemeToLocalStorage();
    },
  
    // Get scheme
    get scheme() {
      return this._scheme;
    },
  
    // Apply scheme
    applyScheme() {
      window.darkMode = this.scheme === 'dark'
      document.querySelector('html').setAttribute('data-theme', this.scheme);
      const buttons = document.querySelectorAll(this.buttonsTarget);
      buttons.forEach(
        button => {
          const text = this.scheme == 'dark' ? this.change.dark : this.change.light;
          button.innerHTML = text;
          button.setAttribute('aria-label', text.replace(/<[^>]*>?/gm, ''));
        }
      );
    },
  
    // Store scheme to local storage
    schemeToLocalStorage() {
      if (typeof window.localStorage !== 'undefined') {
        window.localStorage.setItem(this.localStorageKey, this.scheme);
      }
    },
  };
  
  // Theme switcher
  themeSwitcher.addButton({
    tag: 'BUTTON',
    class: 'contrast switcher theme-switcher',
    target: 'body',
  });
  themeSwitcher.init();


  const theme = mainStore.darkTheme ? createTheme(darkTheme) : createTheme(lightTheme);
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
