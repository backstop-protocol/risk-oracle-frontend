import { makeAutoObservable, runInAction } from "mobx"
import assets from "./assets"
import comparisonAssets from './comparisonAssets'
import dexs from './dexs'
import Papa from 'papaparse'
import Web3 from "web3"
import axios from "../utils/axios"
import sleep from "../utils/sleep"
import timeWindows from "./timeWindows"
const {fromWei, toWei, unitMap} = Web3.utils
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

const baseUrl = "https://risk-oracle-api.bprotocol.org"

class DataStore {
  price = null
  _24PriceChange = null
  _24LiquidityChange = null
  selectedTimeWindow = timeWindows["24H"]
  liquidityChartData = []
  loadingLiquidityChartData = false
  options = null

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
    this.loading = true
    if (this.comparisonAssets[asset]) {
      delete this.comparisonAssets[asset]
    }
    this.fetchData()
    makeAutoObservable(this)
  }

  getCurrentBlock = async () => {
    const {data} = await axios.get(`${baseUrl}/current-block`)
    return data.blockNumber
  }

  setTimeWindow = (tw) => {
    this.selectedTimeWindow = timeWindows[tw]
    this.getLiquidityChartData()
  }

  toggleComparisonAsset = (ca) =>  {
    ca.checked = !ca.checked
    this.getLiquidityChartData()
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
    if(this.allComparisonAssetsChecked){
      this.getLiquidityChartData()
    }
  }

  toggleDex = (dex) =>  {
    dex.checked = !dex.checked
  }

  get allDexs () {
    const unChecked = Object.values(this.options).filter(({checked})=> checked === false)
    return !unChecked.length
  }

  toggleAllDexs = () => {
    const toggleTo = !this.allDexs
    Object.values(this.options).forEach(dex => {
      dex.checked = toggleTo
    })
  }

  getBlockFromXDaysAgo = async (days) => {
    const secondsPerBlock = 12.5
    const dayInSeconds = 60 * 60 * 24
    const blocksPerDay = (dayInSeconds / secondsPerBlock)
    const currentBlock = await this.getCurrentBlock()
    const result =  currentBlock - parseInt(blocksPerDay * days)

    return result
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

  getLiquidityChartData = async () => {
    runInAction(()=> {
      this.loadingLiquidityChartData = true
    })
    const fromBlock = await this.getBlockFromXDaysAgo(this.selectedTimeWindow)
    const toBlock = await this.getCurrentBlock()
    const blockJump = parseInt((toBlock - fromBlock) / 100)
    const promises = []
    this.comparisonAssets
    .filter(ca=> {
      try{
        const caIaAvilableViaAPI = this.options['uniswapv2'].comparisonAssets[ca.name]
        debugger
        return ca.checked && caIaAvilableViaAPI
      } catch(e){
        return false
      }
    })
    .forEach(ca => {
      const promise = axios.get(`${baseUrl}/events/${this.asset}-${ca.name}_uniswapv2.csv?fromBlock=${fromBlock}`)
        .then(({data})=> Papa.parse(data, csvParseConfig))
      promises.push(promise)
    })

    const dataSets = await Promise.all(promises)
    const dataPoints = []
    for (let i = fromBlock; i <= toBlock; i += blockJump) {
      if(i > toBlock) {
        i = toBlock
      }
      const dataPoint = {}
      dataSets.forEach(dataSet=> {
        const {data, meta} = dataSet
        const {fields} = meta
        const ca = fields[2]
        dataPoint[ca] = 0
        data.forEach((d, j)=> {
          if(dataPoint[ca]) {
            return
          }
          if(d.blockNumber = i) {
            dataPoint[ca] = d[ca]
            return
          }
          if(d.blockNumber > i ) {
            dataPoint[ca] = data[Math.max(j - 1, 0)][ca]
          }
        })
      })
      dataPoint.name = i
      dataPoints.push(dataPoint)
    }

    runInAction(()=> {
      this.liquidityChartData = dataPoints
      this.loadingLiquidityChartData = false
    })
  }

  getAvailableOptions = async() => {
    if (this.options) {
      return
    }
    const {data} = await axios.get(`${baseUrl}/events/options/${this.asset}`)
    Object.entries(data.dexs).forEach(([k, v])=> {
      v.checked = true
      v.name = k
    })
    this.options = data.dexs
  }

  fetchData = async() => {
    runInAction(()=> {
      this.loading = true
    })
    await this.getAvailableOptions()
    const promises = [
      sleep(1),
      this.get24hPriceChange(),
      this.getLiquidityChartData()
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