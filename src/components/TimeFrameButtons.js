import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { timeWindows } from "../stores/config.store";

const TimeFrameButtons = observer(props => {
  const span = Number(mainStore.selectedSpan);
  return (
    <div style={{display: 'flex', width:"25%", gap:"1%"}}>
      {Object.entries(timeWindows).map(([tw, v])=> 
      <button key={tw} onClick={()=> mainStore.handleSpanChange(v)} className={`${span !== v ? 'outline' : ''} secondary small-btn`}>{tw}</button>)}
    </div>
  )
})

export default TimeFrameButtons