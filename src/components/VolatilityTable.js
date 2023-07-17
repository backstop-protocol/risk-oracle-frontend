import { Paper } from "@mui/material";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

function row(rowData) {
  const symbol = (Object.keys(rowData)[0])
  const objectToParse = rowData[symbol];
  const values = []
  for (const [key, value] of Object.entries(objectToParse)) {
    values.push([key, value]);
  }
  return <tr key={symbol}>
    <th>{symbol}</th>
    {values.map((_, index) => <td key={index}>{ isNaN(_[1]) ? 'unavailable' : `${((_[1] * 100).toFixed(2))}%`}</td>)}
  </tr>
}
const timeMap = {
  1: "24H",
  7: "7D",
  30: "30D",
  180: "180D",
  365: "365D",
}

const VolatilityTable = observer(props => {
  const { selectedBaseSymbol, dexes, averageData } = props;
  const spans = [7, 30, 180, 365];
  const sortedData = {};
  const displayData = [];
  const ratios = {};
  const quotes = mainStore.quotes;
  const loading = mainStore.loading;
  if (!loading) {
    for (const dex of dexes) {
      ratios[dex] = {};
      for (const span of spans) {
        ratios[dex][span] = {};
        const dataForDexForSpanForBase = averageData[dex][span][selectedBaseSymbol];
        for (const quote of quotes) {
          ratios[dex][span][quote] = 0;
          if (!sortedData[quote]) {
            sortedData[quote] = {}
          }
          if (!sortedData[quote][span]) {
            sortedData[quote][span] = 0
          }
          if(dataForDexForSpanForBase[quote]){
            sortedData[quote][span] += mainStore.useParkinsonVolatility ?  dataForDexForSpanForBase[quote].parkinsonVolatility : dataForDexForSpanForBase[quote].volatility
            ratios[dex][span][quote]++
          }
        }
      }
    }
    for (const quote of Object.keys(sortedData)) {
      const ratioMap = Object.entries(ratios);
      for (const span of Object.keys(sortedData[quote])) {
        let quoteRatio = 0;
        for(let i = 0; i < ratioMap.length; i++){
          if(ratioMap[i][1][span][quote] === 1){
            quoteRatio++;
          }
        }
        sortedData[quote][span] = sortedData[quote][span] / quoteRatio;
      }
    }
    for (const [key, value] of Object.entries(sortedData)) {
      const toPush = {}
      toPush[key] = value;
      displayData.push(toPush);
    }
  }
  return (
    <Paper style={{ marginTop: "4%" }} className="box">
      <table style={{marginBottom :0}}>
        <thead>
          <tr>
            <th scope="col">Avg Volatility</th>
            {spans.map((_, index) => <th key={index} scope="col">{timeMap[_]}</th>)}
          </tr>
        </thead>
        <tbody>
          {displayData.map(_ => row(_))}
        </tbody>
        <tfoot>
          <tr>
          </tr>
        </tfoot>
      </table>
    </Paper>
  )
})

export default VolatilityTable