import { Box, Paper, Tab, Tabs } from "@mui/material";

import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const SideNav = observer(props => {
  const { assets, search, selectedBaseSymbol } = mainStore
  function handleClick(e, v) {
    search(v);
  }
  return (
    <Box sx={{ width: "7%", height: "100vh", position: "sticky", top: 0, left: 0 }}>
      <Box height="8vh" />
      <Paper sx={{height:"92vh"}}>
        <Tabs
          orientation="vertical"
          value={selectedBaseSymbol === "WETH" ? "ETH" : selectedBaseSymbol === "sUSD" ? "SUSD" : selectedBaseSymbol}
          variant="scrollable"
          onChange={handleClick}
          textColor="inherit"
          indicatorColor="secondary"
        >
          {assets.map(_ => <Tab sx={{justifyContent:"start"}} key={_.name} value={_.name} iconPosition="start" icon={<Box component="img" sx={{ height: "3vh" }} alt={`${_.name} icon`} src={`/asset-icons/${_.name}.webp`} />} label={_.name} />)}
        </Tabs>
      </Paper>
    </Box>
  )
})

export default SideNav