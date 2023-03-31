import { observer } from "mobx-react"
import timeWindows from "../stores/timeWindows"

const TimeFrameButtons = observer(props => {
  return (
    <div style={{display: 'flex', gap: '10px'}}>
      {Object.entries(timeWindows).map(([tw, v])=> <button key={tw} onClick={()=> props.handleChange(v)} className={`${props.span !== v ? 'outline' : ''} secondary small-btn`}>{tw}</button>)}
    </div>
  )
})

export default TimeFrameButtons