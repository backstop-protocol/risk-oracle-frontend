import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import TimeFrameButtons from './TimeFrameButtons';
import { largeNumberFormatter } from '../utils/utils';
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
    const selectedQuotes = mainStore.selectedQuotes;
    const date = new Date(loadedPayload.timestamp*1000);
    delete loadedPayload.blockNumber;
    delete loadedPayload.timestamp;
    const displayValues = [];
    for (const key of Object.entries(loadedPayload)) {
      if(selectedQuotes.includes(key[0])){
      displayValues.push(key);
    }
    }

    return (
      <div className="tooltip-container">
          <div>Date: {date.toLocaleString()}</div>
          <div>Blocknumber: {blockNumber}</div>
          {displayValues.map(_ => <div key={_[0]}>{_[0]}: {largeNumberFormatter(_[1])} {selectedBase.name}</div>)}
      </div>
    );
  }
}


const LiquidityChart = observer(props => {
 const {loading, quotes, displayData, selectedBaseSymbol} = props;
  return (
    <article className='box' style={{ width: '100%', height: '30vh', minHeight: '440px', marginTop: "0px", }}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
      <TimeFrameButtons/>
      </div>
      
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
          <XAxis dataKey="blockNumber" tickMargin={15} label={{ value: 'block number', position: 'bottom', offset: '7' }} />
          <YAxis unit={` ${selectedBaseSymbol}`} tickMargin={5} tickFormatter={largeNumberFormatter} />
          <Tooltip content={CustomTooltip}/>
          <Legend verticalAlign='top' />
          {quotes.map(_ => <Line key={_} type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
        </LineChart>
      </ResponsiveContainer>}
      {loading && <div style={{ marginTop: '100px' }} aria-busy="true"></div>}
    </article>
  )
})

export default LiquidityChart