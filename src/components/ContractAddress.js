import { observer } from "mobx-react"
import { makeAutoObservable, runInAction } from "mobx"

class LocalStore {

  copiedToClipboard = false

  constructor (){
    makeAutoObservable(this)
  }

  copyToClipboard = async txt => {
    await navigator.clipboard.writeText(txt)
    runInAction(()=> this.copiedToClipboard = true)
    setTimeout(()=> runInAction(()=> this.copiedToClipboard = false), 3000)
  }
}

const localStore = new LocalStore ()

const TOOLTIP_TEXT_1 = "This contract address is the on-chain address that points to the specific asset risk data feed"
const TOOLTIP_TEXT_2 = "Copy address to clipboard"
const iconStyle = {
  marginLeft: "10px",
  border: "none"
}

const ContractAddress = observer(props => {
  const {address} = props
  const {copiedToClipboard, copyToClipboard} = localStore
  return (<div>
    <div>
      <small>
        <b>Contract Address</b> 
      </small>
      <small>
      <span style={iconStyle} data-placement="right" data-tooltip={TOOLTIP_TEXT_1}>
        <img className="icon" src="icons/info.svg"/>
      </span>
      </small>
    </div>
    <div>
      <small>
        <a href={`https://etherscan.io/address/${address}`} target>{address}</a>
      </small>
      <span onClick={()=> copyToClipboard(address)} style={iconStyle} data-tooltip={TOOLTIP_TEXT_2}>
        {!copiedToClipboard && <img className="icon" src="icons/content_copy.svg"/>}
        {copiedToClipboard && <img className="icon" src="icons/check_circle.svg"/>}
      </span>
    </div>
  </div>)
})

export default ContractAddress
