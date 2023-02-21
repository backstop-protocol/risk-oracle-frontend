import mainStore from "../stores/main.store"
import timeWindows from "../stores/timeWindows"
import { observer } from "mobx-react"

const TimeFrameButtons = observer(props => {
  const {dataStore} = mainStore
  return (
    <div style={{display: 'flex', gap: '10px'}}>
      {timeWindows.map(tw=> <button key={tw} onClick={()=> dataStore.setTimeWindow(tw)} className={`${dataStore.selectedTimeWindow != tw ? 'outline' : ''} secondary small-btn`}>{tw}</button>)}
    </div>
  )
})

export default TimeFrameButtons