import assetsDataStore from '../stores/assets.data.store';
import mainStore from '../stores/main.store';
import { observer } from "mobx-react";

const InfoLine = observer(props => {
  const selectedBase = mainStore.selectedAsset;
  const selectedBaseSymbol = selectedBase.name === 'ETH' ? 'WETH' : selectedBase.name;
  const data = assetsDataStore.data;
  const dataForPriceComputation = data['uniswapv2'][1];
  const priceInfo = {};
  if(dataForPriceComputation){
    const dataForBase = dataForPriceComputation.filter(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase());
    for(let i = 0; i < dataForBase.length; i++){
      if(dataForBase[i].quote === 'USDC'){
        priceInfo['startPrice'] = dataForBase[i].startPrice.toFixed(2);
        priceInfo['lastPrice'] = dataForBase[i].endPrice.toFixed(2);
        priceInfo['startLiquidity'] = dataForBase[i].volumeForSlippage[0][1].toFixed(2);
        priceInfo['endLiquidity'] = dataForBase[i].volumeForSlippage.slice(-1)[0][1].toFixed(2);
      }
    }
  }

  return (
    <div className="info-line">
      <div className="info">
        <span>
          <strong>{selectedBase.name}</strong>
        </span>
        <small>
          <span>
            price: <strong>${priceInfo.lastPrice}</strong>
          </span>
        </small>
        <small>
          <span>
            24H price change: <strong>{((Number(priceInfo.lastPrice) - Number(priceInfo.startPrice)) / Number(priceInfo.startPrice) * 100).toFixed(2)}%</strong>
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