import { largeNumberFormatter } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

function row(rowData) {
  const symbol = (Object.keys(rowData)[0])
  const data = rowData[symbol];

  return <tr>
    <td>{symbol}</td>
    <td>{largeNumberFormatter(data.average.toFixed(2))}</td>
    <td>{(data.volatility * 100).toFixed(2)}%</td>
  </tr>
}

const AvgTable = observer(props => {
  const { selectedBaseSymbol, quotes, slippage, dexes, span, averageData } = props;
  const rowDataArray = [];
  const sortedData = {};
  const loading = mainStore.loading;
  if(!loading){
  for (const dex of dexes) {
    const dataForDexForSpanForBase = averageData[dex][span][selectedBaseSymbol];
    for (const quote of quotes) {
      if (!sortedData[quote]) {
        sortedData[quote] = {}
      }
      if (!sortedData[quote]['average']) {
        sortedData[quote]['average'] = dataForDexForSpanForBase[quote]['avgLiquidity'][slippage];
      }
      if (sortedData[quote]['average']) {
        sortedData[quote]['average'] += dataForDexForSpanForBase[quote]['avgLiquidity'][slippage];
      }
      if (!sortedData[quote]['volatility']) {
        sortedData[quote]['volatility'] = 0
      }
      sortedData[quote]['volatility'] += dataForDexForSpanForBase[quote].volatility;
    }
  }
  for (const quote of Object.keys(sortedData)) {
    sortedData[quote].volatility = sortedData[quote].volatility / dexes.length;
  }
  for (const [key, value] of Object.entries(sortedData)) {
  const toPush = {}
  toPush[key] = value;
  rowDataArray.push(toPush);
}
}

return (
  <article style={{ marginTop: 0, }} className="box">
    <table>
      <thead>
        <tr>
          <th scope="col">AVG</th>
          <th scope="col">Liquidity</th>
          <th scope="col">Volatility</th>
        </tr>
      </thead>
      <tbody>
        {rowDataArray.map(_ => row(_))}
      </tbody>
    </table>
  </article>
)
})

export default AvgTable