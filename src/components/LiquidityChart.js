import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { largeNumberFormatter, roundTo } from '../utils/utils';

import TimeFrameButtons from './TimeFrameButtons';
import mainStore from '../stores/main.store';
import { observer } from "mobx-react";

const strokes = {
  USDC: '#0088FE',
  WBTC: '#00C49F',
  WETH: '#FFBB28'
}


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const loadedPayload = Object.assign({}, payload[0].payload)
    const selectedBase = mainStore.selectedAsset;
    const blockNumber = loadedPayload.blockNumber;
    delete loadedPayload.blockNumber;
    const displayValues = [];
    for (const key of Object.entries(loadedPayload)) {
      displayValues.push(key);
    }

    return (
      <div className="tooltip-container">
          <div>Blocknumber: {blockNumber}</div>
          {displayValues.map(_ => <div key={_[0]}>{_[0]}: {largeNumberFormatter(_[1])} {selectedBase.name}</div>)}
      </div>
    );
  }
}


const LiquidityChart = observer(props => {
  const { span, dexes, slippage } = props
  const loading = mainStore.loading;
  const displayData = [];
  const quotes = [];
  const selectedBase = mainStore.selectedAsset;
  const selectedBaseSymbol = selectedBase.name === 'ETH' ? 'WETH' : selectedBase.name;
  if (!loading) {
    const data = mainStore.data;
    const volumeData = {};

    for (const dex of dexes) {
      const dataForDex = data[dex][span];
      const dataForDexForBase = dataForDex.filter(_ => _.base.toLowerCase() === selectedBaseSymbol.toLowerCase());
      for (const slippageData of dataForDexForBase) {
        if (!quotes.includes(slippageData.quote)) {
          quotes.push(slippageData.quote);
        }
        const quote = slippageData.quote;
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
      for (const [quote, slippageValue] of Object.entries(quotesData)) {
        toPush[quote] = roundTo(slippageValue);
      }
      displayData.push(toPush);
    }
  }


  return (
    <article className='box' style={{ width: '100%', height: '30vh', minHeight: '440px', marginTop: "0px", }}>
      <TimeFrameButtons span={props.span} handleChange={props.handleChange} />
      {!loading && <ResponsiveContainer width="100%" height="100%">
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
          <XAxis dataKey="blockNumber" label={{ value: 'block number', position: 'bottom', offset: '7' }} />
          <YAxis unit={` ${selectedBaseSymbol}`} />
          <Tooltip content={CustomTooltip} />
          <Legend verticalAlign='top' />
          {quotes.map(_ => <Line type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
        </LineChart>
      </ResponsiveContainer>}
      {loading && <div style={{ marginTop: '100px' }} aria-busy="true"></div>}
    </article>
  )
})

export default LiquidityChart