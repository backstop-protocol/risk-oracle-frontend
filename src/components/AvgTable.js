import { largeNumberFormatter } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const timeMap = {
  1: "24H",
  7: "7D",
  30: "30D",
  180: "180D",
  365: "1Y",
}

function row(rowData, selectedBaseSymbol) {
  const symbol = (Object.keys(rowData)[0])
  const data = rowData[symbol];

  return <tr key={symbol}>
    <td>{symbol}</td>
    <td>{largeNumberFormatter(data.average.toFixed(2))} {selectedBaseSymbol}</td>
    <td>{(data.volatility * 100).toFixed(2)}%</td>
  </tr>
}

const AvgTable = observer(props => {
  const { selectedBaseSymbol, quotes, slippage, dexes, averageData } = props;
  const span = mainStore.selectedSpan;
  const rowDataArray = [];
  const sortedData = {};
  const loading = mainStore.loading;
  const ratios = {};
  if (!loading) {
    for (const dex of dexes) {
      ratios[dex] = {};
      const dataForDexForSpanForBase = averageData[dex][span][selectedBaseSymbol];
      for (const quote of quotes) {
        ratios[dex][quote] = 0;
        if (!sortedData[quote]) {
          sortedData[quote] = {}
        }
        if (!sortedData[quote]['average']) {
          sortedData[quote]['average'] = 0;
        }
        if (dataForDexForSpanForBase[quote]) {
          sortedData[quote]['average'] += (dataForDexForSpanForBase[quote]['avgLiquidity'][slippage]);
        }
        if (!sortedData[quote]['volatility']) {
          sortedData[quote]['volatility'] = 0
        }
        if (dataForDexForSpanForBase[quote]) {
          sortedData[quote]['volatility'] += dataForDexForSpanForBase[quote].volatility;
          ratios[dex][quote]++;
        }
      }
    }
    for (const quote of Object.keys(sortedData)) {
      let quoteRatio = 0;
      const ratioMap = Object.entries(ratios);
      for(let i = 0; i < ratioMap.length; i++){
        if(ratioMap[i][1][quote] === 1){
          quoteRatio++
        }
      }
      sortedData[quote].volatility = sortedData[quote].volatility / quoteRatio;
    }
    for (const [key, value] of Object.entries(sortedData)) {
      const toPush = {}
      toPush[key] = value;
      rowDataArray.push(toPush);
    }
    rowDataArray.sort((a, b) => Object.entries(b)[0][1].average - Object.entries(a)[0][1].average);
    mainStore.updateAverages(rowDataArray);
  }


  return (
    <article style={{ marginTop: 0, }} className="box">
      <table>
        <thead>
          <tr>
            <th scope="col">AVG {selectedBaseSymbol} {timeMap[span]}</th>
            <th scope="col">Liquidity</th>
            <th scope="col">Volatility</th>
          </tr>
        </thead>
        <tbody>
          {rowDataArray.map(_ => row(_, selectedBaseSymbol))}
        </tbody>
      </table>
    </article>
  )
})

export default AvgTable