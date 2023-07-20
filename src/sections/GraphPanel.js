import AvgTable from "../components/AvgTable";
import { Box } from "@mui/system";
import VolatilityTable from "../components/VolatilityTable";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { roundTo } from "../utils/utils";
import symbols from "../config";
import { Divider } from "@mui/material";
import LiquidityChartMobile from "../components/LiquidityChartMobile";
import LiquidityChart from "../components/LiquidityChart";

const MainPanel = observer(props => {
  const mobile = mainStore.mobile;
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
      <Box sx={{flex:"0 2 auto", marginTop:"5%", width:"100%", height:"100%", display:'flex', flexDirection:"column", justifyContent:"space-evenly", alignItems:"center", rowGap:"3%"}}>
  <Divider sx={{width:"100%", marginBottom:"5%"}} />
      <Box sx={{display:'flex', width:"100%", flexDirection:"row", justifyContent:"space-around", alignItems:"center", rowGap:"2%",flexWrap:"wrap"}}>
        {mobile ? 
        <LiquidityChartMobile availableQuotesForBase={availableQuotesForBase} selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} loading={loading} displayData={displayData} dataStore={dataStore} />
      :
      <LiquidityChart availableQuotesForBase={availableQuotesForBase} selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} loading={loading} displayData={displayData} dataStore={dataStore} />
    }
    {mobile ? <div></div> : <AvgTable selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} slippage={slippage} dexes={dexes} averageData={averageData} />}
      </Box>
      <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", height:"100%"}}>
    {mobile ? <AvgTable selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} slippage={slippage} dexes={dexes} averageData={averageData} /> : ""}
        <VolatilityTable selectedBaseSymbol={selectedBaseSymbol} quotes={quotes} slippage={slippage} dexes={dexes} averageData={averageData} />
      </Box>
      </Box>
  )
})
export default MainPanel