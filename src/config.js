
const symbols = {
    SUSD: 'sUSD',
    ETH: 'WETH',
    DAI: 'DAI',
    SNX: 'SNX',
    MKR: 'MKR',
    UNI: 'UNI',
    WBTC: 'WBTC',
    USDT: 'USDT',
    USDC: 'USDC',
    MANA: 'MANA'
}

export const pythiaAddress = "0x7DbC68f052924d7177b9D515bc278BE108a2923c"

export const keyEncoderAddress = '0x36BDa8b93769523581f85D65d0bD81DaEd32C2b0';

export const relayerAddress = "0xbad06297eb7878502e045319a7c4a8904b49beef";

// export const rpcURL = "https://rpc.sepolia.org/"
export const rpcURL = "https://sepolia.gateway.tenderly.co"



export const lightTheme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#25c068',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontWeight: 800,
      lineHeight: 1.33,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: '1.5rem',
    },
    h3: {
      fontSize: '1.4rem',
    },
    subtitle1: {
      fontWeight: 600,
      lineHeight: 1.6,
      fontSize: '1.5rem',
    },
    fontSize: 12,
  },
};

export const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#25c068',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontWeight: 800,
      lineHeight: 1.33,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: '1.5rem',
    },
    h3: {
      fontSize: '1.4rem',
    },
    subtitle1: {
      fontWeight: 600,
      lineHeight: 1.6,
      fontSize: '1.5rem',
    },
    fontSize: 12,
  },
};

export default symbols;