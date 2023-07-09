import { Skeleton } from "@mui/material"
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
  const selectedBase = mainStore.selectedAsset.name;
  const date = web3Data && web3Data[selectedBase] ? web3Data[selectedBase]['lastUpdate'] * 1000 : undefined;
  return (
    <div >
      <div><small><b>Last update</b></small>
        <span style={iconStyle} data-placement="left" data-tooltip={TOOLTIP_TEXT}>
          <img className="icon" src="icons/info.svg" />
        </span>
      </div>
      {date ? 
      <div>
      <div style={{ color: "var(--muted-color)" }}><small>{moment(date).format('LL')}</small></div>
      <div><small>{moment(date).fromNow()}</small></div> </div>
      : <Skeleton />}
    </div>)
    }
  )

export default LastUpdate