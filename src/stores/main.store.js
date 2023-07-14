import { coingeckoMap, encodeLiquidityKey, encodeVolatilityKey, normalize } from "../utils/utils";
import { makeAutoObservable, runInAction } from "mobx";
import symbols, { pythiaAddress, relayerAddress, rpcURL } from "../config";

import PythiaABI from "../abi/pythia.abi.json";
import { assets } from "./config.store";
import axios from "axios";
import { ethers } from "ethers";
import { isDexAvailableForBase } from "../utils/utils";
import { updateCode } from "../components/LTVCodeGenerator";

const defaultAsset = "ETH"
const apiUrl = "https://api.dex-history.la-tribu.xyz/api";
const urlParams = new URLSearchParams(window.location.search);
const USE_PARKINSON = urlParams.get('parkinson') && urlParams.get('parkinson') === 'true';

class MainStore {
  constructor() {
    this.assets = Object.entries(assets)
      .filter(([, asset]) => asset.display)
      .map(([k, v]) => {
        v.name = k
        return v
      })
    this.useParkinsonVolatility = USE_PARKINSON;
    this.searchedAsset = null;
    this.selectedAsset = assets[defaultAsset]
    this.selectedBaseSymbol = symbols[defaultAsset];
    this.selectedDexes = [];
    this.selectedQuotes = [];
    this.selectedSlippage = 5;
    this.selectedSpan = 30;
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
    this.ltvQuotes = []
    this.graphData = {};
    this.averageData = {};
    this.averageTableDisplayArray = [];
    this.lastUpdate = {};
    this.switchLoaded = false;
    this.averages = {};
    this.darkTheme = true;
    this.debtAssetPrices = {};
    this.basePrice = 0;
    this.loading = true;
    this.defaultCode = updateCode();
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
      })
      .catch(error => {
        console.error('error', error);
      });
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
        this.updateAverages();

      })
      .catch(error => {
        console.error('error', error);
      });
    this.loading = false;
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
    const volatilityKeys = [];
    const symbols = [];
    const toReturn = {};
    for (const [tokenSymbol, value] of Object.entries(assets)) {
      if (value.pythia) {
        symbols.push(tokenSymbol);
        relayers.push(relayerAddress);
        const key = encodeLiquidityKey(value.address, assets.USDC.address, 0, 5, 30);
        const volatilityKey = encodeVolatilityKey(value.address, assets.USDC.address, 0, 30);
        keys.push(key);
        volatilityKeys.push(volatilityKey);
        assetsAddresses.push(value.address)
      }
    }
    const results = await pythiaContract.multiGet(relayers, assetsAddresses, keys);
    const volatilityResults = await pythiaContract.multiGet(relayers, assetsAddresses, volatilityKeys);
    for (let i = 0; i < symbols.length; i++) {
      const assetConf = assets[symbols[i]];
      toReturn[symbols[i]] = {};
      toReturn[symbols[i]]['value'] = normalize(results[i][0], BigInt(assetConf.decimals));
      toReturn[symbols[i]]['volatilityValue'] = normalize(volatilityResults[i][0], 18n);
      toReturn[symbols[i]]['lastUpdate'] = Number(results[i][1]);
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

  switchLoadedTrue(){
    this.switchLoaded = true;
  }

  updateAverages = () => {
    const span = this.selectedSpan;
    const slippage = this.selectedSlippage;
    const dexes = this.selectedDexes;
    const averageData = this.averageData;
    const selectedBaseSymbol = symbols[this.selectedAsset.name];
    const quotes = this.selectedQuotes;
    const rowDataArray = [];
    const sortedData = {};
    const ratios = {};
    for (const dex of dexes) {
      ratios[dex] = {};
      const dataForDexForSpanForBase = averageData[dex][span][selectedBaseSymbol];
      for (const quote of quotes) {
        ratios[dex][quote] = 0;
        if (!sortedData[quote]) {
          sortedData[quote] = {}
        }
        if (!sortedData[quote]['average']) {
          sortedData[quote]['average'] = 0;
        }
        if (dataForDexForSpanForBase[quote]) {
          sortedData[quote]['average'] += (dataForDexForSpanForBase[quote]['avgLiquidityAggreg'][slippage]);
        }
        if (!sortedData[quote]['parkinsonVolatility']) {
          sortedData[quote]['parkinsonVolatility'] = 0
        }
        if (dataForDexForSpanForBase[quote]) {
          sortedData[quote]['parkinsonVolatility'] += this.useParkinsonVolatility ?  dataForDexForSpanForBase[quote].parkinsonVolatility :  dataForDexForSpanForBase[quote].volatility;
          ratios[dex][quote]++;
        }
      }
    }
    for (const quote of Object.keys(sortedData)) {
      let quoteRatio = 0;
      const ratioMap = Object.entries(ratios);
      for (let i = 0; i < ratioMap.length; i++) {
        if (ratioMap[i][1][quote] === 1) {
          quoteRatio++
        }
      }
      sortedData[quote].parkinsonVolatility = sortedData[quote].parkinsonVolatility / quoteRatio;
    }
    for (const [key, value] of Object.entries(sortedData)) {
      const toPush = {}
      toPush[key] = value;
      rowDataArray.push(toPush);
    }
    rowDataArray.sort((a, b) => Object.entries(b)[0][1].average - Object.entries(a)[0][1].average);
    this.averageTableDisplayArray = rowDataArray;

    for (let i = 0; i < rowDataArray.length; i++) {
      const tokenName = Object.keys(rowDataArray[i])[0];
      this.averages[tokenName] = rowDataArray[i][tokenName];
    }
  }

  async updateDebtAssetPrices(asset) {
    if(!this.debtAssetPrices[asset]){
    const id = coingeckoMap[asset.toLowerCase()];
    const url = `https://api.coingecko.com/api/v3/coins/${id}`
    const data = await axios.get(url);
    const price = (data.data['market_data']['current_price']['usd']).toFixed(2);
    this.debtAssetPrices[asset] = price;
  }
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
    this.defaultCode = updateCode(this.quotes[0], this.selectedAsset.name, 30, 7, 0.7, 5);
    this.updateAverages();
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
    this.updateAverages();
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
    this.ltvQuotes = quotesHolder;
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
    this.updateAverages();
  }

  setSearchFieldValue = (value) => {
    this.searchFieldValue = value
  }

  handleSlippageChange = (value) => {
    this.selectedSlippage = value;
    this.updateAverages();
  }
  handleSpanChange = (value) => {
    this.selectedSpan = value;
    this.updateAverages();
  }
}

export default new MainStore()