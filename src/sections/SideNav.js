import { Box, Paper, Tab, Tabs } from "@mui/material";

import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const SideNav = observer(props => {
  const { assets, search, selectedBaseSymbol } = mainStore
  function handleClick(e, v) {
    search(v);
  }
  return (
    <Box sx={{ width: "7%", height: "100%", position: "sticky", top: 0, left: 0, display:"flex", flexDirection:"column" }}>
      <Box sx={{height:"8vh", }} />
      <Paper sx={{height:"100%", minHeight:"92vh", maxHeight:"92vh"}}>
        <Tabs
          orientation="vertical"
          value={selectedBaseSymbol === "WETH" ? "ETH" : selectedBaseSymbol === "sUSD" ? "SUSD" : selectedBaseSymbol}
          variant="scrollable"
          onChange={handleClick}
          textColor="inherit"
          indicatorColor="secondary"
        >
          {assets.map(_ => <Tab sx={{justifyContent:"start", minHeight:"35px", paddingLeft:"1px"}} key={_.name} value={_.name} iconPosition="start" icon={<Box component="img" sx={{ height: "3vh" }} alt={`${_.name} icon`} src={`/asset-icons/${_.name}.webp`} />} label={_.name} />)}
        </Tabs>
      </Paper>
    </Box>
  )
})

export default SideNav