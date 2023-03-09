import { observer } from "mobx-react"
import mainStore from "../stores/main.store"
import InfoLine from "../components/InfoLine"
import DexSelector from "../components/DexSelector"
import SlippageSelector from "../components/SlippageSelector"
import ComparisonAssetsSelector from "../components/ComparisonAssetsSelector"
import VolatilityTable from "../components/VolatilityTable"
import LiquidityChart from "../components/LiquidityChart"
import ContractAddress from "../components/ContractAddress"

const MainPanel = observer(props => {
  
  const {searchedAsset, selectedAsset, searchCounter, dataStore} = mainStore
  console.log({searchCounter})

  if (!selectedAsset && !searchedAsset) {
    return <div className="main-content">search or select an asset</div>
  }
  if (!selectedAsset && searchedAsset) {
    return <div className="main-content">the searched asset {searchedAsset} is not yet supported</div>
  }
  console.log({searchCounter})
  if(dataStore.loading){
    return (<div className="main-content">
      <div style={{paddingTop: '30vh'}} aria-busy="true"></div>
    </div>)
  }
  return (
    <div className="main-content">
      <InfoLine dataStore={dataStore}/>
      <ContractAddress address={"0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"}/>
      <DexSelector dataStore={dataStore}/>
      <div style={{display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 4)'}}>
        <ComparisonAssetsSelector dataStore={dataStore}/>
        <SlippageSelector dataStore={dataStore}/>
      </div>
      <div>
      </div>
      <LiquidityChart dataStore={dataStore}/>
      main panel {selectedAsset.name}
      {/* <LiquidityOrVolatility/> */}
      <VolatilityTable dataStore={dataStore}/>
    </div>
  )
})

export default MainPanel