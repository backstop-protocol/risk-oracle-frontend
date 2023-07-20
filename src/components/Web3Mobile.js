import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from "@mui/material";

import ContractAddress from "./ContractAddress";
import InfoLine from "./InfoLine";
import LastUpdate from "./LastUpdate";
import { largeNumberFormatter, roundTo } from "../utils/utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { pythiaAddress } from "../config";
import { ExpandMore } from "@mui/icons-material";

const Web3Mobile = observer(props => {
    const web3Data = mainStore.web3Data;
    const span = mainStore.selectedSpan;
    const selectedBase = mainStore.selectedAsset.name;
    
    const price = mainStore.coingeckoPriceInfos[selectedBase].price;
    return (
        <Box sx={{width:"95%"}}>
            <Accordion>  
                <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{width:"100%", height:"5vh"}}>
                    <Typography variant="body2">{selectedBase} Information</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{display:"flex", flexDirection:"column", alignItems:"left", justifyContent:"start"}}>
                <InfoLine />
                <Divider sx={{margin:"5px 0px 5px 0px"}} />
                <ContractAddress address={pythiaAddress} />
                <Divider sx={{margin:"5px 0px 5px 0px"}} />
                {web3Data && web3Data[selectedBase] ? <Box>
                <Box sx={{ minHeight: '50%' }}>
                    <Typography>
                    Avg 30 days uniV3 liquidity vs USDC
                    </Typography>
                    
                    <Typography>
                            {selectedBase}: {largeNumberFormatter(web3Data[selectedBase]['value'])} (${largeNumberFormatter(web3Data[selectedBase]['value'] * price)})
                    </Typography>
                    
                    <Typography>
                    30 days uniV3 volatility vs USDC
                    </Typography>
                    
                    <Typography>
                            {selectedBase}: {`${roundTo(web3Data[selectedBase]['volatilityValue'] * 100, 2)}%`}
                    </Typography>
                        
                </Box>
            </Box>: <Box></Box>}
                <Divider sx={{margin:"5px 0px 5px 0px"}} />
            {web3Data && web3Data[selectedBase] ? 
                <Box>
                    <LastUpdate date={mainStore.lastUpdate[span]} />
                </Box>: <Box></Box>}
                </AccordionDetails>
            </Accordion>
            </Box>
            

    )
})

export default Web3Mobile