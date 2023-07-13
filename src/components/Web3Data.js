import { Box, Paper, Typography } from "@mui/material";

import ContractAddress from "./ContractAddress";
import InfoLine from "./InfoLine";
import LastUpdate from "./LastUpdate";
import { largeNumberFormatter } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { pythiaAddress } from "../config";

const Web3Data = observer(props => {
    const web3Data = mainStore.web3Data;
    const span = mainStore.selectedSpan;
    const selectedBase = mainStore.selectedAsset.name;
    return (
        <Paper sx={{width:"95%",margin:"0 1vw 0 1vw", display:"flex", justifyContent:"space-between", alignItems:"start", padding:"1vh 1vw 1vh 1vw"}}>
            <Box >
                <InfoLine />
                <ContractAddress address={pythiaAddress} />
            </Box>
            {web3Data && web3Data[selectedBase] ? <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%', alignItems: "end", alignContent: 'end', flexWrap: 'wrap' }}>
                <Box sx={{ minHeight: '50%' }}>
                    <Typography>
                    Avg 30 days uniV3 liquidity vs USDC
                    </Typography>
                    
                    <Typography>
                            {selectedBase}: {largeNumberFormatter(web3Data[selectedBase]['value'])} (${largeNumberFormatter(web3Data[selectedBase]['value'] * mainStore.basePrice)})
                    </Typography>
                        
                </Box>
            </Box>: <Box></Box>}
            {web3Data && web3Data[selectedBase] ? 
                <div>
                    <LastUpdate date={mainStore.lastUpdate[span]} />
                </div>: <Box></Box>}
        </Paper>

    )
})

// className="web3data" style={{ display: 'flex', justifyContent: 'space-between', alignItems: "start", margin: "0 !important" }}
export default Web3Data