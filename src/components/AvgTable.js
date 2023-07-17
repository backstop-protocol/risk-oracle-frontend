import { Paper } from "@mui/material";
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
  const price = mainStore.coingeckoPriceInfos[symbol.toUpperCase()].price;
  

  return <tr key={symbol}>
    <td>{symbol}</td>
    <td>{largeNumberFormatter(data.average.toFixed(2))} {selectedBaseSymbol}
    <br/><small>${largeNumberFormatter(data.average*price)}</small></td>
  </tr>
}

const AvgTable = observer(props => {
  const { selectedBaseSymbol } = props;
  const span = mainStore.selectedSpan;
  const rowDataArray = mainStore.averageTableDisplayArray;
  if(rowDataArray.length > 0){
  return (
    <Paper sx={{marginRight:"1vw", flex:"0 1 auto"}}>
      <table>
        <thead>
          <tr>
            <th scope="col">AVG {selectedBaseSymbol} {timeMap[span]}</th>
            <th scope="col">Liquidity</th>
          </tr>
        </thead>
        <tbody>
          {rowDataArray.map(_ => row(_, selectedBaseSymbol))}
        </tbody>
      </table>
      </Paper>
  )
}
})

export default AvgTable