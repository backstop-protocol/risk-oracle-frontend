import { Box, Paper, Skeleton } from '@mui/material';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import GraphControls from './GraphControls';
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
    displayValues.sort((a,b) => b[1] - a[1]);

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
 const {quotes, displayData, selectedBaseSymbol} = props;
  return (
    <Paper sx={{display:"flex", flexDirection:"column", minWidth:"50%", maxWidth:"80%", height:"50%", minHeight: '410px', marginRight: "1vw", marginLeft:"1vw" }}>
      <Box sx={{padding:"1vh 1vw 0 1vw"}}>
      <GraphControls selectedBaseSymbol={props.selectedBaseSymbol} availableQuotesForBase={props.availableQuotesForBase} />
      </Box>
      <Box sx={{height:"100%", padding:"0 1vw 0 0"}}>
      <ResponsiveContainer width="100%" height="100%">
      {displayData ?
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
      :
      <Skeleton/>}
      </ResponsiveContainer>
      </Box>
    </Paper>
  )
})

export default LiquidityChart