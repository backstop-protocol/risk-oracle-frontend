import { makeAutoObservable, runInAction } from "mobx";

import assets from "./assets";
import axios from "axios";

const defaultAsset ="ETH"
const apiUrl = "https://api.dex-history.la-tribu.xyz/api";
class MainStore {

  searchedAsset = null
  selectedAsset = assets[defaultAsset]
  searchFieldValue = ''
  searchCounter = 0
  graphData = null;
  averageData = null;
  loading = true;
  spans = [1, 7, 30, 180];
  platforms = ['uniswapv2', 'curve', 'uniswapv3'];
  
  constructor () {
    this.assets = Object.entries(assets)
      .filter(([,asset]) => asset.display)
      .map(([k,v])=>{
        v.name = k
        return v
      })
      this.graphData = {};
      this.averageData = {};
        this.lastUpdate = {};
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
                for(let i = 0; i < data.length; i++){
                    const url = new URL(data[i].request.responseURL);
                    const span = url.searchParams.get('span');
                    const platform = url.searchParams.get('platform');
                    if(!this.graphData[platform]){
                        this.graphData[platform] = {}
                    };
                    this.graphData[platform][span] = data[i].data.concatData;
                    this.lastUpdate[span] = data[i].data.lastUpdate;
                }
            })
            .catch(error => {
                console.error('error', error);
            });
            this.sendParallelRequests(averageUrls)
            .then(data => {
                for(let i = 0; i < data.length; i++){
                    const url = new URL(data[i].request.responseURL);
                    const span = url.searchParams.get('span');
                    const platform = url.searchParams.get('platform');
                    if(!this.averageData[platform]){
                        this.averageData[platform] = {}
                    };
                    this.averageData[platform][span] = data[i].data;
                }
                this.loading = false;
            })
            .catch(error => {
                console.error('error', error);
            });
    makeAutoObservable(this);
  }
  async sendParallelRequests(urls) {
    const requests = urls.map(url => axios.get(url)); // Create an array of requests
    const data = await axios.all(requests); // Wait for all requests to complete
    return data;
}

  get searchList () {
    const searchTerm = this.searchFieldValue.toUpperCase()
    return this.assets.filter(a=> a.name.indexOf(searchTerm) > -1)
  }

  getSearchQs = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    return searchParam
  }

  scrollToAssets = () => {
    const element = window.document.getElementById('assets');
    if(!element) {
      return
    }
    // check scroll is needed
    const rect = element.getBoundingClientRect();
    if (rect.top < 0 || rect.top > 1) {
      element.scrollIntoView();
    }
  }

  search = (assetName) => {
    const searchQueryStringParam = this.getSearchQs()
    if(searchQueryStringParam !== assetName) {
      // update the url with the new query string param
      const url = new URL(window.location);
      url.searchParams.set('search', assetName);
      window.history.pushState(null, '', url.toString());
    }
    this.scrollToAssets()
    assetName = assetName.toUpperCase()
    this.searchedAsset = assetName
    this.selectedAsset = assets[assetName]
    this.searchFieldValue = ""
    runInAction(()=> {
      this.searchCounter++
    })
  }

  setSearchFieldValue = (value) => {
    this.searchFieldValue = value
  }
}

export default new MainStore()