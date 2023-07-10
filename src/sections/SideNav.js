import { Box, Paper, Tab, Tabs } from "@mui/material";

import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const SideNav = observer(props => {
  const { assets, search, selectedBaseSymbol } = mainStore
  function handleClick(e, v){
    search(v);
  }
  return (<Paper sx={{ width: "7vw", marginTop: "8vh", height: "100vh", position: "sticky", position: "-webkit-sticky", top: 0, left: 0 }}>
    <Tabs
      orientation="vertical"
      value={selectedBaseSymbol === "WETH" ? "ETH" : selectedBaseSymbol}
      onChange={handleClick}
      textColor="text.primary"
      indicatorColor="secondary"
    >
      {assets.map(_ => <Tab value={_.name} iconPosition="start"  icon={<Box component="img" sx={{height:"3vh"}} alt={`${_.name} icon`} src={`/asset-icons/${_.name}.webp`} />} label={_.name} />)}
    </Tabs>
  </Paper>
  )
})

export default SideNav