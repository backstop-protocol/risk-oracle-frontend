import { useEffect, useState } from 'react';

import axios from 'axios';
import { coingeckoMap } from '../utils/utils';
import mainStore from '../stores/main.store';
import { observer } from "mobx-react";

async function getPrice(base, setPrice, setDayChange) {
  const id = coingeckoMap[base.toLowerCase()];
  const url = `https://api.coingecko.com/api/v3/coins/${id}`
  const data = await axios.get(url);
  setPrice((data.data['market_data']['current_price']['usd']).toFixed(2));
  setDayChange((data.data['market_data']['price_change_24h']).toFixed(2));
}

const InfoLine = observer(props => {
  const selectedBase = mainStore.selectedAsset;
  const selectedBaseSymbol = selectedBase.name === 'ETH' ? 'WETH' : selectedBase.name;
  const graphData = mainStore.graphData;
  const dataForPriceComputation = graphData['uniswapv2'][1];
  const priceInfo = {};
  const [price, setPrice] = useState(0);
  const [dayChange, setDayChange] = useState(0);

  if (dataForPriceComputation) {
    const dataForBase = dataForPriceComputation.filter(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase());
    for (let i = 0; i < dataForBase.length; i++) {
      if (dataForBase[i].quote === 'USDC') {
        priceInfo['startPrice'] = dataForBase[i].startPrice.toFixed(2);
        priceInfo['lastPrice'] = dataForBase[i].endPrice.toFixed(2);
        priceInfo['startLiquidity'] = dataForBase[i].volumeForSlippage[0][1].toFixed(2);
        priceInfo['endLiquidity'] = dataForBase[i].volumeForSlippage.slice(-1)[0][1].toFixed(2);
      }
    }
    if (Object.keys(priceInfo).length === 0) {
      const dataForBase = dataForPriceComputation.filter(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase());
      priceInfo['startLiquidity'] = dataForBase[0].volumeForSlippage[0][1].toFixed(2);
      priceInfo['endLiquidity'] = dataForBase[0].volumeForSlippage.slice(-1)[0][1].toFixed(2);
    }
  }
  useEffect(() => {
    if (priceInfo.lastPrice === undefined) {
      getPrice(selectedBaseSymbol, setPrice, setDayChange);
    }
    else{
      setPrice(undefined);
      setDayChange(undefined);
    }
  }, [selectedBaseSymbol, priceInfo.lastPrice]);

  return (
    <div className="info-line">
      <div className="info">
        <span>
          <strong>{selectedBase.name}</strong>
        </span>
        <small>
          <span>
            price: <strong>${priceInfo.lastPrice ? priceInfo.lastPrice : price}</strong>
          </span>
        </small>
        <small>
          <span>
            24H price change: <strong>{priceInfo.lastPrice ? ((Number(priceInfo.lastPrice) - Number(priceInfo.startPrice)) / Number(priceInfo.startPrice) * 100).toFixed(2) : dayChange}%</strong>
          </span>
        </small>
        <small>
          <span>
            24H Liquidity change: <strong>{((Number(priceInfo.endLiquidity) - Number(priceInfo.startLiquidity)) / Number(priceInfo.endLiquidity) * 100).toFixed(2)}%</strong>
          </span>
        </small>
      </div>
    </div>
  )
})

export default InfoLine