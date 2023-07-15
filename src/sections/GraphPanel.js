import AvgTable from "../components/AvgTable";
import { Box } from "@mui/system";
import LiquidityChart from "../components/LiquidityChart";
import VolatilityTable from "../components/VolatilityTable";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { roundTo } from "../utils/utils";
import symbols from "../config";
import Footer from "./Footer";

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
        if (!availableQuotesForBase.includes(quote)) {
          availableQuotesForBase.push(quote);
        }
        availableQuotesForBase.sort();
        for (const volumeForSlippage of slippageData.volumeForSlippage) {
          const blockNumber = volumeForSlippage.blockNumber;
          const slippageValue = volumeForSlippage.aggregated[slippage];
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


  const { searchedAsset, selectedAsset, dataStore } = mainStore

  if (!selectedAsset && !searchedAsset) {
    return <div className="main-content">search or select an asset</div>
  }
  if (!selectedAsset && searchedAsset) {
    return <div className="main-content">the searched asset {searchedAsset} is not yet supported</div>
  }
  if (mainStore.loading) {
    return (<div className="main-content">
      <div style={{ paddingTop: '30vh' }} aria-busy="true"></div>
    </div>)
  }
  return (
    <div className="graphPanel">
      <Box sx={{height:"92%", width:"100%", display:'flex', flexDirection:"column", justifyContent:"space-between", alignItems:"center"}}>
      <Box sx={{display:'flex', height:"45%", width:"100%", flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>
        <LiquidityChart availableQuotesForBase={availableQuotesForBase} selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} loading={loading} displayData={displayData} dataStore={dataStore} />
        <AvgTable selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} slippage={slippage} dexes={dexes} averageData={averageData} />
      </Box>
      <Box sx={{maxHeight:"40%", display:"flex", justifyContent:"center", alignItems:"center"}}>
        <VolatilityTable selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} slippage={slippage} dexes={dexes} averageData={averageData} />
      </Box>
      <Footer />
      </Box>
    </div>
  )
})
export default MainPanel