import symbols, { pythiaAddress } from "../config";

import AvgTable from "../components/AvgTable";
import ContractAddress from "../components/ContractAddress";
import DexSelector from "../components/DexSelector";
import InfoLine from "../components/InfoLine";
import LastUpdate from "../components/LastUpdate";
import LiquidityChart from "../components/LiquidityChart";
import VolatilityTable from "../components/VolatilityTable";
import Web3Data from "../components/Web3Data";
// import ComparisonAssetsSelector from "../components/ComparisonAssetsSelector"
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { roundTo } from "../utils/utils";

const MainPanel = observer(props => {
  const slippage = mainStore.selectedSlippage;
  const dexes = mainStore.selectedDexes;
  const loading = mainStore.loading;
  const span = mainStore.selectedSpan;
  const displayData = [];
  const quotes = mainStore.selectedQuotes;
  const timestamps = mainStore.timestamps;
  let averageData = null;
  const selectedBase = mainStore.selectedAsset;
  const selectedBaseSymbol = symbols[selectedBase.name];
  let availableQuotesForBase = [];
  if (!loading) {
    const graphData = mainStore.graphData;
    averageData = mainStore.averageData;
    const volumeData = {};
    for (const dex of dexes) {
      const dataForDex = graphData[dex][span];
      const dataForDexForBase = dataForDex.filter(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase());
    for (const slippageData of dataForDexForBase) {
        const quote = slippageData.quote;
        if(!availableQuotesForBase.includes(quote)){
        availableQuotesForBase.push(quote);
      }
      availableQuotesForBase.sort();
        for (const volumeForSlippage of slippageData.volumeForSlippage) {
          const blockNumber = volumeForSlippage.blockNumber;
          const slippageValue = volumeForSlippage[slippage];
          if (!volumeData[blockNumber]) {
            volumeData[blockNumber] = {};
          }
          if (!volumeData[blockNumber][quote]) {
            volumeData[blockNumber][quote] = 0;
          }
          volumeData[blockNumber][quote] += slippageValue;
        }
      }
    }
    for (const [blockNumber, quotesData] of Object.entries(volumeData)) {
      const toPush = {};
      toPush['blockNumber'] = blockNumber;
      toPush['timestamp'] = timestamps[span][blockNumber];
      for (const [quote, slippageValue] of Object.entries(quotesData)) {
        toPush[quote] = roundTo(slippageValue);
      }
      displayData.push(toPush);
    }
  }

  
  const {searchedAsset, selectedAsset, dataStore} = mainStore

  if (!selectedAsset && !searchedAsset) {
    return <div className="main-content">search or select an asset</div>
  }
  if (!selectedAsset && searchedAsset) {
    return <div className="main-content">the searched asset {searchedAsset} is not yet supported</div>
  }
  if(mainStore.loading){
    return (<div className="main-content">
      <div style={{paddingTop: '30vh'}} aria-busy="true"></div>
    </div>)
  }
  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing)', width: '100%'}}>
        <div style={{ flexGrow: 1}}>
          <article className="box" style={{display: 'flex', justifyContent:'space-between', alignItems: "start"}}>
            <div >
              <InfoLine/>
              <ContractAddress address={pythiaAddress}/>
            </div>
            <div style={{display: 'flex', flexDirection:'column', minHeight:'100%', alignItems: "end", alignContent:'end', flexWrap:'wrap'}}>
            <div style={{minHeight:'50%'}}><Web3Data/></div>
            </div>
            <div>
            <LastUpdate date={mainStore.lastUpdate[span]}/>
            </div>
          </article>
          <article className="box">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '', fontSize: "0.875em"}}>
              {/* <ComparisonAssetsSelector dataStore={dataStore}/> */}
              <DexSelector selectedBaseSymbol={selectedBaseSymbol} availableQuotesForBase={availableQuotesForBase}/>
            </div>
            
          </article>
        </div>
      </div>
      <div style={{display: 'flex', gap: 'var(--spacing)'}}>
        {loading? '': <LiquidityChart selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} loading={loading} displayData={displayData} dataStore={dataStore} />}
        <AvgTable selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} slippage={slippage} dexes={dexes} averageData={averageData}/>
      </div>
      <VolatilityTable selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} slippage={slippage} dexes={dexes} averageData={averageData}/>
    </div>
  )
})

export default MainPanel