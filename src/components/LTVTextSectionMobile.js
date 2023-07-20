import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Link } from "@mui/material";

import { useRef } from "react";

function LTVTextSectionMobile() {
    const containerRef = useRef();
    return <Accordion defaultExpanded={true}>
        <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ width: "100%", height: "5vh" }}>
            <small>Smart LTV Formula*</small>
        </AccordionSummary>
        <AccordionDetails sx={{ display: "flex", flexDirection: "column", alignItems: "left", justifyContent: "start" }}>
            <Box sx={{ textAlign: "center", padding: "1vh 0 1vh 2vw", flex: "0 2 auto" }} ref={containerRef} rel="noreferrer noopener">
                <div>Use the widget below to automatically calculate the recommended LTV according to <Link target="_blank" href="https://github.com/backstop-protocol/smart-ltv/blob/main/contracts/SmartLTV.sol" color="#3366CC">RiskDAO's Smart LTV formula</Link> which is based on on-chain risk data feeds provided by B.Protocol's Risk Oracle. <br /> The widget will generate a code with the configured parameters.
                    Read more about the Smart LTV formula <Link target="_blank" href="https://medium.com/risk-dao/a-smart-contract-formula-for-ltv-ratio-a60a8373d54d" color="#3366CC">here.</Link></div>
            </Box>
        </AccordionDetails>
        
    </Accordion>

}
export default LTVTextSectionMobile;