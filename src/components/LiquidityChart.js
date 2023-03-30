import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import TimeFrameButtons from './TimeFrameButtons';
import assetsDataStore from '../stores/assets.data.store';
import mainStore from '../stores/main.store';
import { observer } from "mobx-react";

const strokes = {
  USDC: '#0088FE',
  WBTC: '#00C49F',
  WETH: '#FFBB28'
}

const LiquidityChart = observer(props => {
  const { dataStore, span, dexes, slippage } = props
  const loading = assetsDataStore.loading;
  if (loading) {
    return
  }
  const data = assetsDataStore.data;
  const selectedBase = mainStore.selectedAsset;
  const selectedBaseSymbol = selectedBase.name === 'ETH' ? 'WETH' : selectedBase.name;
  const volumeData = [];
  const displayData = [];
  const quotes = [];

  for (const dex of dexes) {
    const dataForDex = data[dex][span];
    const dataForDexForBase = dataForDex.filter(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase());
    for (const slippageData of dataForDexForBase) {
      if (!quotes.includes(slippageData.quote)) {
        quotes.push(slippageData.quote);
      }
      volumeData.push(slippageData);
    }
  }
  
  for (let i = 0; i < volumeData.length; i++) {
    for (let j = 0; j < volumeData[i]['volumeForSlippage'].length; j++) {
      const quote = volumeData[i]['quote'];
      if (i === 0) {
        const toPush = {};
        toPush['blockNumber'] = volumeData[i]['volumeForSlippage'][j]['blockNumber'];
        toPush[quote] = Number((volumeData[i]['volumeForSlippage'][j][slippage]).toFixed(2));
        displayData.push(toPush);
      }
      else {
        const index = displayData.findIndex(_ => _.blockNumber === volumeData[i]['volumeForSlippage'][j]['blockNumber']);
        if (index === -1) {
          continue
        }
        else {
          displayData[index][quote] = Number((volumeData[i]['volumeForSlippage'][j][slippage]).toFixed(2));
        }
      }
    }
  }
  const { liquidityChartData, loadingLiquidityChartData } = dataStore
  return (
    <article className='box' style={{ width: '100%', height: '30vh', minHeight: '440px', marginTop: "0px", }}>
      <TimeFrameButtons span={props.span} handleChange={props.handleChange} />
      {!loadingLiquidityChartData && <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={displayData}
          margin={{
            top: 5,
            right: 0,
            left: 60,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="blockNumber" label={{ value: 'block number', position:'bottom', offset:'7' }} />
          <YAxis unit={` ${selectedBaseSymbol}`}/>
          <Tooltip />
          <Legend verticalAlign='top' />
          {quotes.map(_=> <Line type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
        </LineChart>
      </ResponsiveContainer>}
      {loadingLiquidityChartData && <div style={{ marginTop: '100px' }} aria-busy="true"></div>}
    </article>
  )
})

export default LiquidityChart