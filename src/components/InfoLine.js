import { Box, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import axios from 'axios';
import { coingeckoMap } from '../utils/utils';
import mainStore from '../stores/main.store';
import { observer } from "mobx-react";

async function getPrice(base, setPrice, setDayChange) {
  if(!mainStore.coingeckoPriceInfos[base]) {
    return;
  }
  
  setPrice(mainStore.coingeckoPriceInfos[base].price);
  setDayChange(mainStore.coingeckoPriceInfos[base].change);
}

const InfoLine = observer(props => {
  const selectedBase = mainStore.selectedAsset;
  const selectedBaseSymbol = selectedBase.name === 'ETH' ? 'WETH' : selectedBase.name;
  const graphData = mainStore.graphData;
  let selectedDex = 'uniswapv3';
  if(!graphData['uniswapv3'] 
      || !graphData['uniswapv3'][7] 
      || !graphData['uniswapv3'][7].some(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase())) {
    selectedDex = 'uniswapv2';
  }
  const dataForPriceComputation = graphData[selectedDex] ? graphData[selectedDex][7] : 0;
  const priceInfo = {};
  const [price, setPrice] = useState(0);
  const [dayChange, setDayChange] = useState(0);

  if (dataForPriceComputation) {
    const dataForBase = dataForPriceComputation.filter(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase());
    for (let i = 0; i < dataForBase.length; i++) {
      if (dataForBase[i].quote === 'USDC') {
        priceInfo['startPrice'] = dataForBase[i].startPrice.toFixed(2);
        priceInfo['lastPrice'] = dataForBase[i].endPrice.toFixed(2);
        priceInfo['startLiquidity'] = dataForBase[i].volumeForSlippage[0].aggregated[5].toFixed(2);
        priceInfo['endLiquidity'] = dataForBase[i].volumeForSlippage.slice(-1)[0].aggregated[5].toFixed(2);
      }
    }
    if (Object.keys(priceInfo).length === 0) {
      const dataForBase = dataForPriceComputation.filter(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase());
      priceInfo['startLiquidity'] = dataForBase[0].volumeForSlippage[0].aggregated[5].toFixed(2);
      priceInfo['endLiquidity'] = dataForBase[0].volumeForSlippage.slice(-1)[0].aggregated[5].toFixed(2);
    }
  }

  useEffect(() => {
    if(selectedBaseSymbol) {
      getPrice(selectedBaseSymbol, setPrice, setDayChange);
    }
  }, [selectedBaseSymbol]);

  const liquidityRatio7D = (Number(priceInfo.endLiquidity) / Number(priceInfo.startLiquidity) - 1) * 100;

  return (
    <Box sx={{display: "flex", justifyContent:"space-between", flexWrap:"wrap", alignItems:"center"}}>
      <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <Box>
        <Typography><b>{selectedBase.name}</b></Typography>
        </Box>
        <Box>
          <Typography>Price: $<b>{priceInfo.lastPrice ? priceInfo.lastPrice : price}</b></Typography>
        </Box>
        <Box>
          <Typography>24H price change: <b>{dayChange > 0 ? `+${dayChange}` : dayChange}%</b></Typography>
        </Box>
        <Box>
          <Typography>7D Liquidity change: <b>{ liquidityRatio7D > 0 ? `+${liquidityRatio7D.toFixed(2)}` : liquidityRatio7D.toFixed(2)}%</b></Typography>
        </Box>
      </Stack>
    </Box>
  )
})

export default InfoLine