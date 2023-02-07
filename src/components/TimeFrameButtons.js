const timeFrames = [
  "24H",
  "7D",
  "30D",
  "90D",
  "180D",
  "1Y",
  "MAX"
]

const TimeFrameButtons = props => {
  return (
    <div style={{display: 'flex', gap: '10px'}}>
      {timeFrames.map(tf=> <button key={tf} className="secondary outline small-btn">{tf}</button>)}
    </div>
  )
}

export default TimeFrameButtons