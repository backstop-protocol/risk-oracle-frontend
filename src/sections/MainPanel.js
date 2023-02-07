import { observer } from "mobx-react"
import mainStore from "../stores/main.store"
import InfoLine from "../components/InfoLine"
import DexSelector from "../components/DexSelector"
import SlippageSelector from "../components/SlippageSelector"
import ComparisonAssetsSelector from "../components/ComparisonAssetsSelector"
import LiquidityOrVolatility from "../components/LiquidityOrVolatility"
import VolatilityTable from "../components/VolatilityTable"
import LiquidityChart from "../components/LiquidityChart"

const MainPanel = observer(props => {
  const {searchedAsset, selectedAsset, assets} = mainStore
  if (!selectedAsset && !searchedAsset) {
    return <div className="main-content">search or select an asset</div>
  }
  if (!selectedAsset && searchedAsset) {
    return <div className="main-content">the searched asset {searchedAsset} is not yet supported</div>
  }
  return (
    <div className="main-content">
      <InfoLine asset={selectedAsset}/>
      <DexSelector/>
      <div style={{display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing) * 4)'}}>
        <ComparisonAssetsSelector/>
        <SlippageSelector/>
      </div>
      <div>
      </div>
      <LiquidityChart/>
      main panel {selectedAsset.name}
      {/* <LiquidityOrVolatility/> */}
      <VolatilityTable/>
    </div>
  )
})

export default MainPanel