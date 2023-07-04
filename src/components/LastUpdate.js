import mainStore from "../stores/main.store"
import moment from "moment"
import { observer } from "mobx-react"

const TOOLTIP_TEXT = "time since last update was published on-chain"
const iconStyle = {
  marginLeft: "10px",
  border: "none"
}

const LastUpdate = observer(props => {
    const web3Data = mainStore.web3Data;
    if (web3Data) {
        const selectedBase = mainStore.selectedAsset.name;
        if (web3Data[selectedBase]) {
          const date = web3Data[selectedBase]['lastUpdate'] * 1000;
  return (
    <div >
      <div><small><b>Last update</b></small>       
        <span style={iconStyle} data-placement="left" data-tooltip={TOOLTIP_TEXT}>
          <img className="icon" src="icons/info.svg"/>
        </span>
      </div>
      <div style={{color: "var(--muted-color)"}}><small>{moment(date).format('LL')}</small></div>
      <div><small>{moment(date).fromNow()}</small></div>
    </div>
  )}}
})

export default LastUpdate