import { makeAutoObservable, runInAction } from "mobx"
import assets from "./assets"

class MainStore {

  searchedAsset = null
  selectedAsset = null
  searchFieldValue = null

  constructor () {
    this.assets = Object.entries(assets).map(([k,v])=>{
      v.name = k
      return v
    })
    makeAutoObservable(this)
  }

  search = (assetName) => {
    window.location.href = `#assets?name=${assetName}`
    this.searchedAsset = assetName
    this.selectedAsset = assets[assetName]
    const element = window.document.getElementById('assets');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setSearchFieldValue = (value) => {
    this.searchFieldValue = value
  }
}

export default new MainStore()