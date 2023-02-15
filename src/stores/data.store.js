import { makeAutoObservable, runInAction } from "mobx"
import assets from "./assets"
import comparisonAssets from './comparisonAssets'
import dexs from './dexs'
import Papa from 'papaparse'
import Web3 from "web3"
import axios from "../utils/axios"
const {fromWei, toWei} = Web3.utils



const baseUrl = "http://risk-oracle-server-dev.eba-mwdphipi.eu-central-1.elasticbeanstalk.com"

class DataStore {
  price = null
  _24PriceChange = null
  _24LiquidityChange = null

  constructor (asset) {
    
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

  getBlockFromXDaysAgo = async (days) => {
    const secondsPerBlock = 12.5
    const dayInSeconds = 60 * 60 * 24
    const blocksPerDay = (dayInSeconds / secondsPerBlock)
    const currentBlock = await this.getCurrentBlock()
    return currentBlock - parseInt(blocksPerDay * days)
  }

  get24hPriceChange = async () => {
    const fromBlock = await this.getBlockFromXDaysAgo(1)
    const {data} = await axios.get(`${baseUrl}/data/${this.asset}-USDC_uniswapv2.csv?fromBlock=${fromBlock}`)
    const json = Papa.parse(data, {header: false})
    json.data.shift()
    const prices = json.data.map(([block, asset, usdc])=> {
      return BigInt(asset) / (BigInt(usdc) * BigInt(Math.pow(10, 12)))
    }).sort((a, b)=> a - b)
    debugger
  }

  fetchData = async() => {
    debugger
    this.loading = true
    this._24PriceChange = await this.get24hPriceChange()
    debugger
    this.loading = false
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