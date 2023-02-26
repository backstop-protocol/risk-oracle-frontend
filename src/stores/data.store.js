import { makeAutoObservable, runInAction } from "mobx"
import assets from "./assets"
import comparisonAssets from './comparisonAssets'
import dexs from './dexs'
import Papa from 'papaparse'
import Web3 from "web3"
import axios from "../utils/axios"
import sleep from "../utils/sleep"
import timeWindows from "./timeWindows"
const {fromWei, toWei} = Web3.utils
/* global BigInt */

const _1E18 = Math.pow(10, 18)


const csvParseConfig = {
  header: true, 
  skipEmptyLines: true,
  transformHeader:function(h, i) {
    if (i > 0) {
      return h.split('_')[1];
    }
    return h
  }
}

const baseUrl = "http://risk-oracle-server-dev.eba-mwdphipi.eu-central-1.elasticbeanstalk.com"

class DataStore {
  price = null
  _24PriceChange = null
  _24LiquidityChange = null
  selectedTimeWindow = timeWindows[0]

  constructor (asset) {
    this.dexs = Object.entries(dexs).map(([k,v])=>{
      v.checked = true
      v.name = k
      return v
    })
    this.comparisonAssets = Object.entries(comparisonAssets).map(([k,v])=>{
      v.checked = true
      v.name = k
      return v
    })
    this.asset = asset
    this.dexs = dexs
    this.comparisonAssets = comparisonAssets
    this.loading = true
    if (this.comparisonAssets[asset]) {
      delete this.comparisonAssets[asset]
    }
    this.fetchData()
    makeAutoObservable(this)
  }

  getCurrentBlock = async () => {
    const {data} = await axios.get('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber')
    const currentBlock = parseInt(data.result, 16)
    console.log({currentBlock})
    return currentBlock
  }

  setTimeWindow = (tw) => {
    this.selectedTimeWindow = tw
  }

  toggleComparisonAsset = (ca) =>  {
    ca.checked = !ca.checked
  }

  get allComparisonAssetsChecked () {
    const unChecked = Object.values(this.comparisonAssets).filter(({checked})=> checked === false)
    return !unChecked.length
  }

  toggleAllComparisonAssets = () => {
    const toggleTo = !this.allComparisonAssetsChecked
    Object.values(this.comparisonAssets).forEach(ca => {
      ca.checked = toggleTo
    })
  }

  toggleDex = (dex) =>  {
    dex.checked = !dex.checked
  }

  get allDexs () {
    const unChecked = Object.values(this.dexs).filter(({checked})=> checked === false)
    return !unChecked.length
  }

  toggleAllDexs = () => {
    const toggleTo = !this.allDexs
    Object.values(this.dexs).forEach(dex => {
      dex.checked = toggleTo
    })
  }

  getBlockFromXDaysAgo = async (days) => {
    const secondsPerBlock = 12.5
    const dayInSeconds = 60 * 60 * 24
    const blocksPerDay = (dayInSeconds / secondsPerBlock)
    const currentBlock = await this.getCurrentBlock()
    return currentBlock - parseInt(blocksPerDay * days)
  }

  get24hPriceChange = async () => {
    const fromBlock = await this.getBlockFromXDaysAgo(1)
    const {data} = await axios.get(`${baseUrl}/events/${this.asset}-USDC_uniswapv2.csv?fromBlock=${fromBlock}`)
    const json = Papa.parse(data, csvParseConfig)
    const prices = json.data.map((event) => {
      
      const usdc = event['USDC']
      const asset = event[this.asset]
      const assetDecimalAdjusted = BigInt(asset) * BigInt(Math.pow(10, 6))
      const usdcDecimalAdjusted = BigInt(usdc) * BigInt(Math.pow(10, assets[this.asset].decimals))

      return (usdcDecimalAdjusted  * BigInt(_1E18)) / assetDecimalAdjusted
    })
    this.price = parseFloat(fromWei(prices[prices.length - 1].toString())).toFixed(2)
    prices.sort((a, b)=> {
      if(a > b) return -1
      if(a < b) return 1
      return 0
    })
    const max = fromWei(prices[0].toString())
    const min = fromWei(prices[prices.length - 1].toString())
    const priceMove = (parseFloat(max) - parseFloat(min))
    runInAction(()=> {
      this._24PriceChange = ((priceMove / parseFloat(max)) * 100).toFixed(2)

    })
  }

  fetchData = async() => {
    runInAction(()=> {
      this.loading = true
    })
    const promises = [
      sleep(1),
      this.get24hPriceChange()
    ]
    await Promise.all(promises)
    runInAction(()=> {
      this.loading = false
    })
  }
}

export const dataStores = {}

const getDataStore = asset => {
  if(dataStores[asset]){
    return dataStores[asset]
  }
  const isSupportedAsset = assets[asset]
  if(isSupportedAsset){
    dataStores[asset] = new DataStore(asset)
    return dataStores[asset]
  }
  return null
}

export default getDataStore