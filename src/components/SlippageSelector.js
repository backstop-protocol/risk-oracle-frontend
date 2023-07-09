import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const options = [
  1, 5, 10, 15, 20
]

const SlippageSelector = observer(props => {
  const currentValue = mainStore.selectedSlippage;
  return (
    <div style={{display: 'flex', justifyContent:"center", alignItems:"center", width:"20%"}}>
      <select style={{width:"100%"}} id="slippage-selector" value={currentValue} onChange={(event) => mainStore.handleSlippageChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}% slippage</option>)}
      </select>
    </div>
  )
})

export default SlippageSelector