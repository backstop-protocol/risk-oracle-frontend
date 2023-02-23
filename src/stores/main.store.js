import { makeAutoObservable, runInAction } from "mobx"
import assets from "./assets"

import getDataStore, { dataStores } from "./data.store"

class MainStore {

  searchedAsset = null
  selectedAsset = null
  searchFieldValue = ""

  constructor () {
    this.assets = Object.entries(assets).map(([k,v])=>{
      v.name = k
      return v
    })
    makeAutoObservable(this)
  }

  get dataStore () {
    if(!this.selectedAsset || !this.selectedAsset.name){
      return null
    }
    const asset = this.selectedAsset.name
    if(dataStores[asset]){
      return dataStores[asset]
    }
    return getDataStore(asset)
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
    if(searchQueryStringParam != assetName) {
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
  }

  setSearchFieldValue = (value) => {
    this.searchFieldValue = value
  }
}

export default new MainStore()