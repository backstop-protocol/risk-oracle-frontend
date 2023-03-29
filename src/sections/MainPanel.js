import AvgTable from "../components/AvgTable"
import ContractAddress from "../components/ContractAddress"
import DexSelector from "../components/DexSelector"
import InfoLine from "../components/InfoLine"
import LastUpdate from "../components/LastUpdate"
import LiquidityChart from "../components/LiquidityChart"
import SlippageSelector from "../components/SlippageSelector"
import VolatilityTable from "../components/VolatilityTable"
// import ComparisonAssetsSelector from "../components/ComparisonAssetsSelector"
import assetsDataStore from "../stores/assets.data.store"
import mainStore from "../stores/main.store"
import { observer } from "mobx-react"
import { useState } from "react"

const MainPanel = observer(props => {
  const [slippage, setSlippage] = useState(5);
  const [dexes, setDexes] = useState([assetsDataStore.platforms[0]]);
  const [span, setSpan] = useState(assetsDataStore.spans[0]);

  function handleDexChanges(dex){
    if(dexes.includes(dex)){
      setDexes(dexes.filter(_=> _ !== dex));
    }
    else{
      setDexes([...dexes, dex]);
    }
  }

  function handleSlippageChange(value){
    setSlippage(value);
  }
  function handleSpanChange(value){
    setSpan(value);
    console.log(value);
  }

  
  const {searchedAsset, selectedAsset, searchCounter, dataStore} = mainStore

  if (!selectedAsset && !searchedAsset) {
    return <div className="main-content">search or select an asset</div>
  }
  if (!selectedAsset && searchedAsset) {
    return <div className="main-content">the searched asset {searchedAsset} is not yet supported</div>
  }
  if(assetsDataStore.loading){
    return (<div className="main-content">
      <div style={{paddingTop: '30vh'}} aria-busy="true"></div>
    </div>)
  }
  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing)', width: '100%'}}>
        <div style={{ flexGrow: 1}}>
          <article className="box" style={{display: 'flex', justifyContent: 'space-between', alignItems: "start"}}>
            <div >
              <InfoLine dataStore={dataStore}/>
              <ContractAddress address={"0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"}/>
            </div>
            <LastUpdate date={assetsDataStore.lastUpdate[span]}/>
          </article>
          <article className="box">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'calc(var(--spacing) * 4)', fontSize: "0.875em"}}>
              {/* <ComparisonAssetsSelector dataStore={dataStore}/> */}
              <DexSelector dexes={dexes} handleChange={handleDexChanges}/>
              <SlippageSelector slippage={slippage} handleChange={handleSlippageChange}/>
            </div>
          </article>
        </div>
      </div>
      <div style={{display: 'flex', gap: 'var(--spacing)'}}>
        <LiquidityChart slippage={slippage} dexes={dexes}  span={span} handleChange={handleSpanChange} dataStore={dataStore} />
        <AvgTable dataStore={dataStore}/>
      </div>
      <VolatilityTable dataStore={dataStore}/>
    </div>
  )
})

export default MainPanel