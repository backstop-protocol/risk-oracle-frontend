import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

function row(rowData){
  const symbol = (Object.keys(rowData)[0])
  const objectToParse = rowData[symbol];
  const values = []
  for(const [key, value] of Object.entries(objectToParse)){
    values.push([key, value]);
  }
  return  <tr>
  <th>{symbol}</th>
  {values.map(_ => <td>{((_[1]*100).toFixed(2))}%</td>)}
</tr>
}

const VolatilityTable = observer(props => {
  const { selectedBaseSymbol, quotes, dexes, dataStore } = props;
  const spans = mainStore.spans;
  const sortedData = {};
  const displayData = [];
  for (const dex of dexes) {
    for (const span of spans) {
      const dataForDexForSpanForBase = dataStore[dex][span][selectedBaseSymbol];
      for(const quote of quotes){
        if(!sortedData[quote]){
          sortedData[quote] = {}
        }
        if(!sortedData[quote][span]){
          sortedData[quote][span] = dataForDexForSpanForBase[quote].volatility
        }
        if(sortedData[quote][span]){
          sortedData[quote][span] += dataForDexForSpanForBase[quote].volatility
        }
      }
    }
    for(const quote of Object.keys(sortedData)){
      for(const span of Object.keys(sortedData[quote])){
        sortedData[quote][span] = sortedData[quote][span] / dexes.length;
      }
    }
  }
  for(const [key, value] of Object.entries(sortedData)){
    const toPush = {}
    toPush[key] = value;
    displayData.push(toPush);
  }

  return (
    <article style={{ marginTop: 0 }} className="box">
      <table>
        <thead>
          <tr>
            <th scope="col">Avg Volatility</th>
            {spans.map(_=> <th scope="col">{_}</th>)}
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
    </article>
  )
})

export default VolatilityTable