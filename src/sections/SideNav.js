import { Box, Tab, Tabs } from "@mui/material";

import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const SideNav = observer(props => {
  const { assets, search, selectedBaseSymbol } = mainStore
  function handleClick(e, v){
    search(v);
  }
  return (<Box sx={{ width: "7vw", marginTop: "8vh", height: "100vh", position: "sticky", position: "-webkit-sticky", top: 0, left: 0 }}>
    <Tabs
      orientation="vertical"
      value={selectedBaseSymbol === "WETH" ? "ETH" : selectedBaseSymbol}
      onChange={handleClick}
    >
      {assets.map(_ => <Tab value={_.name} iconPosition="start" color="text.primary" icon={<Box component="img" sx={{height:"3vh"}} alt={`${_.name} icon`} src={`/asset-icons/${_.name}.webp`} />} label={_.name} />)}
    </Tabs>
  </Box>
  )
})

export default SideNav