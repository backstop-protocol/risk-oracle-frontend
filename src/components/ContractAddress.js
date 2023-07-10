import { ContentCopy, Done, ErrorOutline } from "@mui/icons-material"
import { IconButton, Link, Stack, Tooltip, Typography } from "@mui/material"
import { makeAutoObservable, runInAction } from "mobx"

import { observer } from "mobx-react"

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

const TOOLTIP_TEXT_1 = "This contract reads the on-chain risk feeds."
const TOOLTIP_TEXT_2 = "Copy address to clipboard"
const iconStyle = {
  marginLeft: "10px",
  border: "none"
}

const ContractAddress = observer(props => {
  const {address} = props
  const {copiedToClipboard, copyToClipboard} = localStore
  return (<Stack marginTop="1vh">
    <Typography>Contract Address <Tooltip title={TOOLTIP_TEXT_1}><ErrorOutline sx={{transform:"rotate(180deg)"}} /></Tooltip></Typography>
    <Typography><Link target="_blank" href={`https://sepolia.etherscan.io/address/${address}`} color="secondary">{address}</Link> <Tooltip title={TOOLTIP_TEXT_2}><IconButton sx={{width:"2vw",Height: "2vh"}} onClick={()=> copyToClipboard(address)}>{copiedToClipboard ? <Done /> : <ContentCopy />}</IconButton></Tooltip></Typography>
  </Stack>
  )
})

export default ContractAddress
