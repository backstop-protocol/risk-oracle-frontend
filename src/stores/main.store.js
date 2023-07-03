import { coingeckoMap, isDexAvailableForBase, normalize } from "../utils/utils";
import { makeAutoObservable, runInAction } from "mobx";
import { pythiaAddress, relayerAddress, rpcURL } from "../config";

import PythiaABI from "../abi/pythia.abi.json";
import { assets } from "./config.store";
import axios from "axios";
import { ethers } from "ethers";
import symbols from "../config";

const defaultAsset = "ETH"
const apiUrl = "https://api.dex-history.la-tribu.xyz/api";
class MainStore {
  constructor() {
    this.assets = Object.entries(assets)
      .filter(([, asset]) => asset.display)
      .map(([k, v]) => {
        v.name = k
        return v
      })
    this.searchedAsset = null;
    this.selectedAsset = assets[defaultAsset]
    this.selectedBaseSymbol = symbols[defaultAsset];
    this.selectedDexes = [];
    this.selectedQuotes = [];
    this.selectedSlippage = 5;
    this.selectedSpan = 1;
    this.web3Data = null;
    this.searchFieldValue = ''
    this.allDexes = true;
    this.searchCounter = 0
    this.graphData = null;
    this.loading = true;
    this.timestamps = {};
    this.spans = [1, 7, 30, 180, 365];
    this.platforms = ['uniswapv2', 'curve', 'uniswapv3'];
    this.quotes = ['USDC', 'WBTC', 'WETH']
    this.graphData = {};
    this.averageData = {};
    this.lastUpdate = {};
    this.averages = {};
    this.debtAssetPrices = {};
    this.basePrice = 0;
    this.loading = true;
    const urls = [];
    const averageUrls = [];
    for (let i = 0; i < this.platforms.length; i++) {
      for (let j = 0; j < this.spans.length; j++) {
        urls.push(`${apiUrl}/getprecomputeddata?platform=${this.platforms[i]}&span=${this.spans[j]}`);
      }
    }
    for (let i = 0; i < this.platforms.length; i++) {
      for (let j = 0; j < this.spans.length; j++) {
        averageUrls.push(`${apiUrl}/getaveragedata?platform=${this.platforms[i]}&span=${this.spans[j]}`);
      }
    }
    this.sendParallelRequests(urls)
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          const url = new URL(data[i].request.responseURL);
          const span = url.searchParams.get('span');
          const platform = url.searchParams.get('platform');
          if (!this.graphData[platform]) {
            this.graphData[platform] = {}
          };
          this.graphData[platform][span] = data[i].data.concatData;
          this.lastUpdate[span] = data[i].data.lastUpdate;
          this.timestamps[span] = data[i].data.blockTimestamps;
        }
        this.initialDexes();
        this.initialQuotes();
      })
      .catch(error => {
        console.error('error', error);
      });
    this.sendParallelRequests(averageUrls)
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          const url = new URL(data[i].request.responseURL);
          const span = url.searchParams.get('span');
          const platform = url.searchParams.get('platform');
          if (!this.averageData[platform]) {
            this.averageData[platform] = {}
          };
          this.averageData[platform][span] = data[i].data;
        }
        this.loading = false;
      })
      .catch(error => {
        console.error('error', error);
      });
    this.getWeb3Data();
    makeAutoObservable(this);
  }
  async sendParallelRequests(urls) {
    const requests = urls.map(url => axios.get(url)); // Create an array of requests
    const data = await axios.all(requests); // Wait for all requests to complete
    return data;
  }
  async getWeb3Data() {
    const provider = new ethers.JsonRpcProvider(rpcURL);
    const pythiaContract = new ethers.Contract(pythiaAddress, PythiaABI, provider);
    const relayers = [];
    const assetsAddresses = [];
    const keys = [];
    const key = ethers.keccak256(ethers.toUtf8Bytes(`avg 30 days uni v3 liquidity`));
    const symbols = [];
    const toReturn = {};

    for (const [tokenSymbol, value] of Object.entries(assets)) {
      if (value.pythia) {
        symbols.push(tokenSymbol);
        relayers.push(relayerAddress);
        keys.push(key);
        assetsAddresses.push(value.address)
      }
    }

    const results = await pythiaContract.multiGet(relayers, assetsAddresses, keys);

    for (let i = 0; i < symbols.length; i++) {
      const assetConf = assets[symbols[i]];
      toReturn[symbols[i]] = normalize(results[i], BigInt(assetConf.decimals));
    }
    this.web3Data = toReturn;
  }

  get searchList() {
    const searchTerm = this.searchFieldValue.toUpperCase()
    return this.assets.filter(a => a.name.indexOf(searchTerm) > -1)
  }


  getSearchQs = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    return searchParam
  }

  scrollToAssets = () => {
    const element = window.document.getElementById('assets');
    if (!element) {
      return
    }
    // check scroll is needed
    const rect = element.getBoundingClientRect();
    if (rect.top < 0 || rect.top > 1) {
      element.scrollIntoView();
    }
  }

  updateAverages = (averageArray) => {
    for(let i = 0; i < averageArray.length; i++){
      const tokenName = Object.keys(averageArray[i])[0];
      this.averages[tokenName] = averageArray[i][tokenName];
    }

  }

  async updateDebtAssetPrices(asset){
      const id = coingeckoMap[asset.toLowerCase()];
      const url = `https://api.coingecko.com/api/v3/coins/${id}`
      const data = await axios.get(url);
      const price = (data.data['market_data']['current_price']['usd']).toFixed(2); 
      this.debtAssetPrices[asset] = price;
  }

  search = (assetName) => {
    const searchQueryStringParam = this.getSearchQs()
    if (searchQueryStringParam !== assetName) {
      // update the url with the new query string param
      const url = new URL(window.location);
      url.searchParams.set('search', assetName);
      window.history.pushState(null, '', url.toString());
    }
    this.scrollToAssets()
    assetName = assetName.toUpperCase()
    this.searchedAsset = assetName
    this.selectedAsset = assets[assetName]
    this.selectedBaseSymbol = symbols[assetName];
    this.initialDexes();
    this.initialQuotes();
    this.allDexes = true;
    this.searchFieldValue = ""
    runInAction(() => {
      this.searchCounter++
    })
  }
  initialDexes = () => {
    const available = [];
    for (const platform of this.platforms) {
      if (this.graphData[platform]) {
        const availableBases = this.graphData[platform]['1'].map(_ => _.base);
        if (availableBases.includes(this.selectedBaseSymbol)) {
          available.push(platform);
        };
      }
    }
    this.selectedDexes = available;
  }

  handleDexChanges = (dex) => {
    if (this.selectedDexes.includes(dex)) {
      if (this.selectedDexes.length === 1) {
        return
      }
      this.selectedDexes = this.selectedDexes.filter(_ => _ !== dex);
      this.allDexes = false;
    }
    else {
      this.selectedDexes = [...this.selectedDexes, dex];
    }

    /// remove quotes not available
    const currentQuotes = this.selectedQuotes;
    const quotesHolder = [];
    const newQuotes = [];
    for (const dex of this.selectedDexes) {
      const dataForDex = this.graphData[dex][1];
      const dataForDexForBase = dataForDex.filter(_ => _.base.toLowerCase() === this.selectedBaseSymbol.toLowerCase());
      for (const slippageData of dataForDexForBase) {
        if (!quotesHolder.includes(slippageData.quote)) {
          quotesHolder.push(slippageData.quote);
        }
      }
    }
    for (const quote of currentQuotes) {
      if (quotesHolder.includes(quote)) {
        newQuotes.push(quote)
      }
    }
    this.selectedQuotes = newQuotes;
  }

  toggleAllDexes = (selectedBaseSymbol) => {
    if (!this.allDexes) {
      const toPush = [];
      for (const dex of this.platforms) {
        if (isDexAvailableForBase(dex, selectedBaseSymbol)) {
          toPush.push(dex);
        }
      }
      this.selectedDexes = toPush;
      this.allDexes = true;
    }
    else {
      this.selectedDexes = [];
      this.allDexes = false;
    }
  }

  initialQuotes = () => {
    this.selectedQuotes = [];
    const quotesHolder = [];
    for (const dex of this.selectedDexes) {
      const dataForDex = this.graphData[dex][1];
      const dataForDexForBase = dataForDex.filter(_ => _.base.toLowerCase() === this.selectedBaseSymbol.toLowerCase());
      for (const slippageData of dataForDexForBase) {
        if (!quotesHolder.includes(slippageData.quote)) {
          quotesHolder.push(slippageData.quote);
        }
      }
    }
    quotesHolder.sort();
    this.selectedQuotes = [...this.selectedQuotes, ...quotesHolder];
  }

  handleQuotesChanges = (quote) => {
    if (this.selectedQuotes.includes(quote)) {
      if (this.selectedQuotes.length === 1) {
        return
      }
      this.selectedQuotes = this.selectedQuotes.filter(_ => _ !== quote);
    }
    else {
      this.selectedQuotes = [...this.selectedQuotes, quote];
    }
  }

  setSearchFieldValue = (value) => {
    this.searchFieldValue = value
  }

  handleSlippageChange = (value) => {
    this.selectedSlippage = value;
  }
  handleSpanChange = (value) => {
    this.selectedSpan = value;
  }
}

export default new MainStore()