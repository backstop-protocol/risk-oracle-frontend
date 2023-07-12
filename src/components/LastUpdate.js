import { Skeleton, Stack, Tooltip, Typography } from "@mui/material"

import { ErrorOutline } from "@mui/icons-material"
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
    <Stack>
      <Typography  variant="subtitle2"><b>Last Update</b> <Tooltip title={TOOLTIP_TEXT}><ErrorOutline sx={{transform:"rotate(180deg)"}} /></Tooltip></Typography>
      {date ? 
      <Typography variant="subtitle2" color="text.disabled">{moment(date).format('LL')}</Typography>
      :
      <Skeleton />}
      {date ? 
      <Typography>{moment(date).fromNow()}.</Typography>
      :
      <Skeleton />}
    </Stack>
    )
    }
  )

export default LastUpdate