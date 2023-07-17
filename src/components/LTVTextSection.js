import { Box, Link, Typography } from "@mui/material";

import { useRef } from "react";

function LTVTextSection(){
    const containerRef = useRef();
    return<Box sx={{textAlign:"left", padding:"1vh 0 1vh 2vw", flex:"0 2 auto"}} ref={containerRef} rel="noreferrer noopener">
        <Typography variant="h5">Smart LTV Formula*</Typography>
        <Typography>Use the widget below to automatically calculate the recommended LTV according to RiskDAO's Smart LTV formula which is based on on-chain risk data feeds provided by B.Protocol's Risk Oracle. <br/> The widget will generate a code with the configured parameters.
            Read more about the Smart LTV formula <Link target="_blank" href="https://medium.com/risk-dao/a-smart-contract-formula-for-ltv-ratio-a60a8373d54d" color="#3366CC">here.</Link></Typography>
</Box>
}
export default LTVTextSection;