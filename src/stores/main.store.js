import { makeAutoObservable, runInAction } from "mobx"
import assets from "./assets"

class MainStore {

  constructor () {
    this.assets = Object.entries(assets).map(([k,v])=>{
      v.name = k
      return v
    })
    makeAutoObservable(this)
  }

  search = (assetName) => {
    window.location.href = `#assets?name=${assetName}`;
    const element = window.document.getElementById('assets');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

export default new MainStore()